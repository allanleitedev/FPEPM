import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Modalidades() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pentathlon-green/20 via-pentathlon-blue/15 to-pentathlon-gold/20 py-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pentathlon-green/25 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-pentathlon-blue/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pentathlon-red/15 rounded-full blur-3xl animate-pulse delay-1500"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="animate-in slide-in-from-left duration-700">
            <Link to="/">
              <Button variant="outline" className="mb-4 hover:scale-105 transition-all duration-200 group">
                <ChevronLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Voltar ao Início
              </Button>
            </Link>
          </div>
          <div className="text-center animate-in slide-in-from-top duration-1000 delay-300">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-pentathlon-green to-pentathlon-blue bg-clip-text text-transparent">
              Conheça o Pentatlo Moderno
            </h1>
            <div className="max-w-4xl mx-auto space-y-4">
              <p className="text-xl text-gray-600 leading-relaxed animate-in slide-in-from-bottom duration-700 delay-500">
                É um desporto olímpico praticado por homens e por mulheres, individualmente ou em equipes.
                Compõe-se de cinco modalidades diferentes: hipismo, esgrima, natação, tiro esportivo e corrida.
              </p>
              <p className="text-lg text-gray-600 animate-in slide-in-from-bottom duration-700 delay-700">
                É proclamado vencedor aquele que obtiver o melhor desempenho geral ao somar mais pontos.
                Por essa variedade de esportes, <strong className="text-pentathlon-green animate-pulse">o vencedor do pentatlo é considerado o atleta mais completo</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Modalidades Detalhadas */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Natação */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm border-l-4 border-l-pentathlon-blue hover:shadow-xl hover:-translate-y-2 hover:bg-blue-50/30 transition-all duration-300 group animate-in slide-in-from-left duration-700 delay-300 overflow-hidden">
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src="https://images.pexels.com/photos/6011899/pexels-photo-6011899.jpeg"
                alt="Atleta de natação"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <CardTitle className="text-2xl text-white drop-shadow-lg">Natação</CardTitle>
                <CardDescription className="text-lg text-gray-200">200 metros estilo livre</CardDescription>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700">
                Os atletas nadam 200 metros estilo livre contra o relógio. Quanto mais rápido o tempo, maior a pontuação obtida.
                O tempo de referência é <strong className="text-pentathlon-blue">2 minutos e 30 segundos, equivalente a 250 pontos</strong>.
                A cada 0,50 segundo abaixo ou acima desse tempo, 1 ponto é adicionado ou subtraído da pontuação total do atleta.
              </p>
            </CardContent>
          </Card>

          {/* Esgrima */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm border-l-4 border-l-gray-600 hover:shadow-xl hover:-translate-y-2 hover:bg-gray-50/50 transition-all duration-300 group animate-in slide-in-from-right duration-700 delay-500 overflow-hidden">
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src="https://images.pexels.com/photos/6539009/pexels-photo-6539009.jpeg"
                alt="Atleta de esgrima"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <CardTitle className="text-2xl text-white drop-shadow-lg">Esgrima</CardTitle>
                <CardDescription className="text-lg text-gray-200">Espada - Sistema renovado</CardDescription>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-3">
                <p className="text-gray-600 group-hover:text-gray-700">
                  A prova de esgrima sofreu alterações após os Jogos Olímpicos de Paris 2024 e agora é composta por dois eventos principais:
                </p>
                <div className="space-y-2">
                  <div className="group-hover:bg-white/50 p-2 rounded transition-colors">
                    <strong className="text-gray-800">Ranking Round:</strong>
                    <span className="text-gray-600 ml-1">Sistema "todos contra todos". Cada duelo dura máximo 1 minuto ou até o primeiro toque.</span>
                  </div>
                  <div className="group-hover:bg-white/50 p-2 rounded transition-colors">
                    <strong className="text-gray-800">Eliminação Direta:</strong>
                    <span className="text-gray-600 ml-1">Semifinais e finais com chaveamento baseado no ranking prévio, começando com 32 atletas.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prova de Obstáculos */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm border-l-4 border-l-pentathlon-red hover:shadow-xl hover:-translate-y-2 hover:bg-red-50/30 transition-all duration-300 group animate-in slide-in-from-left duration-700 delay-700 overflow-hidden">
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src="https://images.pexels.com/photos/3763879/pexels-photo-3763879.jpeg"
                alt="Atleta saltando obstáculo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <CardTitle className="text-2xl text-white drop-shadow-lg">Prova de Obstáculos</CardTitle>
                <CardDescription className="text-lg text-gray-200">70 metros com 8 obstáculos</CardDescription>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-3">
                <p className="text-gray-600 group-hover:text-gray-700">
                  Percurso de 70 metros com um circuito padronizado de 8 obstáculos variados, que exigem força, agilidade,
                  coordenação, equilíbrio e tomada rápida de decisão. A prova é disputada em duas raias simultaneamente.
                </p>
                <div className="bg-gray-50 p-3 rounded-lg group-hover:bg-white/80 transition-colors">
                  <p className="text-sm text-gray-600">
                    <strong className="text-pentathlon-red">Pontuação:</strong> 250 pontos base para 65 segundos. A cada 0,33 segundo acima ou abaixo,
                    a pontuação é ajustada para mais ou menos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Laser Run */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm border-l-4 border-l-pentathlon-yellow hover:shadow-xl hover:-translate-y-2 hover:bg-yellow-50/30 transition-all duration-300 group animate-in slide-in-from-right duration-700 delay-900 overflow-hidden">
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src="https://images.pexels.com/photos/6091867/pexels-photo-6091867.jpeg"
                alt="Tiro esportivo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <CardTitle className="text-2xl text-white drop-shadow-lg">Corrida e Tiro a Laser</CardTitle>
                <CardDescription className="text-lg text-gray-200">3.200m + 4 séries de tiro</CardDescription>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-3">
                <p className="text-gray-600 group-hover:text-gray-700">
                  Percurso de 3.200 metros com largada tipo "HANDICAP" baseada na classificação das provas anteriores.
                  A cada 800 metros, os atletas param para o tiro.
                </p>
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded-lg text-sm group-hover:bg-white/80 transition-colors">
                    <strong className="text-yellow-700">Tiro:</strong> 4 séries de 5 acertos cada, máximo 50s por série,
                    alvo a 10m, posição de pé com uma mão, sem apoio.
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm group-hover:bg-white/80 transition-colors">
                    <strong className="text-yellow-700">Largada:</strong> Diferença de 20 pontos = 20 segundos de intervalo entre atletas.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo Visual das 5 Modalidades */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg animate-in slide-in-from-bottom duration-1000 delay-1000">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">As Cinco Modalidades em Resumo</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              {
                image: "https://images.pexels.com/photos/6011899/pexels-photo-6011899.jpeg",
                alt: "Atleta de natação",
                name: "Natação",
                detail: "200m livre",
                points: "250 pts base (2:30)",
                color: "hover:bg-blue-50"
              },
              {
                image: "https://images.pexels.com/photos/6539009/pexels-photo-6539009.jpeg",
                alt: "Atleta de esgrima",
                name: "Esgrima",
                detail: "Espada",
                points: "Ranking + Eliminação",
                color: "hover:bg-gray-50"
              },
              {
                image: "https://images.pexels.com/photos/3763879/pexels-photo-3763879.jpeg",
                alt: "Atleta saltando obstáculo",
                name: "Obstáculos",
                detail: "70m/8 obstáculos",
                points: "250 pts base (65s)",
                color: "hover:bg-red-50"
              },
              {
                image: "https://images.pexels.com/photos/6091867/pexels-photo-6091867.jpeg",
                alt: "Tiro esportivo",
                name: "Tiro Laser",
                detail: "4 séries/5 tiros",
                points: "Max 50s/série",
                color: "hover:bg-yellow-50"
              },
              {
                image: "https://images.pexels.com/photos/5843529/pexels-photo-5843529.jpeg",
                alt: "Atleta correndo",
                name: "Corrida",
                detail: "3.200m",
                points: "Largada handicap",
                color: "hover:bg-green-50"
              }
            ].map((modalidade, index) => (
              <Card key={index} className={`text-center border-0 bg-gray-50/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${modalidade.color} animate-in slide-in-from-bottom duration-700 overflow-hidden`} style={{animationDelay: `${1200 + index * 100}ms`}}>
                <CardContent className="p-0">
                  <div className="relative h-24 w-full overflow-hidden">
                    <img
                      src={modalidade.image}
                      alt={modalidade.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-800">{modalidade.name}</h4>
                    <p className="text-sm text-gray-600 mb-2 group-hover:text-gray-700">{modalidade.detail}</p>
                    <p className="text-xs text-gray-500 group-hover:text-gray-600">{modalidade.points}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg animate-in slide-in-from-bottom duration-1000 delay-1500">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8 bg-gradient-to-r from-pentathlon-green to-pentathlon-blue bg-clip-text text-transparent">
            Sistema de Pontuação
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="animate-in slide-in-from-left duration-700 delay-1700">
              <h4 className="text-lg font-semibold text-pentathlon-green mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-pentathlon-green rounded-full animate-pulse"></span>
                Como Funciona
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li className="hover:text-gray-800 hover:translate-x-2 transition-all duration-200">• Cada modalidade contribui com pontos para o total</li>
                <li className="hover:text-gray-800 hover:translate-x-2 transition-all duration-200">• 250 pontos é a referência base para cada prova</li>
                <li className="hover:text-gray-800 hover:translate-x-2 transition-all duration-200">• O tempo/performance define pontos ganhos ou perdidos</li>
                <li className="hover:text-gray-800 hover:translate-x-2 transition-all duration-200">• O atleta com maior pontuação total vence</li>
              </ul>
            </div>
            <div className="animate-in slide-in-from-right duration-700 delay-1900">
              <h4 className="text-lg font-semibold text-pentathlon-blue mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-pentathlon-blue rounded-full animate-pulse delay-500"></span>
                Sequência de Provas
              </h4>
              <ol className="space-y-2 text-gray-600">
                <li className="hover:text-gray-800 hover:translate-x-2 transition-all duration-200">1. Esgrima (Ranking Round)</li>
                <li className="hover:text-gray-800 hover:translate-x-2 transition-all duration-200">2. Natação (200m livre)</li>
                <li className="hover:text-gray-800 hover:translate-x-2 transition-all duration-200">3. Prova de Obstáculos</li>
                <li className="hover:text-gray-800 hover:translate-x-2 transition-all duration-200">4. Laser Run (Corrida + Tiro)</li>
                <li className="hover:text-gray-800 hover:translate-x-2 transition-all duration-200">5. Esgrima (Eliminação Direta) - Finais</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
