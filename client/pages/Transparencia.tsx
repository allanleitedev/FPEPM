import { useState, useEffect } from 'react';
import { Download, Eye, FileText, Users, Gavel, ShoppingCart, MessageSquare, Scale, Calendar, Building, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase, Document, CATEGORIES, formatFileSize, getFileIcon } from '@/lib/supabase';

export default function Transparencia() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError('');

      // Check if we're in demo mode or if Supabase is available
      const isDemoMode = localStorage.getItem('fppm_auth_demo');

      if (isDemoMode) {
        // Use demo data
        const { demoStorage } = await import('@/lib/demoData');
        const demoDocuments = demoStorage.getDocuments();
        setDocuments(demoDocuments);
      } else {
        // Try Supabase
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
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setDocuments(data || []);
      }
    } catch (err: any) {
      console.warn('Failed to load documents from Supabase, falling back to demo mode:', err);
      // Fallback to demo data
      try {
        const { demoStorage } = await import('@/lib/demoData');
        const demoDocuments = demoStorage.getDocuments();
        setDocuments(demoDocuments);
        setError('Conectado em modo demonstração. Dados limitados.');
      } catch (demoErr) {
        console.error('Error loading demo documents:', demoErr);
        setError('Erro ao carregar documentos. Tente novamente mais tarde.');
        setDocuments([]);
      }
    } finally {
      setLoading(false);
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
      console.error('Error downloading file:', err);
      alert('Erro ao baixar arquivo. Tente novamente.');
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
      console.error('Error viewing file:', err);
      alert('Erro ao visualizar arquivo. Tente novamente.');
    }
  };

  const getDocumentsByCategory = (category: string) => {
    return documents.filter(doc => doc.category === category);
  };

  const contatos = {
    ouvidoria: {
      email: 'ouvidoria@fppm.org.br',
      telefone: '(81) 3234-5678',
      endereco: 'Rua do Esporte, 123 - Boa Viagem, Recife/PE',
      horario: 'Segunda a Sexta: 8h às 17h'
    },
    presidencia: {
      email: 'presidencia@fppm.org.br',
      telefone: '(81) 3234-5670'
    }
  };

  function renderDocumentCard(documento: Document, index: number) {
    const categoryData = CATEGORIES.find(cat => cat.value === documento.category);
    
    return (
      <Card key={documento.id} className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/80 backdrop-blur-sm group animate-in slide-in-from-bottom duration-700" style={{animationDelay: `${index * 100}ms`}}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-base group-hover:text-pentathlon-green transition-colors">{documento.title}</CardTitle>
              <CardDescription className="mt-1 group-hover:text-gray-700">{categoryData?.label}</CardDescription>
            </div>
            <div className="text-2xl">{getFileIcon(documento.file_type)}</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documento.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{documento.description}</p>
            )}
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 group-hover:text-gray-700">
              <div className="flex items-center gap-1 hover:scale-105 transition-transform">
                <Calendar size={14} className="text-pentathlon-blue" />
                <span>{new Date(documento.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center gap-1 hover:scale-105 transition-transform">
                <FileText size={14} className="text-pentathlon-green" />
                <span>{documento.file_type.split('/')[1]?.toUpperCase()}</span>
              </div>
            </div>
            <div className="text-sm text-gray-500 group-hover:text-gray-600">
              Tamanho: {formatFileSize(documento.file_size)}
            </div>
            {documento.admin_users && (
              <div className="text-xs text-gray-500">
                Enviado por: {documento.admin_users.name}
              </div>
            )}
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 hover:scale-105 transition-all duration-200 group-hover:border-pentathlon-blue group-hover:text-pentathlon-blue"
                onClick={() => handleViewDocument(documento)}
              >
                <Eye size={14} className="mr-1" />
                Visualizar
              </Button>
              <Button 
                size="sm" 
                className="flex-1 bg-pentathlon-green hover:bg-pentathlon-green-dark hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={() => handleDownloadDocument(documento)}
              >
                <Download size={14} className="mr-1" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  function renderCategoryContent(category: string, icon: any, title: string, description: string) {
    const categoryDocs = getDocumentsByCategory(category);
    
    return (
      <div className="mt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
            {icon}
            {title}
          </h2>
          <p className="text-gray-600">{description}</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-pentathlon-blue" />
            <span className="ml-2 text-gray-600">Carregando documentos...</span>
          </div>
        ) : categoryDocs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryDocs.map((documento, index) => renderDocumentCard(documento, index))}
          </div>
        ) : (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Nenhum documento disponível
              </h3>
              <p className="text-gray-500 text-center">
                Não há documentos publicados nesta categoria no momento.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pentathlon-green/20 via-pentathlon-blue/20 to-pentathlon-gold/25 py-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-pentathlon-green/25 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-pentathlon-blue/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-0 left-1/3 w-48 h-48 bg-pentathlon-gold/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      <div className="absolute bottom-0 right-1/3 w-56 h-56 bg-pentathlon-red/15 rounded-full blur-3xl animate-pulse delay-3000"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-in slide-in-from-top duration-1000 bg-gradient-to-r from-pentathlon-green to-pentathlon-blue bg-clip-text text-transparent">
            Transparência
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-in slide-in-from-bottom duration-1000 delay-300">
            A Federação Pernambucana de Pentatlo Moderno está comprometida com a transparência e prestação de contas.
            Aqui você encontra todas as informações sobre nossa gestão, processos e documentos institucionais.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="gestao" className="w-full">
          {/* Mobile Tabs */}
          <div className="block md:hidden">
            <TabsList className="grid w-full grid-cols-2 gap-1 h-auto p-1">
              <TabsTrigger value="gestao" className="text-xs py-2">Gestão</TabsTrigger>
              <TabsTrigger value="processos" className="text-xs py-2">Processos</TabsTrigger>
              <TabsTrigger value="estatuto" className="text-xs py-2">Estatuto</TabsTrigger>
              <TabsTrigger value="compras" className="text-xs py-2">Compras</TabsTrigger>
              <TabsTrigger value="documentos" className="text-xs py-2">Documentos</TabsTrigger>
              <TabsTrigger value="ouvidoria" className="text-xs py-2">Ouvidoria</TabsTrigger>
            </TabsList>
          </div>

          {/* Tablet Tabs */}
          <div className="hidden md:block lg:hidden">
            <TabsList className="grid w-full grid-cols-3 gap-1 h-auto p-1">
              <TabsTrigger value="gestao" className="text-sm py-2">Gestão</TabsTrigger>
              <TabsTrigger value="processos" className="text-sm py-2">Processos</TabsTrigger>
              <TabsTrigger value="estatuto" className="text-sm py-2">Estatuto</TabsTrigger>
              <TabsTrigger value="compras" className="text-sm py-2">Compras</TabsTrigger>
              <TabsTrigger value="documentos" className="text-sm py-2">Documentos</TabsTrigger>
              <TabsTrigger value="ouvidoria" className="text-sm py-2">Ouvidoria</TabsTrigger>
            </TabsList>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden lg:block">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="gestao">Gestão</TabsTrigger>
              <TabsTrigger value="processos">Processos Eleitorais</TabsTrigger>
              <TabsTrigger value="estatuto">Estatuto</TabsTrigger>
              <TabsTrigger value="compras">Manual de Compras</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
              <TabsTrigger value="ouvidoria">Ouvidoria</TabsTrigger>
            </TabsList>
          </div>

          {/* Gestão */}
          <TabsContent value="gestao">
            {renderCategoryContent(
              'gestao',
              <Users className="text-pentathlon-green" size={24} />,
              'Gestão e Governança',
              'Informações sobre a estrutura organizacional, diretoria e relatórios de gestão da FPPM.'
            )}
          </TabsContent>

          {/* Processos Eleitorais */}
          <TabsContent value="processos">
            {renderCategoryContent(
              'processos',
              <Gavel className="text-pentathlon-blue" size={24} />,
              'Processos Eleitorais',
              'Documentos relacionados aos processos eleitorais, editais e atas de assembleias.'
            )}
          </TabsContent>

          {/* Estatuto */}
          <TabsContent value="estatuto">
            {renderCategoryContent(
              'estatuto',
              <Scale className="text-pentathlon-red" size={24} />,
              'Estatuto Social',
              'Estatuto social da FPPM e suas alterações ao longo do tempo.'
            )}
          </TabsContent>

          {/* Manual de Compras */}
          <TabsContent value="compras">
            {renderCategoryContent(
              'compras',
              <ShoppingCart className="text-pentathlon-yellow" size={24} />,
              'Manual de Compras e Contratações',
              'Procedimentos, normas e relatórios relacionados a compras e contratações da federação.'
            )}
          </TabsContent>

          {/* Documentos */}
          <TabsContent value="documentos">
            {renderCategoryContent(
              'documentos',
              <FileText className="text-gray-600" size={24} />,
              'Documentos Institucionais',
              'Documentos legais, certidões, demonstrações financeiras e outros documentos oficiais.'
            )}
          </TabsContent>

          {/* Ouvidoria */}
          <TabsContent value="ouvidoria" className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MessageSquare className="text-pentathlon-green" size={24} />
                Ouvidoria
              </h2>
              <p className="text-gray-600">
                Canal oficial para sugestões, reclamações, denúncias e elogios.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Informações de Contato */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Como Entrar em Contato</CardTitle>
                  <CardDescription>
                    Utilize os canais abaixo para entrar em contato com nossa ouvidoria
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building size={20} className="text-pentathlon-green mt-1" />
                    <div>
                      <div className="font-medium">Endereço</div>
                      <div className="text-sm text-gray-600">{contatos.ouvidoria.endereco}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MessageSquare size={20} className="text-pentathlon-green mt-1" />
                    <div>
                      <div className="font-medium">E-mail</div>
                      <div className="text-sm text-gray-600">{contatos.ouvidoria.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FileText size={20} className="text-pentathlon-green mt-1" />
                    <div>
                      <div className="font-medium">Telefone</div>
                      <div className="text-sm text-gray-600">{contatos.ouvidoria.telefone}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar size={20} className="text-pentathlon-green mt-1" />
                    <div>
                      <div className="font-medium">Horário de Funcionamento</div>
                      <div className="text-sm text-gray-600">{contatos.ouvidoria.horario}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tipos de Manifestação */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Tipos de Manifestação</CardTitle>
                  <CardDescription>
                    Entenda os diferentes tipos de manifestação que você pode fazer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-4 border-l-green-400 pl-4">
                    <div className="font-medium text-green-700">Elogio</div>
                    <div className="text-sm text-gray-600">
                      Manifestação de satisfação sobre serviços ou atendimento
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-l-blue-400 pl-4">
                    <div className="font-medium text-blue-700">Sugestão</div>
                    <div className="text-sm text-gray-600">
                      Proposta para melhoria dos serviços prestados
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-l-orange-400 pl-4">
                    <div className="font-medium text-orange-700">Reclamação</div>
                    <div className="text-sm text-gray-600">
                      Manifestação de insatisfação sobre serviços
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-l-red-400 pl-4">
                    <div className="font-medium text-red-700">Denúncia</div>
                    <div className="text-sm text-gray-600">
                      Comunicação de irregularidades ou ilegalidades
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <Button size="lg" className="bg-pentathlon-green hover:bg-pentathlon-green-dark">
                <MessageSquare size={20} className="mr-2" />
                Fazer uma Manifestação
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
