import { useState } from 'react';
import { Calendar, MapPin, Users, Clock, CheckCircle, XCircle, Eye, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  expectedParticipants: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  documents?: string[];
  budget?: number;
  notes?: string;
}

export default function AdminEventos() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'CBPM 2025 - Campeonato Brasileiro de Pentatlo Moderno',
      description: 'Campeonato nacional com atletas de todo o Brasil, incluindo as cinco modalidades do pentatlo moderno.',
      date: '12-14 Dezembro 2025',
      location: 'Recife, Pernambuco',
      organizer: 'Federação Pernambucana de Pentatlo',
      expectedParticipants: 120,
      status: 'pending',
      submittedAt: '2025-01-10',
      budget: 85000,
      notes: 'Evento de grande porte que requer aprovação da diretoria'
    },
    {
      id: '2',
      title: 'Copa Jovens Talentos',
      description: 'Competição voltada para atletas sub-18 nas modalidades de pentatlo moderno.',
      date: '20-21 Março 2025',
      location: 'Brasília, DF',
      organizer: 'Clube de Pentatlo de Brasília',
      expectedParticipants: 60,
      status: 'pending',
      submittedAt: '2025-01-08',
      budget: 25000
    }
  ]);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');

  const handleApproval = (eventId: string, approved: boolean) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, status: approved ? 'approved' : 'rejected', notes: approvalNotes }
        : event
    ));
    setApprovalNotes('');
    setSelectedEvent(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      default: return status;
    }
  };

  const pendingEvents = events.filter(event => event.status === 'pending');
  const processedEvents = events.filter(event => event.status !== 'pending');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Administração de Eventos</h1>
          <p className="text-gray-600">Gerencie e aprove eventos da confederação</p>
        </div>

        {/* Eventos Pendentes */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Eventos Pendentes</h2>
            <Badge className="bg-yellow-100 text-yellow-800">{pendingEvents.length}</Badge>
          </div>

          {pendingEvents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-gray-400 mb-4">
                  <CheckCircle size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento pendente</h3>
                <p className="text-gray-600">Todos os eventos foram processados!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {pendingEvents.map((event) => (
                <Card key={event.id} className="border-l-4 border-l-yellow-400">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <CardDescription className="mt-1">{event.description}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(event.status)}>{getStatusText(event.status)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        <span>{event.expectedParticipants} atletas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span>Submetido em {new Date(event.submittedAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    {event.budget && (
                      <div className="text-sm">
                        <span className="font-medium">Orçamento:</span> R$ {event.budget.toLocaleString('pt-BR')}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedEvent(event)}>
                            <Eye size={16} className="mr-2" />
                            Revisar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{event.title}</DialogTitle>
                            <DialogDescription>Detalhes completos do evento para aprovação</DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            <div>
                              <h4 className="font-semibold mb-2">Informações Gerais</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="font-medium">Data:</span> {event.date}</div>
                                <div><span className="font-medium">Local:</span> {event.location}</div>
                                <div><span className="font-medium">Organizador:</span> {event.organizer}</div>
                                <div><span className="font-medium">Participantes:</span> {event.expectedParticipants}</div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Descrição</h4>
                              <p className="text-sm text-gray-600">{event.description}</p>
                            </div>

                            {event.budget && (
                              <div>
                                <h4 className="font-semibold mb-2">Orçamento</h4>
                                <p className="text-sm">R$ {event.budget.toLocaleString('pt-BR')}</p>
                              </div>
                            )}

                            <div>
                              <Label htmlFor="approval-notes">Observações da Aprovação</Label>
                              <Textarea
                                id="approval-notes"
                                placeholder="Adicione observações ou condições para a aprovação..."
                                value={approvalNotes}
                                onChange={(e) => setApprovalNotes(e.target.value)}
                                className="mt-2"
                              />
                            </div>

                            <div className="flex gap-3">
                              <Button 
                                className="flex-1 bg-pentathlon-green hover:bg-pentathlon-green-dark"
                                onClick={() => handleApproval(event.id, true)}
                              >
                                <CheckCircle size={16} className="mr-2" />
                                Aprovar Evento
                              </Button>
                              <Button 
                                variant="destructive" 
                                className="flex-1"
                                onClick={() => handleApproval(event.id, false)}
                              >
                                <XCircle size={16} className="mr-2" />
                                Rejeitar Evento
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Eventos Processados */}
        {processedEvents.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Eventos Processados</h2>
            <div className="grid lg:grid-cols-3 gap-4">
              {processedEvents.map((event) => (
                <Card key={event.id} className={`border-l-4 ${event.status === 'approved' ? 'border-l-green-400' : 'border-l-red-400'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{event.title}</CardTitle>
                      <Badge className={getStatusColor(event.status)}>{getStatusText(event.status)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>{event.date}</div>
                      <div>{event.location}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
