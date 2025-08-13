import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogOut, Shield, FileText, Users, BarChart3, Settings, Upload, FolderOpen } from 'lucide-react';
import Login from '@/components/Login';
import DocumentManager from '@/components/DocumentManager';

export default function AdminDocumentos() {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('documents');

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
                onClick={logout}
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
            Bem-vindo ao painel administrativo! Aqui você pode gerenciar documentos de transparência da FPPM.
          </AlertDescription>
        </Alert>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Documentos</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
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
                  <p className="text-2xl font-bold text-gray-900">6</p>
                </div>
                <FolderOpen className="w-8 h-8 text-pentathlon-green" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Acessos/Mês</p>
                  <p className="text-2xl font-bold text-gray-900">1.2k</p>
                </div>
                <BarChart3 className="w-8 h-8 text-pentathlon-yellow" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                </div>
                <Settings className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documentos
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Documentos Publicados</CardTitle>
                <CardDescription>
                  Gerencie todos os documentos de transparência publicados no site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Lista de documentos existentes */}
                  <div className="grid gap-4">
                    {[
                      { category: 'Gestão', title: 'Estrutura Organizacional 2025', date: '2025-01-01', size: '2.1 MB' },
                      { category: 'Gestão', title: 'Relatório de Atividades 2024', date: '2024-12-31', size: '8.5 MB' },
                      { category: 'Processos', title: 'Ata da Assembleia Eleitoral 2023', date: '2023-03-15', size: '4.2 MB' },
                      { category: 'Estatuto', title: 'Estatuto Social Vigente', date: '2023-01-10', size: '2.8 MB' }
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <FileText className="w-8 h-8 text-pentathlon-blue" />
                          <div>
                            <h4 className="font-medium text-gray-900">{doc.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <Badge variant="secondary">{doc.category}</Badge>
                              <span>{new Date(doc.date).toLocaleDateString('pt-BR')}</span>
                              <span>{doc.size}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">Editar</Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            Remover
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <DocumentManager />
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
                  <CardTitle>Permissões de Usuário</CardTitle>
                  <CardDescription>
                    Gerencie as permissões de acesso ao sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Administradores</h4>
                        <p className="text-sm text-gray-600">Acesso completo ao sistema</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">2 usuários</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Moderadores</h4>
                        <p className="text-sm text-gray-600">Podem adicionar e editar documentos</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">1 usuário</Badge>
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
