import { Download, Eye, FileText, Users, Gavel, ShoppingCart, MessageSquare, Scale, Calendar, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Transparencia() {
  const documentos = {
    gestao: [
      {
        titulo: 'Estrutura Organizacional 2025',
        tipo: 'Organograma',
        data: '2025-01-01',
        tamanho: '2.1 MB',
        formato: 'PDF'
      },
      {
        titulo: 'Relatório de Atividades 2024',
        tipo: 'Relatório Anual',
        data: '2024-12-31',
        tamanho: '8.5 MB',
        formato: 'PDF'
      },
      {
        titulo: 'Diretoria Executiva - Mandato 2023-2027',
        tipo: 'Lista de Dirigentes',
        data: '2023-03-15',
        tamanho: '1.2 MB',
        formato: 'PDF'
      },
      {
        titulo: 'Regimento Interno',
        tipo: 'Documento Normativo',
        data: '2023-01-10',
        tamanho: '3.8 MB',
        formato: 'PDF'
      }
    ],
    processos: [
      {
        titulo: 'Edital de Convocação - Eleições 2027',
        tipo: 'Edital',
        data: '2026-11-15',
        tamanho: '1.8 MB',
        formato: 'PDF',
        status: 'Futuro'
      },
      {
        titulo: 'Ata da Assembleia Eleitoral 2023',
        tipo: 'Ata',
        data: '2023-03-15',
        tamanho: '4.2 MB',
        formato: 'PDF'
      },
      {
        titulo: 'Lista de Eleitores Aptos - 2023',
        tipo: 'Lista',
        data: '2023-02-28',
        tamanho: '0.8 MB',
        formato: 'PDF'
      },
      {
        titulo: 'Cronograma Eleitoral 2023',
        tipo: 'Cronograma',
        data: '2023-01-20',
        tamanho: '0.5 MB',
        formato: 'PDF'
      }
    ],
    estatuto: [
      {
        titulo: 'Estatuto da FPPM - Versão Atualizada',
        tipo: 'Estatuto Social',
        data: '2023-03-15',
        tamanho: '5.2 MB',
        formato: 'PDF'
      },
      {
        titulo: 'Alterações Estatutárias 2023',
        tipo: 'Emenda',
        data: '2023-03-15',
        tamanho: '1.1 MB',
        formato: 'PDF'
      },
      {
        titulo: 'Histórico de Alterações',
        tipo: 'Histórico',
        data: '2023-03-16',
        tamanho: '2.3 MB',
        formato: 'PDF'
      }
    ],
    compras: [
      {
        titulo: 'Manual de Compras e Contratações',
        tipo: 'Manual',
        data: '2024-01-15',
        tamanho: '6.7 MB',
        formato: 'PDF'
      },
      {
        titulo: 'Procedimentos Licitatórios',
        tipo: 'Norma',
        data: '2024-01-15',
        tamanho: '3.1 MB',
        formato: 'PDF'
      },
      {
        titulo: 'Relatório de Compras 2024',
        tipo: 'Relatório',
        data: '2024-12-31',
        tamanho: '4.8 MB',
        formato: 'PDF'
      },
      {
        titulo: 'Fornecedores Cadastrados',
        tipo: 'Lista',
        data: '2025-01-01',
        tamanho: '1.9 MB',
        formato: 'PDF'
      }
    ],
    documentos: [
      {
        titulo: 'Certidão de Utilidade Pública',
        tipo: 'Certidão',
        data: '2023-06-10',
        tamanho: '0.9 MB',
        formato: 'PDF'
      },
      {
        titulo: 'CNPJ e Inscrições',
        tipo: 'Documentação Legal',
        data: '2024-12-15',
        tamanho: '1.4 MB',
        formato: 'PDF'
      },
      {
        titulo: 'Demonstrações Financeiras 2024',
        tipo: 'Financeiro',
        data: '2024-12-31',
        tamanho: '7.2 MB',
        formato: 'PDF'
      },
      {
        titulo: 'Parecer do Conselho Fiscal 2024',
        tipo: 'Parecer',
        data: '2025-01-15',
        tamanho: '2.8 MB',
        formato: 'PDF'
      },
      {
        titulo: 'Certificado de Registro no CREF',
        tipo: 'Certificado',
        data: '2024-08-20',
        tamanho: '0.7 MB',
        formato: 'PDF'
      }
    ]
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

  function getStatusColor(status?: string) {
    switch (status) {
      case 'Futuro': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  }

  function renderDocumentCard(documento: any, index: number) {
    return (
      <Card key={index} className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-base">{documento.titulo}</CardTitle>
              <CardDescription className="mt-1">{documento.tipo}</CardDescription>
            </div>
            {documento.status && (
              <Badge className={getStatusColor(documento.status)}>{documento.status}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{new Date(documento.data).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText size={14} />
                <span>{documento.formato}</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Tamanho: {documento.tamanho}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Eye size={14} className="mr-1" />
                Visualizar
              </Button>
              <Button size="sm" className="flex-1 bg-pentathlon-green hover:bg-pentathlon-green-dark">
                <Download size={14} className="mr-1" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Transparência</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A Federação Pernambucana de Pentatlo Moderno está comprometida com a transparência e prestação de contas. 
            Aqui você encontra todas as informações sobre nossa gestão, processos e documentos institucionais.
          </p>
        </div>

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
          <TabsContent value="gestao" className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Users className="text-pentathlon-green" size={24} />
                Gestão e Governança
              </h2>
              <p className="text-gray-600">
                Informações sobre a estrutura organizacional, diretoria e relatórios de gestão da FPPM.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentos.gestao.map((documento, index) => renderDocumentCard(documento, index))}
            </div>
          </TabsContent>

          {/* Processos Eleitorais */}
          <TabsContent value="processos" className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Gavel className="text-pentathlon-blue" size={24} />
                Processos Eleitorais
              </h2>
              <p className="text-gray-600">
                Documentos relacionados aos processos eleitorais, editais e atas de assembleias.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentos.processos.map((documento, index) => renderDocumentCard(documento, index))}
            </div>
          </TabsContent>

          {/* Estatuto */}
          <TabsContent value="estatuto" className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Scale className="text-pentathlon-red" size={24} />
                Estatuto Social
              </h2>
              <p className="text-gray-600">
                Estatuto social da FPPM e suas alterações ao longo do tempo.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentos.estatuto.map((documento, index) => renderDocumentCard(documento, index))}
            </div>
          </TabsContent>

          {/* Manual de Compras */}
          <TabsContent value="compras" className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <ShoppingCart className="text-pentathlon-yellow" size={24} />
                Manual de Compras e Contratações
              </h2>
              <p className="text-gray-600">
                Procedimentos, normas e relatórios relacionados a compras e contratações da federação.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentos.compras.map((documento, index) => renderDocumentCard(documento, index))}
            </div>
          </TabsContent>

          {/* Documentos */}
          <TabsContent value="documentos" className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="text-gray-600" size={24} />
                Documentos Institucionais
              </h2>
              <p className="text-gray-600">
                Documentos legais, certidões, demonstrações financeiras e outros documentos oficiais.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentos.documentos.map((documento, index) => renderDocumentCard(documento, index))}
            </div>
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
