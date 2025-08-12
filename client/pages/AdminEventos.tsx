import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, CheckCircle, XCircle, Eye, Edit, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { eventsApi, Event, getStrapiMediaUrl, handleStrapiError, mockData } from '@/lib/strapi';
import { toast } from 'sonner';

export default function AdminEventos() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    organizer: '',
    expectedParticipants: '',
    budget: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from Strapi, fallback to mock data
      try {
        const response = await eventsApi.getEvents({ 
          populate: 'image',
          sort: 'createdAt:desc' 
        });
        setEvents(response.data);
      } catch (strapiError) {
        console.warn('Strapi not available, using mock data with pending events');
        // Add CBPM 2025 as pending event to mock data
        const mockEvents = [
          {
            id: 999,
            title: 'CBPM 2025 - Campeonato Brasileiro de Pentatlo Moderno',
            description: 'Campeonato nacional com atletas de todo o Brasil, incluindo as cinco modalidades do pentatlo moderno.',
            startDate: '2025-12-12',
            endDate: '2025-12-14',
            location: 'Recife, Pernambuco',
            organizer: 'Federação Pernambucana de Pentatlo',
            expectedParticipants: 120,
            status: 'pending' as const,
            budget: 85000,
            notes: 'Evento de grande porte que requer aprovação da diretoria',
            createdAt: '2025-01-10',
            updatedAt: '2025-01-10',
            image: {
              data: {
                attributes: {
                  url: 'https://cdn.builder.io/api/v1/image/assets%2F83197d83cffa4d76b43dffc4a37dfe2d%2Fbebb60a7c54c4f80825b035fafd59ea6?format=webp&width=800',
                  alternativeText: 'CBPM 2025'
                }
              }
            }
          },
          {
            id: 998,
            title: 'Copa Jovens Talentos',
            description: 'Competição voltada para atletas sub-18 nas modalidades de pentatlo moderno.',
            startDate: '2025-03-20',
            endDate: '2025-03-21',
            location: 'Brasília, DF',
            organizer: 'Clube de Pentatlo de Brasília',
            expectedParticipants: 60,
            status: 'pending' as const,
            budget: 25000,
            createdAt: '2025-01-08',
            updatedAt: '2025-01-08'
          },
          ...mockData.events.map(event => ({ ...event, status: 'approved' as const }))
        ];
        setEvents(mockEvents);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      toast.error('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (eventId: number, approved: boolean) => {
    setIsApproving(true);
    try {
      const newStatus = approved ? 'approved' : 'rejected';
      
      try {
        // Try to update via Strapi
        await eventsApi.updateEvent(eventId, {
          status: newStatus,
          notes: approvalNotes || undefined
        });
        
        toast.success(`Evento ${approved ? 'aprovado' : 'rejeitado'} com sucesso!`);
      } catch (strapiError) {
        // Fallback to local state update
        console.warn('Strapi not available, updating local state only');
        toast.success(`Evento ${approved ? 'aprovado' : 'rejeitado'} localmente (Strapi indisponível)`);
      }

      // Update local state
      setEvents(events.map(event => 
        event.id === eventId 
          ? { ...event, status: newStatus, notes: approvalNotes || event.notes }
          : event
      ));
      
      setApprovalNotes('');
      setSelectedEvent(null);
    } catch (err) {
      console.error('Error updating event:', err);
      toast.error('Erro ao atualizar evento');
    } finally {
      setIsApproving(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      const eventData = {
        title: newEvent.title,
        description: newEvent.description,
        startDate: newEvent.startDate,
        endDate: newEvent.endDate || newEvent.startDate,
        location: newEvent.location,
        organizer: newEvent.organizer,
        expectedParticipants: newEvent.expectedParticipants ? parseInt(newEvent.expectedParticipants) : undefined,
        budget: newEvent.budget ? parseFloat(newEvent.budget) : undefined,
        status: 'pending' as const
      };

      try {
        // Try to create via Strapi
        const response = await eventsApi.createEvent(eventData);
        setEvents([response.data, ...events]);
        toast.success('Evento criado com sucesso!');
      } catch (strapiError) {
        // Fallback to local state
        const mockEvent = {
          id: Date.now(),
          ...eventData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setEvents([mockEvent, ...events]);
        toast.success('Evento criado localmente (Strapi indisponível)');
      }

      // Reset form
      setNewEvent({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        organizer: '',
        expectedParticipants: '',
        budget: '',
      });
      setShowCreateForm(false);
    } catch (err) {
      console.error('Error creating event:', err);
      toast.error('Erro ao criar evento');
    }
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

  const formatEventDate = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const startFormatted = start.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
    
    if (endDate && endDate !== startDate) {
      const end = new Date(endDate);
      const endFormatted = end.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
      return `${startFormatted} - ${endFormatted}`;
    }
    
    return startFormatted;
  };

  const pendingEvents = events.filter(event => event.status === 'pending');
  const processedEvents = events.filter(event => event.status !== 'pending');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pentathlon-green mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Administração de Eventos</h1>
            <p className="text-gray-600">Gerencie e aprove eventos da confederação</p>
          </div>
          
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button className="bg-pentathlon-green hover:bg-pentathlon-green-dark">
                Novo Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Novo Evento</DialogTitle>
                <DialogDescription>Adicione as informações do novo evento</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      placeholder="Nome do evento"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Local</Label>
                    <Input
                      id="location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      placeholder="Cidade, Estado"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    placeholder="Descrição detalhada do evento"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Data de Início</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newEvent.startDate}
                      onChange={(e) => setNewEvent({...newEvent, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Data de Fim</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newEvent.endDate}
                      onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="organizer">Organizador</Label>
                    <Input
                      id="organizer"
                      value={newEvent.organizer}
                      onChange={(e) => setNewEvent({...newEvent, organizer: e.target.value})}
                      placeholder="Federação ou entidade"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expectedParticipants">Participantes Esperados</Label>
                    <Input
                      id="expectedParticipants"
                      type="number"
                      value={newEvent.expectedParticipants}
                      onChange={(e) => setNewEvent({...newEvent, expectedParticipants: e.target.value})}
                      placeholder="Número de atletas"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="budget">Orçamento (R$)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={newEvent.budget}
                    onChange={(e) => setNewEvent({...newEvent, budget: e.target.value})}
                    placeholder="Valor em reais"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleCreateEvent} className="flex-1 bg-pentathlon-green hover:bg-pentathlon-green-dark">
                    Criar Evento
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                    {event.image?.data && (
                      <img 
                        src={getStrapiMediaUrl(event.image.data.attributes.url)} 
                        alt={event.image.data.attributes.alternativeText || event.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{formatEventDate(event.startDate, event.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span>{event.location}</span>
                      </div>
                      {event.expectedParticipants && (
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-gray-400" />
                          <span>{event.expectedParticipants} atletas</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span>Submetido em {new Date(event.createdAt).toLocaleDateString('pt-BR')}</span>
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
                            {event.image?.data && (
                              <div>
                                <h4 className="font-semibold mb-2">Imagem do Evento</h4>
                                <img 
                                  src={getStrapiMediaUrl(event.image.data.attributes.url)} 
                                  alt={event.image.data.attributes.alternativeText || event.title}
                                  className="w-full h-48 object-cover rounded-lg"
                                />
                              </div>
                            )}
                            
                            <div>
                              <h4 className="font-semibold mb-2">Informações Gerais</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="font-medium">Data:</span> {formatEventDate(event.startDate, event.endDate)}</div>
                                <div><span className="font-medium">Local:</span> {event.location}</div>
                                <div><span className="font-medium">Organizador:</span> {event.organizer}</div>
                                {event.expectedParticipants && (
                                  <div><span className="font-medium">Participantes:</span> {event.expectedParticipants}</div>
                                )}
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
                                disabled={isApproving}
                              >
                                <CheckCircle size={16} className="mr-2" />
                                {isApproving ? 'Aprovando...' : 'Aprovar Evento'}
                              </Button>
                              <Button 
                                variant="destructive" 
                                className="flex-1"
                                onClick={() => handleApproval(event.id, false)}
                                disabled={isApproving}
                              >
                                <XCircle size={16} className="mr-2" />
                                {isApproving ? 'Rejeitando...' : 'Rejeitar Evento'}
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
              {processedEvents.slice(0, 6).map((event) => (
                <Card key={event.id} className={`border-l-4 ${event.status === 'approved' ? 'border-l-green-400' : 'border-l-red-400'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{event.title}</CardTitle>
                      <Badge className={getStatusColor(event.status)}>{getStatusText(event.status)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>{formatEventDate(event.startDate, event.endDate)}</div>
                      <div>{event.location}</div>
                      {event.notes && (
                        <div className="text-xs text-gray-500 mt-2">
                          <span className="font-medium">Obs:</span> {event.notes}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {processedEvents.length > 6 && (
              <div className="text-center mt-6">
                <p className="text-gray-500 text-sm">
                  E mais {processedEvents.length - 6} eventos processados...
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
