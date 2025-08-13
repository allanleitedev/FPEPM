import { useState, useEffect, useRef } from 'react';
import { supabase, Event, EVENT_STATUSES } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalendarDays, MapPin, Users, DollarSign, Plus, Edit, Trash2, Eye, Upload, Loader2, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface EventManagerProps {
  onEventAdded?: (event: Event) => void;
  showOnlyPending?: boolean;
}

interface EventFormData {
  title: string;
  description: string;
  event_date: string;
  location: string;
  category: string;
  budget: string;
  participants_expected: string;
  technical_details: string;
  impact_assessment: string;
}

const initialFormData: EventFormData = {
  title: '',
  description: '',
  event_date: '',
  location: '',
  category: '',
  budget: '',
  participants_expected: '',
  technical_details: '',
  impact_assessment: ''
};

export default function EventManager({ onEventAdded, showOnlyPending = false }: EventManagerProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadEvents();
  }, [showOnlyPending]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError('');

      // Check if we're in demo mode
      const isDemoMode = localStorage.getItem('fppm_auth_demo');

      if (isDemoMode) {
        // Use demo data
        const { demoStorage } = await import('@/lib/demoData');
        let demoEvents = demoStorage.getEvents();

        if (showOnlyPending) {
          demoEvents = demoEvents.filter(event => event.status === 'pending');
        }

        setEvents(demoEvents);
      } else {
        // Try Supabase
        let query = supabase
          .from('events')
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

        if (showOnlyPending) {
          query = query.eq('status', 'pending');
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        setEvents(data || []);
      }
    } catch (err: any) {
      console.warn('Failed to load from Supabase, falling back to demo mode:', err);
      // Fallback to demo data
      try {
        const { demoStorage } = await import('@/lib/demoData');
        let demoEvents = demoStorage.getEvents();

        if (showOnlyPending) {
          demoEvents = demoEvents.filter(event => event.status === 'pending');
        }

        setEvents(demoEvents);
        setError('Conectado em modo demonstração. Funcionalidades limitadas.');
      } catch (demoErr) {
        setError('Erro ao carregar eventos');
        console.error('Error loading demo events:', demoErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof EventFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Imagem muito grande. Tamanho máximo: 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione apenas imagens');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `events/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      return filePath;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw new Error('Erro ao fazer upload da imagem');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Por favor, preencha pelo menos o título e descrição');
      return;
    }

    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const isDemoMode = localStorage.getItem('fppm_auth_demo');

      if (isDemoMode) {
        // Demo mode - save to localStorage
        const { demoStorage } = await import('@/lib/demoData');

        const eventData = {
          id: editingEvent?.id || `demo-event-${Date.now()}`,
          title: formData.title.trim(),
          description: formData.description.trim(),
          event_date: formData.event_date || null,
          location: formData.location.trim() || null,
          category: formData.category.trim() || null,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          participants_expected: formData.participants_expected ? parseInt(formData.participants_expected) : null,
          technical_details: formData.technical_details.trim() ? {
            details: formData.technical_details
          } : null,
          impact_assessment: formData.impact_assessment.trim() || null,
          image_path: null, // Demo mode doesn't support image upload
          image_url: null,
          status: 'pending' as const,
          created_by: user.id,
          approved_by: null,
          created_at: editingEvent?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          admin_users: user
        };

        if (editingEvent) {
          const updated = demoStorage.updateEvent(editingEvent.id, eventData);
          if (updated) {
            setEvents(prev => prev.map(event =>
              event.id === editingEvent.id ? updated : event
            ));
          }
        } else {
          const newEvent = demoStorage.addEvent(eventData);
          setEvents(prev => [newEvent, ...prev]);
          onEventAdded?.(newEvent);
        }
      } else {
        // Supabase mode
        let imagePath = editingEvent?.image_path || null;

        // Upload image if selected
        if (selectedImage) {
          imagePath = await uploadImage(selectedImage);
        }

        const eventData = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          event_date: formData.event_date || null,
          location: formData.location.trim() || null,
          category: formData.category.trim() || null,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          participants_expected: formData.participants_expected ? parseInt(formData.participants_expected) : null,
          technical_details: formData.technical_details.trim() ? JSON.parse(JSON.stringify({
            details: formData.technical_details
          })) : null,
          impact_assessment: formData.impact_assessment.trim() || null,
          image_path: imagePath,
          status: 'pending' as const,
          created_by: user.id
        };

        let result;
        if (editingEvent) {
          const { data, error } = await supabase
            .from('events')
            .update(eventData)
            .eq('id', editingEvent.id)
            .select('*, admin_users(*)')
            .single();
          result = { data, error };
        } else {
          const { data, error } = await supabase
            .from('events')
            .insert(eventData)
            .select('*, admin_users(*)')
            .single();
          result = { data, error };
        }

        if (result.error) {
          throw result.error;
        }

        // Update local state
        if (editingEvent) {
          setEvents(prev => prev.map(event =>
            event.id === editingEvent.id ? result.data : event
          ));
        } else {
          setEvents(prev => [result.data, ...prev]);
          onEventAdded?.(result.data);
        }
      }

      // Reset form
      resetForm();
      setIsAddingEvent(false);
      setEditingEvent(null);

    } catch (err: any) {
      setError(err.message || 'Erro ao salvar evento');
      console.error('Error saving event:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      event_date: event.event_date || '',
      location: event.location || '',
      category: event.category || '',
      budget: event.budget?.toString() || '',
      participants_expected: event.participants_expected?.toString() || '',
      technical_details: event.technical_details?.details || '',
      impact_assessment: event.impact_assessment || ''
    });
    
    if (event.image_path) {
      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(event.image_path);
      setImagePreview(publicUrl);
    }
    
    setIsAddingEvent(true);
  };

  const handleDelete = async (event: Event) => {
    if (!user || (user.role !== 'admin' && event.created_by !== user.id)) {
      setError('Você não tem permissão para deletar este evento');
      return;
    }

    const confirmDelete = window.confirm(
      `Tem certeza que deseja deletar "${event.title}"? Esta ação não pode ser desfeita.`
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(event.id);
      setError('');

      // Check if we're in demo mode
      const isDemoMode = localStorage.getItem('fppm_auth_demo');

      if (isDemoMode) {
        // Use demo data
        const { demoStorage } = await import('@/lib/demoData');
        demoStorage.removeEvent(event.id);
        setEvents(prev => prev.filter(e => e.id !== event.id));
      } else {
        // Delete image from storage if exists
        if (event.image_path) {
          const { error: storageError } = await supabase.storage
            .from('event-images')
            .remove([event.image_path]);

          if (storageError) {
            console.warn('Warning: Could not delete image from storage:', storageError);
          }
        }

        // Delete event from database
        const { error: dbError } = await supabase
          .from('events')
          .delete()
          .eq('id', event.id);

        if (dbError) {
          throw dbError;
        }

        setEvents(prev => prev.filter(e => e.id !== event.id));
      }

    } catch (err: any) {
      console.warn('Failed to delete from Supabase, trying demo mode:', err);
      // Fallback to demo mode
      try {
        const { demoStorage } = await import('@/lib/demoData');
        demoStorage.removeEvent(event.id);
        setEvents(prev => prev.filter(e => e.id !== event.id));
        setError('Evento deletado em modo demonstração');
      } catch (demoErr) {
        setError('Erro ao deletar evento');
        console.error('Error deleting event:', demoErr);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusUpdate = async (event: Event, newStatus: typeof EVENT_STATUSES[number]['value']) => {
    if (!user || user.role !== 'admin') {
      setError('Apenas administradores podem alterar o status dos eventos');
      return;
    }

    try {
      // Check if we're in demo mode
      const isDemoMode = localStorage.getItem('fppm_auth_demo');

      if (isDemoMode) {
        // Use demo data
        const { demoStorage } = await import('@/lib/demoData');
        const updateData: any = { status: newStatus };
        if (newStatus === 'approved') {
          updateData.approved_by = user.id;
        }

        const updated = demoStorage.updateEvent(event.id, updateData);
        if (updated) {
          setEvents(prev => prev.map(e => e.id === event.id ? updated : e));
        }
      } else {
        // Supabase mode
        const updateData: any = { status: newStatus };
        if (newStatus === 'approved') {
          updateData.approved_by = user.id;
        }

        const { data, error } = await supabase
          .from('events')
          .update(updateData)
          .eq('id', event.id)
          .select('*, admin_users(*)')
          .single();

        if (error) {
          throw error;
        }

        setEvents(prev => prev.map(e => e.id === event.id ? data : e));
      }

    } catch (err: any) {
      console.warn('Failed to update status in Supabase, trying demo mode:', err);
      // Fallback to demo mode
      try {
        const { demoStorage } = await import('@/lib/demoData');
        const updateData: any = { status: newStatus };
        if (newStatus === 'approved') {
          updateData.approved_by = user.id;
        }

        const updated = demoStorage.updateEvent(event.id, updateData);
        if (updated) {
          setEvents(prev => prev.map(e => e.id === event.id ? updated : e));
          setError('Status atualizado em modo demonstração');
        }
      } catch (demoErr) {
        setError('Erro ao atualizar status do evento');
        console.error('Error updating event status:', demoErr);
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedImage(null);
    setImagePreview('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const closeModal = () => {
    resetForm();
    setIsAddingEvent(false);
    setEditingEvent(null);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = EVENT_STATUSES.find(s => s.value === status);
    if (!statusConfig) return null;

    const colorClasses = {
      gray: 'bg-gray-100 text-gray-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      blue: 'bg-blue-100 text-blue-800'
    };

    return (
      <Badge className={colorClasses[statusConfig.color]}>
        {statusConfig.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-pentathlon-blue" />
        <span className="ml-2 text-gray-600">Carregando eventos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {showOnlyPending ? 'Eventos Pendentes' : 'Gerenciamento de Eventos'}
          </h2>
          <p className="text-gray-600">
            {showOnlyPending 
              ? 'Eventos aguardando aprovação para publicação' 
              : 'Crie, edite e gerencie eventos da federação'
            }
          </p>
        </div>
        
        <Dialog open={isAddingEvent} onOpenChange={(open) => {
          if (!open) closeModal();
          else setIsAddingEvent(true);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pentathlon-green to-pentathlon-green-dark hover:from-pentathlon-green-dark hover:to-pentathlon-green">
              <Plus className="w-4 h-4 mr-2" />
              {editingEvent ? 'Editar Evento' : 'Novo Evento'}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Editar Evento' : 'Criar Novo Evento'}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do evento. Campos marcados com * são obrigatórios.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título do Evento *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Ex: Copa Regional Nordeste 2025"
                      disabled={submitting}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="event_date">Data do Evento</Label>
                    <Input
                      id="event_date"
                      type="date"
                      value={formData.event_date}
                      onChange={(e) => handleInputChange('event_date', e.target.value)}
                      disabled={submitting}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Local</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Ex: Salvador, BA"
                      disabled={submitting}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      placeholder="Ex: Campeonato Regional"
                      disabled={submitting}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="budget">Orçamento (R$)</Label>
                    <Input
                      id="budget"
                      type="number"
                      step="0.01"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      placeholder="0.00"
                      disabled={submitting}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="participants_expected">Participantes Esperados</Label>
                    <Input
                      id="participants_expected"
                      type="number"
                      value={formData.participants_expected}
                      onChange={(e) => handleInputChange('participants_expected', e.target.value)}
                      placeholder="Ex: 50"
                      disabled={submitting}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Descrição *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Descrição detalhada do evento..."
                      rows={4}
                      disabled={submitting}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="technical_details">Detalhes Técnicos</Label>
                    <Textarea
                      id="technical_details"
                      value={formData.technical_details}
                      onChange={(e) => handleInputChange('technical_details', e.target.value)}
                      placeholder="Informações técnicas, equipamentos necessários, etc."
                      rows={3}
                      disabled={submitting}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="impact_assessment">Avaliação de Impacto</Label>
                    <Textarea
                      id="impact_assessment"
                      value={formData.impact_assessment}
                      onChange={(e) => handleInputChange('impact_assessment', e.target.value)}
                      placeholder="Impacto esperado do evento, benefícios, etc."
                      rows={3}
                      disabled={submitting}
                    />
                  </div>
                  
                  <div>
                    <Label>Imagem do Evento</Label>
                    <div className="space-y-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        disabled={submitting}
                      />
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={submitting}
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {imagePreview ? 'Alterar Imagem' : 'Selecionar Imagem'}
                      </Button>
                      
                      {imagePreview && (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedImage(null);
                              setImagePreview('');
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="absolute top-2 right-2 bg-white"
                            disabled={submitting}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || !formData.title.trim() || !formData.description.trim()}
                  className="bg-gradient-to-r from-pentathlon-green to-pentathlon-green-dark hover:from-pentathlon-green-dark hover:to-pentathlon-green"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    editingEvent ? 'Atualizar Evento' : 'Criar Evento'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {events.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarDays className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {showOnlyPending ? 'Nenhum evento pendente' : 'Nenhum evento criado'}
            </h3>
            <p className="text-gray-500 text-center mb-4">
              {showOnlyPending 
                ? 'Não há eventos aguardando aprovação no momento'
                : 'Comece criando seu primeiro evento'
              }
            </p>
            <Button
              onClick={() => setIsAddingEvent(true)}
              variant="outline"
              className="border-pentathlon-green text-pentathlon-green hover:bg-pentathlon-green hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Evento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {events.map(event => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {event.image_path && (
                    <div className="flex-shrink-0">
                      <img 
                        src={supabase.storage.from('event-images').getPublicUrl(event.image_path).data.publicUrl}
                        alt={event.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          {event.event_date && (
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-4 h-4" />
                              {new Date(event.event_date).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {event.location}
                            </span>
                          )}
                          {event.participants_expected && (
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {event.participants_expected} participantes
                            </span>
                          )}
                          {event.budget && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              R$ {event.budget.toLocaleString('pt-BR')}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusBadge(event.status)}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Criado por {event.admin_users?.name} em {new Date(event.created_at).toLocaleDateString('pt-BR')}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {user?.role === 'admin' && event.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(event, 'approved')}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(event, 'rejected')}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Rejeitar
                            </Button>
                          </>
                        )}
                        
                        {(user?.role === 'admin' || event.created_by === user?.id) && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(event)}
                              disabled={submitting}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(event)}
                              disabled={deletingId === event.id}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              {deletingId === event.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
