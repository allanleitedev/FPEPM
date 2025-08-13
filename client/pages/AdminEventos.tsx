import { useState, useEffect } from 'react';
import { supabase, Event } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarDays, MapPin, Users, DollarSign, CheckCircle2, Clock, XCircle, Eye, BarChart3, TrendingUp, Award, Target } from 'lucide-react';
import Login from '@/components/Login';
import EventManager from '@/components/EventManager';

export default function AdminEventos() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    published: 0
  });
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      loadRecentEvents();
    }
  }, [isAuthenticated]);

  const loadStats = async () => {
    try {
      const { data: events, error } = await supabase
        .from('events')
        .select('status');

      if (error) {
        console.error('Error loading stats:', error);
        return;
      }

      const eventStats = events.reduce((acc, event) => {
        acc.total++;
        acc[event.status as keyof typeof acc]++;
        return acc;
      }, {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        published: 0
      });

      setStats(eventStats);
    } catch (error) {
      console.error('Error in loadStats:', error);
    }
  };

  const loadRecentEvents = async () => {
    try {
      setLoading(true);
      const { data: events, error } = await supabase
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
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error loading recent events:', error);
        return;
      }

      setRecentEvents(events || []);
    } catch (error) {
      console.error('Error in loadRecentEvents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'approved': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'published': return <Eye className="w-4 h-4 text-blue-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Rascunho', className: 'bg-gray-100 text-gray-800' },
      pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Aprovado', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejeitado', className: 'bg-red-100 text-red-800' },
      published: { label: 'Publicado', className: 'bg-blue-100 text-blue-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (!isAuthenticated) {
    return <Login onSuccess={() => setActiveTab('pending')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Administração de Eventos</h1>
              <p className="text-gray-600 mt-1">Gerencie eventos e solicitações de aprovação da FPPM</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-pentathlon-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aprovados</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejeitados</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Publicados</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.published}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message for Admins */}
        {user?.role === 'admin' && stats.pending > 0 && (
          <Alert className="mb-8 border-yellow-200 bg-yellow-50">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Você tem <strong>{stats.pending} evento(s)</strong> aguardando aprovação. 
              Revise-os na aba "Eventos Pendentes".
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pendentes ({stats.pending})
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Todos os Eventos
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            <EventManager 
              showOnlyPending={true}
              onEventAdded={() => {
                loadStats();
                loadRecentEvents();
              }} 
            />
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            <EventManager 
              onEventAdded={() => {
                loadStats();
                loadRecentEvents();
              }} 
            />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-pentathlon-blue" />
                    Eventos Recentes
                  </CardTitle>
                  <CardDescription>
                    Últimos eventos criados no sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pentathlon-blue"></div>
                    </div>
                  ) : recentEvents.length > 0 ? (
                    <div className="space-y-4">
                      {recentEvents.map(event => (
                        <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                          <div className="flex-shrink-0 mt-1">
                            {getStatusIcon(event.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm truncate">
                              {event.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              {event.event_date && (
                                <span className="flex items-center gap-1">
                                  <CalendarDays className="w-3 h-3" />
                                  {new Date(event.event_date).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {event.location}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {getStatusBadge(event.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarDays className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>Nenhum evento encontrado</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-pentathlon-green" />
                    Ações Rápidas
                  </CardTitle>
                  <CardDescription>
                    Shortcuts para tarefas comuns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      className="w-full justify-start bg-gradient-to-r from-pentathlon-green to-pentathlon-green-dark hover:from-pentathlon-green-dark hover:to-pentathlon-green"
                      onClick={() => setActiveTab('all')}
                    >
                      <CalendarDays className="w-4 h-4 mr-2" />
                      Criar Novo Evento
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveTab('pending')}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Revisar Pendentes ({stats.pending})
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        loadStats();
                        loadRecentEvents();
                      }}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Atualizar Dados
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Taxa de Aprovação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                      </div>
                      <p className="text-sm text-gray-600">dos eventos são aprovados</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Eventos Este Mês</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {stats.total}
                      </div>
                      <p className="text-sm text-gray-600">eventos criados</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Aguardando Ação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600">
                        {stats.pending}
                      </div>
                      <p className="text-sm text-gray-600">eventos pendentes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Status</CardTitle>
                <CardDescription>
                  Visão geral do status de todos os eventos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { status: 'pending', label: 'Pendentes', count: stats.pending, color: 'bg-yellow-500' },
                    { status: 'approved', label: 'Aprovados', count: stats.approved, color: 'bg-green-500' },
                    { status: 'rejected', label: 'Rejeitados', count: stats.rejected, color: 'bg-red-500' },
                    { status: 'published', label: 'Publicados', count: stats.published, color: 'bg-blue-500' },
                  ].map(item => (
                    <div key={item.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${item.color}`}></div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{item.count}</span>
                        <span className="text-sm text-gray-600">
                          ({stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
