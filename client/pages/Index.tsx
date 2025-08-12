import { useEffect, useState } from 'react';
import { FileText, ChevronRight, Building, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="bg-pentathlon-green/10 text-pentathlon-green border-pentathlon-green">
                  Federação Pernambucana
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Pentatlo
                  <span className="text-pentathlon-green"> Moderno</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Promovendo a excelência esportiva e desenvolvimento do pentatlo moderno em Pernambuco através de 
                  transparência, governança e apoio aos atletas.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-pentathlon-green hover:bg-pentathlon-green-dark text-white">
                  <Link to="/transparencia" className="flex items-center gap-2">
                    <FileText size={20} />
                    Transparência
                    <ChevronRight size={20} />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-pentathlon-blue text-pentathlon-blue hover:bg-pentathlon-blue hover:text-white">
                  <Link to="/admin/eventos" className="flex items-center gap-2">
                    Administração
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pentathlon-green">80+</div>
                  <div className="text-sm text-gray-600">Atletas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pentathlon-blue">12</div>
                  <div className="text-sm text-gray-600">Cidades</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pentathlon-gold">25+</div>
                  <div className="text-sm text-gray-600">Eventos/Ano</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative mx-auto w-80 h-80 lg:w-96 lg:h-96">
                <img 
                  src="https://cdn.builder.io/api/v1/image/assets%2F83197d83cffa4d76b43dffc4a37dfe2d%2Fbb91c0eedcf347ef94d319f58f5bc083?format=webp&width=800" 
                  alt="Federação Pernambucana de Pentatlo Moderno" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-pentathlon-gold/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pentathlon-green/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modalidades Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">As Cinco Modalidades</h2>
            <p className="text-xl text-gray-600">O pentatlo moderno combina cinco disciplinas esportivas distintas</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              { icon: "🏃", name: "Corrida", description: "800m cross-country", color: "border-t-pentathlon-green" },
              { icon: "🏊", name: "Natação", description: "200m livre", color: "border-t-pentathlon-blue" },
              { icon: "🐎", name: "Hipismo", description: "Salto em obstáculos", color: "border-t-pentathlon-red" },
              { icon: "🤺", name: "Esgrima", description: "Espada", color: "border-t-gray-600" },
              { icon: "🎯", name: "Tiro", description: "Pistola laser", color: "border-t-pentathlon-yellow" }
            ].map((modalidade, index) => (
              <Card key={index} className={`text-center hover:shadow-lg transition-shadow border-0 bg-white border-t-4 ${modalidade.color}`}>
                <CardContent className="pt-6">
                  <div className="text-4xl mb-3">{modalidade.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{modalidade.name}</h3>
                  <p className="text-sm text-gray-600">{modalidade.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Transparência e Governança */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Transparência e Governança</h2>
            <p className="text-xl text-gray-600">Acesso completo às informações institucionais e de gestão</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              {
                icon: Building,
                title: "Gestão",
                description: "Estrutura organizacional e relatórios",
                link: "/transparencia",
                tab: "gestao"
              },
              {
                icon: FileText,
                title: "Processos Eleitorais",
                description: "Editais e documentos eleitorais",
                link: "/transparencia",
                tab: "processos"
              },
              {
                icon: FileText,
                title: "Estatuto",
                description: "Estatuto social e alterações",
                link: "/transparencia",
                tab: "estatuto"
              },
              {
                icon: FileText,
                title: "Manual de Compras",
                description: "Procedimentos e relatórios",
                link: "/transparencia",
                tab: "compras"
              },
              {
                icon: FileText,
                title: "Documentos",
                description: "Certidões e documentos legais",
                link: "/transparencia",
                tab: "documentos"
              },
              {
                icon: FileText,
                title: "Ouvidoria",
                description: "Canal de comunicação oficial",
                link: "/transparencia",
                tab: "ouvidoria"
              }
            ].map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-0 bg-white">
                <CardHeader className="text-center">
                  <item.icon size={32} className="text-pentathlon-green mb-2 mx-auto" />
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <CardDescription className="text-sm">{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    <Link to={item.link}>Acessar</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contato e Informações */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Informações de Contato</h2>
            <p className="text-xl text-gray-600">Entre em contato conosco</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 bg-white">
              <CardContent className="pt-6">
                <Building size={32} className="text-pentathlon-green mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Endereço</h3>
                <p className="text-gray-600">
                  Rua do Esporte, 123<br />
                  Boa Viagem, Recife/PE<br />
                  CEP: 51020-030
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-white">
              <CardContent className="pt-6">
                <Phone size={32} className="text-pentathlon-blue mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Telefone</h3>
                <p className="text-gray-600">
                  (81) 3234-5678<br />
                  Segunda a Sexta<br />
                  8h às 17h
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-white">
              <CardContent className="pt-6">
                <FileText size={32} className="text-pentathlon-red mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">E-mail</h3>
                <p className="text-gray-600">
                  contato@fppm.org.br<br />
                  ouvidoria@fppm.org.br<br />
                  presidencia@fppm.org.br
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-pentathlon-green text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Transparência em Primeiro Lugar</h2>
          <p className="text-xl mb-8 opacity-90">
            Acesse todas as informações sobre nossa gestão e governança
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-pentathlon-green hover:bg-gray-100">
              <Link to="/transparencia">Ver Transparência</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pentathlon-green">
              Fale com a Ouvidoria
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
