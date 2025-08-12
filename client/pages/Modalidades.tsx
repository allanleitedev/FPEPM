import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Modalidades() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline" className="mb-4">
              <ChevronLeft size={16} className="mr-2" />
              Voltar ao Início
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Conheça o Pentatlo Moderno</h1>
            <div className="max-w-4xl mx-auto space-y-4">
              <p className="text-xl text-gray-600 leading-relaxed">
                É um desporto olímpico praticado por homens e por mulheres, individualmente ou em equipes. 
                Compõe-se de cinco modalidades diferentes: hipismo, esgrima, natação, tiro esportivo e corrida.
              </p>
              <p className="text-lg text-gray-600">
                É proclamado vencedor aquele que obtiver o melhor desempenho geral ao somar mais pontos. 
                Por essa variedade de esportes, <strong className="text-pentathlon-green">o vencedor do pentatlo é considerado o atleta mais completo</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Modalidades Detalhadas */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Natação */}
          <Card className="border-0 bg-white border-l-4 border-l-pentathlon-blue">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-6xl">🏊</div>
                <div>
                  <CardTitle className="text-2xl text-pentathlon-blue">Natação</CardTitle>
                  <CardDescription className="text-lg">200 metros estilo livre</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Os atletas nadam 200 metros estilo livre contra o relógio. Quanto mais rápido o tempo, maior a pontuação obtida. 
                O tempo de referência é <strong>2 minutos e 30 segundos, equivalente a 250 pontos</strong>. 
                A cada 0,50 segundo abaixo ou acima desse tempo, 1 ponto é adicionado ou subtraído da pontuação total do atleta.
              </p>
            </CardContent>
          </Card>

          {/* Esgrima */}
          <Card className="border-0 bg-white border-l-4 border-l-gray-600">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-6xl">🤺</div>
                <div>
                  <CardTitle className="text-2xl text-gray-600">Esgrima</CardTitle>
                  <CardDescription className="text-lg">Espada - Sistema renovado</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600">
                  A prova de esgrima sofreu alterações após os Jogos Olímpicos de Paris 2024 e agora é composta por dois eventos principais:
                </p>
                <div className="space-y-2">
                  <div>
                    <strong className="text-gray-800">Ranking Round:</strong> 
                    <span className="text-gray-600 ml-1">Sistema "todos contra todos". Cada duelo dura máximo 1 minuto ou até o primeiro toque.</span>
                  </div>
                  <div>
                    <strong className="text-gray-800">Eliminação Direta:</strong> 
                    <span className="text-gray-600 ml-1">Semifinais e finais com chaveamento baseado no ranking prévio, começando com 32 atletas.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prova de Obstáculos */}
          <Card className="border-0 bg-white border-l-4 border-l-pentathlon-red">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-6xl">🏃‍♂️</div>
                <div>
                  <CardTitle className="text-2xl text-pentathlon-red">Prova de Obstáculos</CardTitle>
                  <CardDescription className="text-lg">70 metros com 8 obstáculos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600">
                  Percurso de 70 metros com um circuito padronizado de 8 obstáculos variados, que exigem força, agilidade, 
                  coordenação, equilíbrio e tomada rápida de decisão. A prova é disputada em duas raias simultaneamente.
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Pontuação:</strong> 250 pontos base para 65 segundos. A cada 0,33 segundo acima ou abaixo, 
                    a pontuação é ajustada para mais ou menos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Laser Run */}
          <Card className="border-0 bg-white border-l-4 border-l-pentathlon-yellow">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-6xl">🎯</div>
                <div>
                  <CardTitle className="text-2xl text-yellow-600">Corrida e Tiro a Laser</CardTitle>
                  <CardDescription className="text-lg">3.200m + 4 séries de tiro</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600">
                  Percurso de 3.200 metros com largada tipo "HANDICAP" baseada na classificação das provas anteriores. 
                  A cada 800 metros, os atletas param para o tiro.
                </p>
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <strong className="text-gray-800">Tiro:</strong> 4 séries de 5 acertos cada, máximo 50s por série, 
                    alvo a 10m, posição de pé com uma mão, sem apoio.
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <strong className="text-gray-800">Largada:</strong> Diferença de 20 pontos = 20 segundos de intervalo entre atletas.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo Visual das 5 Modalidades */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">As Cinco Modalidades em Resumo</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: "🏊", name: "Natação", detail: "200m livre", points: "250 pts base (2:30)" },
              { icon: "🤺", name: "Esgrima", detail: "Espada", points: "Ranking + Eliminação" },
              { icon: "🏃‍♂️", name: "Obstáculos", detail: "70m/8 obstáculos", points: "250 pts base (65s)" },
              { icon: "🎯", name: "Tiro Laser", detail: "4 séries/5 tiros", points: "Max 50s/série" },
              { icon: "🏃", name: "Corrida", detail: "3.200m", points: "Largada handicap" }
            ].map((modalidade, index) => (
              <Card key={index} className="text-center border-0 bg-gray-50 hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-3">{modalidade.icon}</div>
                  <h4 className="font-semibold text-gray-900 mb-1">{modalidade.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{modalidade.detail}</p>
                  <p className="text-xs text-gray-500">{modalidade.points}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Sistema de Pontuação</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-pentathlon-green mb-4">Como Funciona</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Cada modalidade contribui com pontos para o total</li>
                <li>• 250 pontos é a referência base para cada prova</li>
                <li>• O tempo/performance define pontos ganhos ou perdidos</li>
                <li>• O atleta com maior pontuação total vence</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-pentathlon-blue mb-4">Sequência de Provas</h4>
              <ol className="space-y-2 text-gray-600">
                <li>1. Esgrima (Ranking Round)</li>
                <li>2. Natação (200m livre)</li>
                <li>3. Prova de Obstáculos</li>
                <li>4. Laser Run (Corrida + Tiro)</li>
                <li>5. Esgrima (Eliminação Direta) - Finais</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
