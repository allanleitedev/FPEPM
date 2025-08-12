import { Calendar, Trophy, Users, FileText, ChevronRight, Star, Medal, Target } from 'lucide-react';
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
                  Confederação Brasileira
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Pentatlo
                  <span className="text-pentathlon-green"> Moderno</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Promovendo a excelência esportiva e desenvolvimento do pentatlo moderno no Brasil através de eventos nacionais, 
                  transparência e apoio aos atletas.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-pentathlon-green hover:bg-pentathlon-green-dark text-white">
                  <Link to="/eventos" className="flex items-center gap-2">
                    Próximos Eventos
                    <ChevronRight size={20} />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-pentathlon-blue text-pentathlon-blue hover:bg-pentathlon-blue hover:text-white">
                  <Link to="/transparencia" className="flex items-center gap-2">
                    <FileText size={20} />
                    Transparência
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pentathlon-green">150+</div>
                  <div className="text-sm text-gray-600">Atletas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pentathlon-blue">25</div>
                  <div className="text-sm text-gray-600">Estados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pentathlon-gold">50+</div>
                  <div className="text-sm text-gray-600">Eventos/Ano</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative mx-auto w-80 h-80 lg:w-96 lg:h-96">
                <img 
                  src="https://cdn.builder.io/api/v1/image/assets%2F83197d83cffa4d76b43dffc4a37dfe2d%2F64c4550af4cc44819ea4276fee6fe144?format=webp&width=800" 
                  alt="Confederação Brasileira de Pentatlo Moderno" 
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
              { icon: "🏃", name: "Corrida", description: "800m cross-country" },
              { icon: "🏊", name: "Natação", description: "200m livre" },
              { icon: "🐎", name: "Hipismo", description: "Salto em obstáculos" },
              { icon: "🤺", name: "Esgrima", description: "Espada" },
              { icon: "🎯", name: "Tiro", description: "Pistola laser" }
            ].map((modalidade, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 bg-white">
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

      {/* Próximos Eventos */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Próximos Eventos</h2>
              <p className="text-xl text-gray-600">Acompanhe os principais campeonatos e competições</p>
            </div>
            <Button variant="outline" className="hidden md:flex">
              <Link to="/eventos" className="flex items-center gap-2">
                Ver Todos
                <ChevronRight size={16} />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Approved Events */}
            {[
              { title: "Copa Regional Nordeste", date: "15-16 Mar", location: "Salvador, BA", status: "Confirmado" },
              { title: "Campeonato Estadual SP", date: "22-23 Mar", location: "São Paulo, SP", status: "Confirmado" },
              { title: "Torneio Regional Sul", date: "05-06 Abr", location: "Porto Alegre, RS", status: "Confirmado" }
            ].map((evento, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{evento.date}</Badge>
                    <Badge className="bg-pentathlon-green text-white text-xs">{evento.status}</Badge>
                  </div>
                  <CardTitle className="text-lg">{evento.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      {evento.location}
                    </div>
                    <Button variant="outline" className="w-full">
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Transparência */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Transparência</h2>
            <p className="text-xl text-gray-600">Comprometidos com a transparência e prestação de contas</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "Relatórios Financeiros",
                description: "Demonstrativos e balancetes atualizados mensalmente",
                link: "/transparencia/financeiro"
              },
              {
                icon: Users,
                title: "Gestão",
                description: "Informações sobre diretoria e estrutura organizacional",
                link: "/transparencia/gestao"
              },
              {
                icon: Trophy,
                title: "Resultados",
                description: "Rankings, resultados e estatísticas dos atletas",
                link: "/transparencia/resultados"
              }
            ].map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-0 bg-white">
                <CardHeader>
                  <item.icon size={32} className="text-pentathlon-blue mb-2" />
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Link to={item.link}>Acessar</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-pentathlon-green text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Junte-se ao Pentatlo Moderno</h2>
          <p className="text-xl mb-8 opacity-90">
            Descubra como se tornar parte da comunidade do pentatlo moderno brasileiro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-pentathlon-green hover:bg-gray-100">
              Encontrar Clube
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pentathlon-green">
              Fale Conosco
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
