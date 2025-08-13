import { useState, useEffect } from 'react';
import { supabase, Document } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogOut, Shield, FileText, Upload, FolderOpen, BarChart3, Settings, TrendingUp, Users, HardDrive } from 'lucide-react';
import Login from '@/components/Login';
import DocumentManager from '@/components/DocumentManager';

export default function AdminDocumentos() {
  const { user, isAuthenticated, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('documents');
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalSize: 0,
    categoryCounts: {} as Record<string, number>,
    recentUploads: 0,
    totalUsers: 0
  });
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      loadRecentDocuments();
    }
  }, [isAuthenticated]);

  const loadStats = async () => {
    try {
      // Load document stats
      const { data: documents, error: docsError } = await supabase
        .from('documents')
        .select('category, file_size, created_at');

      if (docsError) {
        console.error('Error loading document stats:', docsError);
        return;
      }

      // Load user stats
      const { data: users, error: usersError } = await supabase
        .from('admin_users')
        .select('id');

      if (usersError) {
        console.error('Error loading user stats:', usersError);
      }

      // Calculate stats
      const totalSize = documents.reduce((sum, doc) => sum + doc.file_size, 0);
      const categoryCounts = documents.reduce((acc, doc) => {
        acc[doc.category] = (acc[doc.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Count recent uploads (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentUploads = documents.filter(doc => 
        new Date(doc.created_at) > thirtyDaysAgo
      ).length;

      setStats({
        totalDocuments: documents.length,
        totalSize,
        categoryCounts,
        recentUploads,
        totalUsers: users?.length || 0
      });
    } catch (error) {
      console.error('Error in loadStats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentDocuments = async () => {
    try {
      const { data: documents, error } = await supabase
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
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error loading recent documents:', error);
        return;
      }

      setRecentDocuments(documents || []);
    } catch (error) {
      console.error('Error in loadRecentDocuments:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getCategoryLabel = (category: string): string => {
    const categories = {
      gestao: 'Gestão',
      processos: 'Processos Eleitorais',
      estatuto: 'Estatuto',
      compras: 'Manual de Compras',
      documentos: 'Documentos Gerais',
      ouvidoria: 'Ouvidoria'
    };
    return categories[category as keyof typeof categories] || category;
  };

  if (!isAuthenticated) {
    return <Login onSuccess={() => setActiveTab('documents')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pentathlon-green to-pentathlon-blue rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-sm text-gray-600">FPPM - Federação Pernambucana de Pentatlo Moderno</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Alert */}
        <Alert className="mb-8 border-pentathlon-green/20 bg-pentathlon-green/5">
          <Shield className="h-4 w-4 text-pentathlon-green" />
          <AlertDescription className="text-pentathlon-green-dark">
            Bem-vindo ao painel administrativo! Gerencie documentos de transparência e eventos da FPPM.
          </AlertDescription>
        </Alert>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Documentos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</p>
                </div>
                <FileText className="w-8 h-8 text-pentathlon-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categorias</p>
                  <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.categoryCounts).length}</p>
                </div>
                <FolderOpen className="w-8 h-8 text-pentathlon-green" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Armazenamento</p>
                  <p className="text-2xl font-bold text-gray-900">{formatFileSize(stats.totalSize)}</p>
                </div>
                <HardDrive className="w-8 h-8 text-pentathlon-yellow" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários Admin</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documentos
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-6">
            <DocumentManager onDocumentAdded={() => {
              loadStats();
              loadRecentDocuments();
            }} />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <DocumentManager onDocumentAdded={() => {
              loadStats();
              loadRecentDocuments();
            }} />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-pentathlon-blue" />
                    Documentos Recentes
                  </CardTitle>
                  <CardDescription>
                    Últimos documentos adicionados ao sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pentathlon-blue"></div>
                    </div>
                  ) : recentDocuments.length > 0 ? (
                    <div className="space-y-4">
                      {recentDocuments.map(doc => (
                        <div key={doc.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                          <FileText className="w-4 h-4 text-pentathlon-blue mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm truncate">
                              {doc.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span>{getCategoryLabel(doc.category)}</span>
                              <span>{formatFileSize(doc.file_size)}</span>
                              <span>{new Date(doc.created_at).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                          <Badge variant="secondary" className="flex-shrink-0">
                            {getCategoryLabel(doc.category)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>Nenhum documento encontrado</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-pentathlon-green" />
                    Distribuição por Categoria
                  </CardTitle>
                  <CardDescription>
                    Quantidade de documentos por categoria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stats.categoryCounts).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded bg-pentathlon-blue/20"></div>
                          <span className="font-medium">{getCategoryLabel(category)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">{count}</span>
                          <span className="text-sm text-gray-600">
                            ({stats.totalDocuments > 0 ? Math.round((count / stats.totalDocuments) * 100) : 0}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-pentathlon-yellow" />
                    Estatísticas Rápidas
                  </CardTitle>
                  <CardDescription>
                    Informações resumidas do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Uploads recentes (30 dias)</span>
                      <span className="font-bold text-lg">{stats.recentUploads}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tamanho médio por arquivo</span>
                      <span className="font-bold text-lg">
                        {stats.totalDocuments > 0 ? formatFileSize(stats.totalSize / stats.totalDocuments) : '0 Bytes'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Categoria mais popular</span>
                      <span className="font-bold text-lg">
                        {Object.entries(stats.categoryCounts).length > 0
                          ? getCategoryLabel(
                              Object.entries(stats.categoryCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0]
                            )
                          : 'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-gray-600" />
                    Ações Rápidas
                  </CardTitle>
                  <CardDescription>
                    Shortcuts para tarefas comuns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      className="w-full justify-start bg-gradient-to-r from-pentathlon-green to-pentathlon-green-dark hover:from-pentathlon-green-dark hover:to-pentathlon-green"
                      onClick={() => setActiveTab('upload')}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Fazer Upload de Documento
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveTab('documents')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Gerenciar Documentos
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        loadStats();
                        loadRecentDocuments();
                      }}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Atualizar Estatísticas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Upload</CardTitle>
                  <CardDescription>
                    Configure as permissões e limites para upload de documentos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Tamanho Máximo</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          defaultValue="10"
                          className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
                          disabled
                        />
                        <span className="text-sm text-gray-600">MB</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Tipos Permitidos</label>
                      <div className="text-sm text-gray-600">
                        PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, WEBP
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informações do Sistema</CardTitle>
                  <CardDescription>
                    Detalhes sobre o sistema e armazenamento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Armazenamento Utilizado</h4>
                        <p className="text-sm text-gray-600">{formatFileSize(stats.totalSize)} em {stats.totalDocuments} arquivos</p>
                      </div>
                      <HardDrive className="w-8 h-8 text-pentathlon-blue" />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Usuários Administradores</h4>
                        <p className="text-sm text-gray-600">{stats.totalUsers} usuários com acesso ao painel</p>
                      </div>
                      <Users className="w-8 h-8 text-pentathlon-green" />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Categorias Ativas</h4>
                        <p className="text-sm text-gray-600">{Object.keys(stats.categoryCounts).length} categorias em uso</p>
                      </div>
                      <FolderOpen className="w-8 h-8 text-pentathlon-yellow" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
