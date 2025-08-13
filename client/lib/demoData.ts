// Demo data service for when Supabase is not available
import { Document, Event, AdminUser } from './supabase';

// Mock data storage in localStorage
const STORAGE_KEYS = {
  documents: 'fppm_demo_documents',
  events: 'fppm_demo_events',
  adminUsers: 'fppm_demo_admin_users'
};

// Demo admin users
export const demoAdminUsers: AdminUser[] = [
  {
    id: 'demo-admin',
    auth_user_id: 'demo-auth-admin',
    email: 'admin@fppm.com.br',
    name: 'Administrador FPPM',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'demo-moderator',
    auth_user_id: 'demo-auth-moderator',
    email: 'moderator@fppm.com.br',
    name: 'Moderador FPPM',
    role: 'moderator',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Demo documents
export const demoDocuments: Document[] = [
  {
    id: 'demo-doc-1',
    title: 'Estatuto Social FPPM 2024',
    description: 'Estatuto social vigente da Federação Pernambucana de Pentatlo Moderno',
    category: 'estatuto',
    file_name: 'estatuto-fppm-2024.pdf',
    file_path: 'estatuto/demo-estatuto.pdf',
    file_size: 2048000,
    file_type: 'application/pdf',
    tags: ['estatuto', 'social', 'fppm'],
    uploaded_by: 'demo-admin',
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    admin_users: demoAdminUsers[0]
  },
  {
    id: 'demo-doc-2',
    title: 'Regimento Interno',
    description: 'Regimento interno da federação com normas e procedimentos',
    category: 'gestao',
    file_name: 'regimento-interno.pdf',
    file_path: 'gestao/demo-regimento.pdf',
    file_size: 1536000,
    file_type: 'application/pdf',
    tags: ['regimento', 'interno', 'normas'],
    uploaded_by: 'demo-admin',
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    admin_users: demoAdminUsers[0]
  },
  {
    id: 'demo-doc-3',
    title: 'Manual de Compras e Licitações',
    description: 'Procedimentos para compras e licitações da federação',
    category: 'compras',
    file_name: 'manual-compras.pdf',
    file_path: 'compras/demo-manual.pdf',
    file_size: 3072000,
    file_type: 'application/pdf',
    tags: ['compras', 'licitações', 'procedimentos'],
    uploaded_by: 'demo-moderator',
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updated_at: new Date(Date.now() - 259200000).toISOString(),
    admin_users: demoAdminUsers[1]
  }
];

// Demo events
export const demoEvents: Event[] = [
  {
    id: 'demo-event-1',
    title: 'Copa Pernambucana de Pentatlo Moderno 2025',
    description: 'Competição estadual de pentatlo moderno para atletas de todas as categorias',
    event_date: '2025-06-15',
    location: 'Recife, PE',
    category: 'Campeonato Estadual',
    status: 'pending',
    budget: 25000.00,
    participants_expected: 80,
    technical_details: {
      equipment: "Pistolas laser, piscina 25m, pista de corrida, equipamentos de esgrima",
      venue: "Centro Esportivo de Recife"
    },
    impact_assessment: 'Evento promoverá o desenvolvimento do pentatlo moderno em Pernambuco e revelará novos talentos para competições nacionais',
    image_path: null,
    image_url: null,
    created_by: 'demo-admin',
    approved_by: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    admin_users: demoAdminUsers[0]
  },
  {
    id: 'demo-event-2',
    title: 'Workshop de Arbitragem',
    description: 'Curso de formação e atualização para árbitros de pentatlo moderno',
    event_date: '2025-04-20',
    location: 'Recife, PE',
    category: 'Capacitação',
    status: 'approved',
    budget: 8000.00,
    participants_expected: 25,
    technical_details: {
      materials: "Material didático, certificados",
      duration: "2 dias"
    },
    impact_assessment: 'Capacitação de árbitros locais para melhorar a qualidade das competições',
    image_path: null,
    image_url: null,
    created_by: 'demo-moderator',
    approved_by: 'demo-admin',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    admin_users: demoAdminUsers[1]
  },
  {
    id: 'demo-event-3',
    title: 'Treinamento Técnico Juvenil',
    description: 'Programa de desenvolvimento para atletas juvenis',
    event_date: '2025-05-10',
    location: 'Olinda, PE',
    category: 'Treinamento',
    status: 'draft',
    budget: 12000.00,
    participants_expected: 40,
    technical_details: {
      coaches: "Técnicos credenciados pela CBPent",
      equipment: "Equipamentos fornecidos pela federação"
    },
    impact_assessment: 'Desenvolvimento técnico da base do pentatlo moderno em Pernambuco',
    image_path: null,
    image_url: null,
    created_by: 'demo-moderator',
    approved_by: null,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString(),
    admin_users: demoAdminUsers[1]
  }
];

// Utility functions for demo data management
export const demoStorage = {
  getDocuments: (): Document[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.documents);
      return stored ? JSON.parse(stored) : demoDocuments;
    } catch {
      return demoDocuments;
    }
  },

  setDocuments: (documents: Document[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.documents, JSON.stringify(documents));
    } catch (error) {
      console.warn('Failed to save documents to localStorage:', error);
    }
  },

  getEvents: (): Event[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.events);
      return stored ? JSON.parse(stored) : demoEvents;
    } catch {
      return demoEvents;
    }
  },

  setEvents: (events: Event[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(events));
    } catch (error) {
      console.warn('Failed to save events to localStorage:', error);
    }
  },

  addDocument: (document: Document) => {
    const documents = demoStorage.getDocuments();
    documents.unshift(document);
    demoStorage.setDocuments(documents);
    return document;
  },

  removeDocument: (id: string) => {
    const documents = demoStorage.getDocuments();
    const filtered = documents.filter(doc => doc.id !== id);
    demoStorage.setDocuments(filtered);
  },

  addEvent: (event: Event) => {
    const events = demoStorage.getEvents();
    events.unshift(event);
    demoStorage.setEvents(events);
    return event;
  },

  updateEvent: (id: string, updates: Partial<Event>) => {
    const events = demoStorage.getEvents();
    const index = events.findIndex(event => event.id === id);
    if (index !== -1) {
      events[index] = { ...events[index], ...updates, updated_at: new Date().toISOString() };
      demoStorage.setEvents(events);
      return events[index];
    }
    return null;
  },

  removeEvent: (id: string) => {
    const events = demoStorage.getEvents();
    const filtered = events.filter(event => event.id !== id);
    demoStorage.setEvents(filtered);
  }
};

