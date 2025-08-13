import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Download, Eye, Trash2, Plus, Calendar, FileType, HardDrive } from 'lucide-react';
import FileUpload from './FileUpload';

interface DocumentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: string;
  url: string;
  uploadDate: string;
  title?: string;
  description?: string;
  tags?: string[];
}

const CATEGORIES = [
  { value: 'gestao', label: 'Gestão' },
  { value: 'processos', label: 'Processos Eleitorais' },
  { value: 'estatuto', label: 'Estatuto' },
  { value: 'compras', label: 'Manual de Compras' },
  { value: 'documentos', label: 'Documentos Gerais' },
  { value: 'ouvidoria', label: 'Ouvidoria' }
];

interface DocumentManagerProps {
  onDocumentAdded?: (document: DocumentFile) => void;
}

export default function DocumentManager({ onDocumentAdded }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isAddingDocument, setIsAddingDocument] = useState(false);
  const [currentFile, setCurrentFile] = useState<DocumentFile | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');

  const handleFileUploaded = (uploadedFile: any) => {
    setCurrentFile(uploadedFile);
  };

  const handleSaveDocument = () => {
    if (!currentFile || !documentTitle || !selectedCategory) {
      return;
    }

    const document: DocumentFile = {
      ...currentFile,
      title: documentTitle,
      description: documentDescription,
      category: selectedCategory,
      tags: documentDescription.split(' ').filter(word => word.length > 3).slice(0, 3)
    };

    setDocuments(prev => [...prev, document]);
    onDocumentAdded?.(document);
    
    // Reset form
    setCurrentFile(null);
    setDocumentTitle('');
    setDocumentDescription('');
    setSelectedCategory('');
    setIsAddingDocument(false);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    if (type.includes('sheet') || type.includes('excel')) return '📊';
    if (type.includes('image')) return '🖼️';
    return '📁';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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
                Faça upload de um documento e preencha as informações necessárias
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
                    {CATEGORIES.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedCategory && (
                <FileUpload
                  onFileUploaded={handleFileUploaded}
                  category={selectedCategory}
                />
              )}
              
              {currentFile && (
                <div className="space-y-4">
                  <Alert className="border-green-200 bg-green-50">
                    <FileText className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Arquivo "{currentFile.name}" carregado com sucesso!
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Documento*</Label>
                    <Input
                      id="title"
                      value={documentTitle}
                      onChange={(e) => setDocumentTitle(e.target.value)}
                      placeholder="Ex: Relatório de Atividades 2024"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={documentDescription}
                      onChange={(e) => setDocumentDescription(e.target.value)}
                      placeholder="Descrição detalhada do documento..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentFile(null);
                        setDocumentTitle('');
                        setDocumentDescription('');
                        setIsAddingDocument(false);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSaveDocument}
                      disabled={!documentTitle || !selectedCategory}
                      className="bg-gradient-to-r from-pentathlon-green to-pentathlon-green-dark hover:from-pentathlon-green-dark hover:to-pentathlon-green"
                    >
                      Salvar Documento
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {documents.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum documento adicionado</h3>
            <p className="text-gray-500 text-center mb-4">
              Comece adicionando documentos para organizar a transparência da federação
            </p>
            <Button
              onClick={() => setIsAddingDocument(true)}
              variant="outline"
              className="border-pentathlon-green text-pentathlon-green hover:bg-pentathlon-green hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Documento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {documents.map(document => (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-3xl">{getFileIcon(document.type)}</div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {document.title || document.name}
                      </h3>
                      
                      {document.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {document.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary">
                          {CATEGORIES.find(cat => cat.value === document.category)?.label}
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
                          {new Date(document.uploadDate).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <HardDrive className="w-3 h-3" />
                          {formatFileSize(document.size)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileType className="w-3 h-3" />
                          {document.type.split('/')[1]?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteDocument(document.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
