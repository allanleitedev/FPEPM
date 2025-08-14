import { useState, useEffect } from 'react';
import { supabase, Document, testSupabaseConnection, getSupabaseConfig, DocCategory } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogOut, Shield, FileText, FolderOpen, BarChart3, Settings, TrendingUp, Users, HardDrive, AlertCircle, Eye, EyeOff, Trash2 } from 'lucide-react';
import Login from '@/components/Login';
import DocumentManager from '@/components/DocumentManager';

export default function AdminDocumentos() {
  const { user, isAuthenticated, signOut, isDemoMode } = useAuth();
  const [activeTab, setActiveTab] = useState('documents');
  const [categories, setCategories] = useState<DocCategory[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', visible: true });
  const [catSaving, setCatSaving] = useState(false);
  const [catError, setCatError] = useState<string>('');
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalSize: 0,
    categoryCounts: {} as Record<string, number>,
    recentUploads: 0,
    totalUsers: 0
  });
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingConnection, setTestingConnection] = useState(false);
  const [maxUploadMB, setMaxUploadMB] = useState(10);

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      loadRecentDocuments();
      loadCategories();
      loadMaxUploadSize();
    }
  }, [isAuthenticated]);

  const loadMaxUploadSize = async () => {
    try {
      const { data } = await supabase.from('app_settings').select('value').eq('key','max_upload_mb').single();
      const mb = data?.value ? parseInt(data.value, 10) : 10;
      if (!isNaN(mb)) {
        setMaxUploadMB(mb);
      }
    } catch {
      // Se não conseguir carregar, mantém o padrão
      setMaxUploadMB(10);
    }
  };
  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('doc_categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error) setCategories(data || []);
  };

  const slugify = (s: string) => s
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const addCategory = async () => {
    try {
      setCatError('');
      setCatSaving(true);
      const name = newCategory.name.trim();
      const slug = (newCategory.slug.trim() || slugify(newCategory.name));
      if (!name || !slug) {
        setCatError('Preencha nome e/ou slug');
        return;
      }
      const { error } = await supabase
        .from('doc_categories')
        .insert({ name, slug, visible: newCategory.visible })
        .select()
        .single();
      if (error) {
        setCatError(error.message || 'Erro ao salvar categoria');
        return;
      }
      setNewCategory({ name: '', slug: '', visible: true });
      await loadCategories();
    } catch (e: any) {
      setCatError(e.message || 'Erro ao salvar categoria');
    } finally {
      setCatSaving(false);
    }
  };

  const toggleCategoryVisibility = async (cat: DocCategory) => {
    await supabase.from('doc_categories').update({ visible: !cat.visible }).eq('id', cat.id);
    loadCategories();
  };

  const removeCategory = async (cat: DocCategory) => {
    await supabase.from('doc_categories').delete().eq('id', cat.id);
    loadCategories();
  };

  const loadStats = async () => {
    try {
      // Check if we're in demo mode
      const isDemoMode = localStorage.getItem('fppm_auth_demo');
      let documents, users;

      if (isDemoMode) {
        // Produção: ignorar modo demo
        documents = [];
        users = [];
      } else {
        // Supabase
        const { data: docsData, error: docsError } = await supabase
          .from('documents')
          .select('category, file_size, created_at');

        if (docsError) {
          throw docsError;
        }

        const { data: usersData, error: usersError } = await supabase
          .from('admin_users')
          .select('id');

        if (usersError) {
          console.warn('Error loading user stats:', usersError);
        }

        documents = docsData || [];
        users = usersData || [];
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
      console.warn('Failed to load stats from Supabase, falling back to demo mode:', error);
      // Fallback to demo data
      try {
        const { demoStorage, demoAdminUsers } = await import('@/lib/demoData');
        const documents = demoStorage.getDocuments();
        const users = demoAdminUsers;

        const totalSize = documents.reduce((sum, doc) => sum + doc.file_size, 0);
        const categoryCounts = documents.reduce((acc, doc) => {
          acc[doc.category] = (acc[doc.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

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
      } catch (demoErr) {
        console.error('Error loading document stats:', demoErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadRecentDocuments = async () => {
    try {
      // Supabase
      const { data, error } = await supabase
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
          throw error;
        }

        const documents = data || [];
        setRecentDocuments(documents);
    } catch (error) {
      console.warn('Failed to load recent documents from Supabase:', error);
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

  const handleTestConnection = async () => {
    setTestingConnection(true);
    try {
      const result = await testSupabaseConnection();

      const detailsText = result.details ? '\n\nDetalhes:\n' + result.details.join('\n') : '';

      if (result.connected) {
        // Se conectado, remover modo demo e recarregar
        localStorage.removeItem('fppm_auth_demo');
        alert(`✅ Conexão com Supabase funcionando!${detailsText}\n\nRecarregando página para usar dados reais...`);
        window.location.reload();
      } else {
        let instructions = '';

        if (result.error?.includes('RLS') || result.details?.some(d => d.includes('RLS'))) {
          instructions = `\n\n🔧 SOLUÇÃO PARA PROBLEMAS DE RLS:\n\n1. Vá para Supabase SQL Editor\n2. Copie e execute o arquivo "fix_rls_policies.sql"\n3. Isso criará políticas mais permissivas\n4. Teste a conexão novamente`;
        } else if (result.details?.some(d => d.includes('Tabela'))) {
          instructions = `\n\n🔧 SOLUÇÃO PARA TABELAS:\n\n1. Vá para Supabase SQL Editor\n2. Execute o arquivo "supabase_setup.sql"\n3. Isso criará todas as tabelas necessárias`;
        } else {
          instructions = `\n\n🔧 VERIFIQUE:\n\n1. URL do Supabase está correta\n2. API Key está correta\n3. Projeto está ativo no Supabase`;
        }

        alert(`❌ Falha na conexão: ${result.error}${detailsText}${instructions}`);
      }
    } catch (error: any) {
      alert(`❌ Erro ao testar conexão: ${error.message}`);
    } finally {
      setTestingConnection(false);
    }
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
            
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
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
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Categorias
            </TabsTrigger>
          </TabsList>
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Categorias</CardTitle>
                <CardDescription>Crie, oculte ou remova categorias de documentos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input className="px-3 py-2 border rounded" placeholder="Nome" value={newCategory.name} onChange={e=>setNewCategory(v=>({...v,name:e.target.value}))} />
                  <input className="px-3 py-2 border rounded" placeholder="slug (opcional)" value={newCategory.slug} onChange={e=>setNewCategory(v=>({...v,slug:e.target.value}))} />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={newCategory.visible} onChange={e=>setNewCategory(v=>({...v,visible:e.target.checked}))} />
                    Visível
                  </label>
                  <Button onClick={addCategory} disabled={catSaving}>
                    {catSaving ? 'Salvando...' : 'Adicionar'}
                  </Button>
                </div>
                {catError && (
                  <div className="text-sm text-red-600">{catError}</div>
                )}

                <div className="space-y-3">
                  {categories.map(cat => (
                    <div key={cat.id} className={`flex items-center justify-between border-2 p-4 rounded-lg transition-all ${
                      cat.visible 
                        ? 'border-green-200 bg-green-50/30' 
                        : 'border-gray-200 bg-gray-50/30'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          cat.visible ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-gray-900">{cat.name}</div>
                            <Badge variant={cat.visible ? "default" : "secondary"} className="text-xs">
                              {cat.visible ? 'Visível' : 'Oculta'}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">slug: {cat.slug}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => toggleCategoryVisibility(cat)}
                          className={cat.visible 
                            ? "border-orange-300 text-orange-700 hover:bg-orange-50" 
                            : "border-green-300 text-green-700 hover:bg-green-50"
                          }
                        >
                          {cat.visible ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-1" />
                              Ocultar
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-1" />
                              Mostrar
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-red-300 text-red-700 hover:bg-red-50" 
                          onClick={() => {
                            if (window.confirm(`Tem certeza que deseja excluir a categoria "${cat.name}"?`)) {
                              removeCategory(cat);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
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
                      onClick={() => setActiveTab('documents')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Gerenciar Documentos
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
                          min="1"
                          max="100"
                          value={maxUploadMB}
                          className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
                          onChange={(e) => {
                            const mb = Math.max(1, Math.min(100, parseInt(e.target.value||'10',10)));
                            setMaxUploadMB(mb);
                          }}
                          onBlur={async (e)=>{
                            const mb = Math.max(1, parseInt(e.target.value||'10',10));
                            try {
                              const { error } = await supabase.from('app_settings').upsert({ key:'max_upload_mb', value: String(mb) });
                              if (!error) {
                                // Feedback visual rápido
                                e.target.style.borderColor = 'green';
                                setTimeout(() => { e.target.style.borderColor = ''; }, 1000);
                              }
                            } catch (err) {
                              console.warn('Erro ao salvar configuração:', err);
                              e.target.style.borderColor = 'red';
                              setTimeout(() => { e.target.style.borderColor = ''; }, 1000);
                            }
                          }}
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