// Demo service that mimics Supabase API
export const demoSupabaseService = {
  // Documents
  from: (table: string) => {
    if (table === 'documents') {
      return {
        select: (fields?: string) => ({
          order: (field: string, options?: any) => ({
            then: (callback: any) => {
              const documents = demoStorage.getDocuments()
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
              callback({ data: documents, error: null });
            }
          })
        }),
        insert: (data: any) => ({
          select: (fields?: string) => ({
            single: () => ({
              then: (callback: any) => {
                const newDoc = {
                  ...data,
                  id: `demo-doc-${Date.now()}`,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  admin_users: demoAdminUsers.find(u => u.id === data.uploaded_by)
                };
                demoStorage.addDocument(newDoc);
                callback({ data: newDoc, error: null });
              }
            })
          })
        }),
        delete: () => ({
          eq: (field: string, value: any) => ({
            then: (callback: any) => {
              demoStorage.removeDocument(value);
              callback({ data: null, error: null });
            }
          })
        })
      };
    }

    if (table === 'events') {
      return {
        select: (fields?: string) => ({
          order: (field: string, options?: any) => ({
            eq: (filterField: string, filterValue: any) => ({
              then: (callback: any) => {
                let events = demoStorage.getEvents();
                if (filterField === 'status') {
                  events = events.filter(event => event.status === filterValue);
                }
                events.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                callback({ data: events, error: null });
              }
            }),
            then: (callback: any) => {
              const events = demoStorage.getEvents()
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
              callback({ data: events, error: null });
            }
          })
        }),
        insert: (data: any) => ({
          select: (fields?: string) => ({
            single: () => ({
              then: (callback: any) => {
                const newEvent = {
                  ...data,
                  id: `demo-event-${Date.now()}`,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  admin_users: demoAdminUsers.find(u => u.id === data.created_by)
                };
                demoStorage.addEvent(newEvent);
                callback({ data: newEvent, error: null });
              }
            })
          })
        }),
        update: (data: any) => ({
          eq: (field: string, value: any) => ({
            select: (fields?: string) => ({
              single: () => ({
                then: (callback: any) => {
                  const updated = demoStorage.updateEvent(value, data);
                  callback({ data: updated, error: updated ? null : { message: 'Event not found' } });
                }
              })
            })
          })
        }),
        delete: () => ({
          eq: (field: string, value: any) => ({
            then: (callback: any) => {
              demoStorage.removeEvent(value);
              callback({ data: null, error: null });
            }
          })
        })
      };
    }

    // Return empty service for other tables
    return {
      select: () => ({ then: (callback: any) => callback({ data: [], error: null }) }),
      insert: () => ({ then: (callback: any) => callback({ data: null, error: { message: 'Demo mode: table not supported' } }) }),
      update: () => ({ then: (callback: any) => callback({ data: null, error: { message: 'Demo mode: table not supported' } }) }),
      delete: () => ({ then: (callback: any) => callback({ data: null, error: { message: 'Demo mode: table not supported' } }) })
    };
  }
};

// Initialize demo data if not present
export const initDemoData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.documents)) {
    demoStorage.setDocuments(demoDocuments);
  }
  if (!localStorage.getItem(STORAGE_KEYS.events)) {
    demoStorage.setEvents(demoEvents);
  }
};
