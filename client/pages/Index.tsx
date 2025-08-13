import { useEffect, useState } from 'react';
import { FileText, ChevronRight, Building, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pentathlon-green/15 via-pentathlon-blue/10 to-pentathlon-gold/15 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-pentathlon-green/20 via-pentathlon-blue/15 to-pentathlon-red/15 animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pentathlon-gold/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pentathlon-red/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-pentathlon-blue/20 rounded-full blur-2xl animate-pulse delay-1500"></div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 md:py-32 z-10">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            <div className="text-center mb-12">
              <div className="relative mx-auto w-64 h-64 mb-8 animate-in slide-in-from-top duration-1000">
                <div className="animate-bounce-slow">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F83197d83cffa4d76b43dffc4a37dfe2d%2Fbb91c0eedcf347ef94d319f58f5bc083?format=webp&width=800"
                    alt="Federação Pernambucana de Pentatlo Moderno"
                    className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-pentathlon-gold/30 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-pentathlon-green/30 rounded-full blur-xl animate-pulse delay-500"></div>
              </div>

              <div className="space-y-6 animate-in slide-in-from-bottom duration-1000 delay-300">
                <p className="text-lg text-gray-600 leading-relaxed px-4">
                  Promovendo a excelência esportiva e desenvolvimento do pentatlo moderno em Pernambuco através de
                  transparência, governança e apoio aos atletas.
                </p>

                <div className="flex flex-col gap-4 px-4">
                  <Button size="lg" className="bg-gradient-to-r from-pentathlon-green to-pentathlon-green-dark hover:from-pentathlon-green-dark hover:to-pentathlon-green text-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <Link to="/transparencia" className="flex items-center gap-2">
                      <FileText size={20} />
                      Transparência
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button size="lg" className="bg-gradient-to-r from-pentathlon-blue to-pentathlon-blue-dark hover:from-pentathlon-blue-dark hover:to-pentathlon-blue text-white transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg">
                    <Link to="/modalidades" className="flex items-center gap-2">
                      Conheça o Esporte
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative animate-in slide-in-from-left duration-1000">
              <div className="relative mx-auto w-96 h-96">
                <div className="animate-bounce-slow">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F83197d83cffa4d76b43dffc4a37dfe2d%2Fbb91c0eedcf347ef94d319f58f5bc083?format=webp&width=800"
                    alt="Federação Pernambucana de Pentatlo Moderno"
                    className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-pentathlon-gold/30 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pentathlon-green/30 rounded-full blur-xl animate-pulse delay-700"></div>
              </div>
            </div>

            <div className="space-y-8 animate-in slide-in-from-right duration-1000 delay-300">
              <div className="space-y-6">
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                  Promovendo a excelência esportiva e desenvolvimento do pentatlo moderno em Pernambuco através de
                  transparência, governança e apoio aos atletas.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-pentathlon-green to-pentathlon-green-dark hover:from-pentathlon-green-dark hover:to-pentathlon-green text-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl group">
                  <Link to="/transparencia" className="flex items-center gap-2">
                    <FileText size={20} />
                    Transparência
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" className="bg-gradient-to-r from-pentathlon-blue to-pentathlon-blue-dark hover:from-pentathlon-blue-dark hover:to-pentathlon-blue text-white transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg group">
                  <Link to="/modalidades" className="flex items-center gap-2">
                    Conheça o Esporte
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modalidades Resumo */}
      <section className="py-16 px-4 bg-gradient-to-br from-pentathlon-blue/20 via-pentathlon-green/15 to-pentathlon-gold/20 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-pentathlon-green/15 via-pentathlon-blue/20 to-pentathlon-red/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 animate-in slide-in-from-top duration-1000">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">As Cinco Modalidades</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              O pentatlo moderno é um esporte olímpico que combina cinco disciplinas diferentes.
              O vencedor é considerado <strong className="text-pentathlon-green animate-pulse">o atleta mais completo</strong>.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
            {[
              {
                image: "https://images.pexels.com/photos/8028676/pexels-photo-8028676.jpeg",
                alt: "Nadadores competindo em piscina",
                name: "Natação",
                detail: "200m livre",
                color: "border-t-pentathlon-blue",
                bg: "bg-blue-50/80 hover:bg-blue-100/90 border-blue-200"
              },
              {
                image: "https://cdn.builder.io/api/v1/image/assets%2F83197d83cffa4d76b43dffc4a37dfe2d%2F012611ee462247a48ebea259fbbf8e73?format=webp&width=800",
                alt: "Esgrimistas em competição",
                name: "Esgrima",
                detail: "Espada",
                color: "border-t-gray-600",
                bg: "bg-gray-50/80 hover:bg-gray-100/90 border-gray-200"
              },
              {
                image: "https://cdn.builder.io/api/v1/image/assets%2F83197d83cffa4d76b43dffc4a37dfe2d%2F56e0d16e18784bd9ada52cb61f7ee084?format=webp&width=800",
                alt: "Atleta em prova de obstáculos",
                name: "Obstáculos",
                detail: "70m/8 obstáculos",
                color: "border-t-pentathlon-red",
                bg: "bg-red-50/80 hover:bg-red-100/90 border-red-200"
              },
              {
                image: "https://cdn.builder.io/api/v1/image/assets%2F83197d83cffa4d76b43dffc4a37dfe2d%2Fb1f3a3babed345f6be5ae06201ecbb90?format=webp&width=800",
                alt: "Atleta em competição de tiro laser",
                name: "Tiro Laser",
                detail: "4 séries/5 tiros",
                color: "border-t-pentathlon-yellow",
                bg: "bg-yellow-50/80 hover:bg-yellow-100/90 border-yellow-200"
              },
              {
                image: "https://images.pexels.com/photos/34514/spot-runs-start-la.jpg",
                alt: "Atletas correndo em competição",
                name: "Corrida",
                detail: "3.200m",
                color: "border-t-pentathlon-green",
                bg: "bg-green-50/80 hover:bg-green-100/90 border-green-200"
              }
            ].map((modalidade, index) => (
              <Card key={index} className={`text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-t-4 ${modalidade.color} ${modalidade.bg} cursor-pointer group animate-in slide-in-from-bottom duration-700 overflow-hidden`} style={{animationDelay: `${index * 100}ms`}}>
                <Link to="/modalidades">
                  <CardContent className="p-0">
                    <div className="relative h-32 w-full overflow-hidden">
                      <img
                        src={modalidade.image}
                        alt={modalidade.alt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-800">{modalidade.name}</h3>
                      <p className="text-sm text-gray-600 group-hover:text-gray-700">{modalidade.detail}</p>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          <div className="text-center animate-in slide-in-from-bottom duration-1000 delay-700">
            <Link to="/modalidades">
              <Button size="lg" variant="outline" className="border-pentathlon-green text-pentathlon-green hover:bg-pentathlon-green hover:text-white transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg group">
                Saiba Mais Sobre as Modalidades
                <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Transparência e Governança */}
      <section className="py-16 px-4 bg-gradient-to-br from-pentathlon-green/10 via-pentathlon-blue/15 to-pentathlon-green/20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pentathlon-blue/10 via-transparent to-pentathlon-green/15"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 animate-in slide-in-from-top duration-1000">
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
                tab: "gestao",
                color: "bg-blue-50/80 hover:bg-blue-100/90 border-blue-200"
              },
              {
                icon: FileText,
                title: "Processos Eleitorais",
                description: "Editais e documentos eleitorais",
                link: "/transparencia",
                tab: "processos",
                color: "bg-purple-50/80 hover:bg-purple-100/90 border-purple-200"
              },
              {
                icon: FileText,
                title: "Estatuto",
                description: "Estatuto social e alterações",
                link: "/transparencia",
                tab: "estatuto",
                color: "bg-green-50/80 hover:bg-green-100/90 border-green-200"
              },
              {
                icon: FileText,
                title: "Manual de Compras",
                description: "Procedimentos e relatórios",
                link: "/transparencia",
                tab: "compras",
                color: "bg-yellow-50/80 hover:bg-yellow-100/90 border-yellow-200"
              },
              {
                icon: FileText,
                title: "Documentos",
                description: "Certidões e documentos legais",
                link: "/transparencia",
                tab: "documentos",
                color: "bg-gray-50/80 hover:bg-gray-100/90 border-gray-200"
              },
              {
                icon: FileText,
                title: "Ouvidoria",
                description: "Canal de comunicação oficial",
                link: "/transparencia",
                tab: "ouvidoria",
                color: "bg-red-50/80 hover:bg-red-100/90 border-red-200"
              }
            ].map((item, index) => (
              <Card key={index} className={`hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border ${item.color} backdrop-blur-sm group cursor-pointer animate-in slide-in-from-bottom duration-700`} style={{animationDelay: `${index * 100}ms`}}>
                <CardHeader className="text-center">
                  <item.icon size={32} className="text-pentathlon-green mb-2 mx-auto group-hover:scale-110 group-hover:text-pentathlon-green-dark transition-all duration-300" />
                  <CardTitle className="text-base group-hover:text-gray-800">{item.title}</CardTitle>
                  <CardDescription className="text-sm group-hover:text-gray-700">{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full group-hover:border-pentathlon-green group-hover:text-pentathlon-green transition-colors">
                    <Link to={item.link}>Acessar</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contato e Informações */}
      <section className="py-16 px-4 bg-gradient-to-br from-pentathlon-blue/25 via-pentathlon-green/20 to-pentathlon-gold/25 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pentathlon-green/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-pentathlon-blue/25 rounded-full blur-3xl"></div>
        <div className="absolute center w-32 h-32 bg-pentathlon-red/15 rounded-full blur-2xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 animate-in slide-in-from-top duration-1000">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Informações de Contato</h2>
            <p className="text-xl text-gray-600">Entre em contato conosco</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border border-green-200 bg-green-50/90 backdrop-blur-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group animate-in slide-in-from-left duration-700 hover:bg-green-100/95">
              <CardContent className="pt-6">
                <Building size={32} className="text-pentathlon-green mb-4 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-pentathlon-green">Endereço</h3>
                <p className="text-gray-600 group-hover:text-gray-700">
                  Rua do Esporte, 123<br />
                  Boa Viagem, Recife/PE<br />
                  CEP: 51020-030
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border border-blue-200 bg-blue-50/90 backdrop-blur-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group animate-in slide-in-from-bottom duration-700 delay-200 hover:bg-blue-100/95">
              <CardContent className="pt-6">
                <Phone size={32} className="text-pentathlon-blue mb-4 mx-auto group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-pentathlon-blue">Telefone</h3>
                <p className="text-gray-600 group-hover:text-gray-700">
                  (81) 3234-5678<br />
                  Segunda a Sexta<br />
                  8h às 17h
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border border-red-200 bg-red-50/90 backdrop-blur-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group animate-in slide-in-from-right duration-700 delay-400 hover:bg-red-100/95">
              <CardContent className="pt-6">
                <FileText size={32} className="text-pentathlon-red mb-4 mx-auto group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-pentathlon-red">E-mail</h3>
                <p className="text-gray-600 group-hover:text-gray-700">
                  contato@fppm.org.br<br />
                  ouvidoria@fppm.org.br<br />
                  presidencia@fppm.org.br
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </div>
  );
}
