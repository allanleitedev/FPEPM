import { useState, useEffect } from 'react';
import { supabase, Document, formatFileSize, getFileIcon, withTimeout, DocCategory, CATEGORIES } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Download, Eye, Trash2, Plus, Calendar, FileType, HardDrive, Loader2, AlertCircle } from 'lucide-react';
import { FileUploadWithForm } from './FileUpload';

interface DocumentManagerProps {
  onDocumentAdded?: (document: Document) => void;
}

export default function DocumentManager({ onDocumentAdded }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<DocCategory[]>([]);
  const [isAddingDocument, setIsAddingDocument] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadDocuments();
    // load categories visible
    (async () => {
      const { data } = await supabase.from('doc_categories').select('*').eq('visible', true).order('sort_order', { ascending: true });
      setCategories(data || []);
    })();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError('');

      // Supabase
        const { data, error } = await withTimeout(
          supabase
          .from('documents')
          .select(`
            *,
            admin_users (
              id,
              name,
              email,
              role
            )
          `)
          .order('created_at', { ascending: false }),
        6000);

        if (error) {
          throw error;
        }

        setDocuments(data || []);
    } catch (err: any) {
      console.warn('Failed to load documents from Supabase:', err);
      setError('Erro ao carregar documentos');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUploaded = (document: Document) => {
    setDocuments(prev => [document, ...prev]);
    onDocumentAdded?.(document);
    setSelectedCategory('');
    setIsAddingDocument(false);
  };

  const handleDeleteDocument = async (document: Document) => {
    if (!user || (user.role !== 'admin' && document.uploaded_by !== user.id)) {
      setError('Você não tem permissão para deletar este documento');
      return;
    }

    const confirmDelete = window.confirm(
      `Tem certeza que deseja deletar "${document.title}"? Esta ação não pode ser desfeita.`
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(document.id);
      setError('');

      // Check if we're in demo mode
      const isDemoMode = localStorage.getItem('fppm_auth_demo');

      if (isDemoMode) {
        // Use demo data
        const { demoStorage } = await import('@/lib/demoData');
        demoStorage.removeDocument(document.id);
        // Remove from local state
        setDocuments(prev => prev.filter(doc => doc.id !== document.id));
      } else {
        // Delete file from storage first
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([document.file_path]);

        if (storageError) {
          console.warn('Warning: Could not delete file from storage:', storageError);
          // Continue with database deletion even if storage deletion fails
        }

        // Delete document record from database
        const { error: dbError } = await supabase
          .from('documents')
          .delete()
          .eq('id', document.id);

        if (dbError) {
          throw dbError;
        }

        // Remove from local state
        setDocuments(prev => prev.filter(doc => doc.id !== document.id));
      }

    } catch (err: any) {
      console.warn('Failed to delete from Supabase, trying demo mode:', err);
      // Fallback to demo mode
      try {
        const { demoStorage } = await import('@/lib/demoData');
        demoStorage.removeDocument(document.id);
        // Remove from local state
        setDocuments(prev => prev.filter(doc => doc.id !== document.id));
        setError('Documento deletado em modo demonstração');
      } catch (demoErr) {
        setError('Erro ao deletar documento');
        console.error('Error deleting document:', demoErr);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadDocument = async (document: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_path);

      if (error) {
        throw error;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.file_name;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Erro ao baixar arquivo');
      console.error('Error downloading file:', err);
    }
  };

  const handleViewDocument = async (document: Document) => {
    try {
      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(document.file_path);

      if (data.publicUrl) {
        window.open(data.publicUrl, '_blank');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao visualizar arquivo');
      console.error('Error viewing file:', err);
    }
  };

  const filteredDocuments = selectedCategory && selectedCategory !== 'all'
    ? documents.filter(doc => doc.category === selectedCategory)
    : documents;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-pentathlon-blue" />
          <span className="ml-2 text-gray-600">Buscando documentos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciamento de Documentos</h2>
          <p className="text-gray-600">Adicione, organize e gerencie documentos de transparência</p>
        </div>
        
        <Dialog open={isAddingDocument} onOpenChange={setIsAddingDocument}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pentathlon-green to-pentathlon-green-dark hover:from-pentathlon-green-dark hover:to-pentathlon-green">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Documento
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Documento</DialogTitle>
              <DialogDescription>
                Selecione uma categoria e faça upload de um documento
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria*</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedCategory && (
                <FileUploadWithForm
                  onFileUploaded={handleFileUploaded}
                  category={selectedCategory}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter by Category */}
      <div className="flex items-center gap-4">
        <Label>Filtrar por categoria:</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCategory && selectedCategory !== 'all' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            Limpar filtro
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {filteredDocuments.length === 0 && !loading ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {selectedCategory ? 'Nenhum documento nesta categoria' : 'Nenhum documento adicionado'}
            </h3>
            <p className="text-gray-500 text-center mb-4">
              {selectedCategory 
                ? `Não há documentos na categoria "${categories.find(c => c.slug === selectedCategory)?.name}"`
                : 'Comece adicionando documentos para organizar a transparência da federação'
              }
            </p>
            <Button
              onClick={() => setIsAddingDocument(true)}
              variant="outline"
              className="border-pentathlon-green text-pentathlon-green hover:bg-pentathlon-green hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Documento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredDocuments.map(document => (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-3xl">{getFileIcon(document.file_type)}</div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {document.title}
                      </h3>
                      
                      {document.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {document.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary">
                          {categories.find(cat => cat.slug === document.category)?.name || 
                           CATEGORIES.find(cat => cat.value === document.category)?.label ||
                           document.category}
                        </Badge>
                        {document.tags?.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(document.created_at).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <HardDrive className="w-3 h-3" />
                          {formatFileSize(document.file_size)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileType className="w-3 h-3" />
                          {document.file_type.split('/')[1]?.toUpperCase()}
                        </span>
                        {document.admin_users && (
                          <span className="text-gray-600">
                            por {document.admin_users.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDocument(document)}
                      title="Visualizar"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadDocument(document)}
                      title="Baixar"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    {(user?.role === 'admin' || document.uploaded_by === user?.id) && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteDocument(document)}
                        disabled={deletingId === document.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Deletar"
                      >
                        {deletingId === document.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
