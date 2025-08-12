import axios from 'axios';

// Configuration for Strapi API
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN;

// Create axios instance with base configuration
export const strapiApi = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
  },
});

// Types for Strapi responses
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity {
  id: number;
  attributes: Record<string, any>;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  organizer: string;
  expectedParticipants?: number;
  budget?: number;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  image?: {
    data?: {
      attributes: {
        url: string;
        alternativeText?: string;
      };
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface Athlete {
  id: number;
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  category: string;
  federation: string;
  achievements?: string;
  photo?: {
    data?: {
      attributes: {
        url: string;
        alternativeText?: string;
      };
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface News {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  featured: boolean;
  category?: string;
  image?: {
    data?: {
      attributes: {
        url: string;
        alternativeText?: string;
      };
    };
  };
  createdAt: string;
  updatedAt: string;
}

// Helper function to get full URL for Strapi media
export function getStrapiMediaUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}

// Events API
export const eventsApi = {
  // Get all events
  async getEvents(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    populate?: string;
    sort?: string;
  }): Promise<StrapiResponse<Event[]>> {
    const response = await strapiApi.get('/events', { params });
    return response.data;
  },

  // Get single event
  async getEvent(id: number, populate = '*'): Promise<{ data: Event }> {
    const response = await strapiApi.get(`/events/${id}`, {
      params: { populate }
    });
    return response.data;
  },

  // Create event
  async createEvent(eventData: Partial<Event>): Promise<{ data: Event }> {
    const response = await strapiApi.post('/events', { data: eventData });
    return response.data;
  },

  // Update event
  async updateEvent(id: number, eventData: Partial<Event>): Promise<{ data: Event }> {
    const response = await strapiApi.put(`/events/${id}`, { data: eventData });
    return response.data;
  },

  // Delete event
  async deleteEvent(id: number): Promise<{ data: Event }> {
    const response = await strapiApi.delete(`/events/${id}`);
    return response.data;
  },

  // Get approved events for public display
  async getApprovedEvents(): Promise<Event[]> {
    const response = await this.getEvents({
      populate: 'image',
      sort: 'startDate:asc',
      pageSize: 10
    });
    
    return response.data
      .filter(event => event.status === 'approved')
      .map(entity => ({
        ...entity,
        image: entity.image
      }));
  },

  // Get pending events for admin
  async getPendingEvents(): Promise<Event[]> {
    const response = await this.getEvents({
      populate: 'image',
      sort: 'createdAt:desc'
    });
    
    return response.data
      .filter(event => event.status === 'pending')
      .map(entity => ({
        ...entity,
        image: entity.image
      }));
  }
};

// Athletes API
export const athletesApi = {
  // Get all athletes
  async getAthletes(params?: {
    page?: number;
    pageSize?: number;
    populate?: string;
    sort?: string;
  }): Promise<StrapiResponse<Athlete[]>> {
    const response = await strapiApi.get('/athletes', { params });
    return response.data;
  },

  // Get single athlete
  async getAthlete(id: number, populate = '*'): Promise<{ data: Athlete }> {
    const response = await strapiApi.get(`/athletes/${id}`, {
      params: { populate }
    });
    return response.data;
  },

  // Create athlete
  async createAthlete(athleteData: Partial<Athlete>): Promise<{ data: Athlete }> {
    const response = await strapiApi.post('/athletes', { data: athleteData });
    return response.data;
  },

  // Update athlete
  async updateAthlete(id: number, athleteData: Partial<Athlete>): Promise<{ data: Athlete }> {
    const response = await strapiApi.put(`/athletes/${id}`, { data: athleteData });
    return response.data;
  },

  // Delete athlete
  async deleteAthlete(id: number): Promise<{ data: Athlete }> {
    const response = await strapiApi.delete(`/athletes/${id}`);
    return response.data;
  }
};

// News API
export const newsApi = {
  // Get all news
  async getNews(params?: {
    page?: number;
    pageSize?: number;
    featured?: boolean;
    populate?: string;
    sort?: string;
  }): Promise<StrapiResponse<News[]>> {
    const response = await strapiApi.get('/news', { params });
    return response.data;
  },

  // Get single news article
  async getNewsArticle(id: number, populate = '*'): Promise<{ data: News }> {
    const response = await strapiApi.get(`/news/${id}`, {
      params: { populate }
    });
    return response.data;
  },

  // Create news article
  async createNews(newsData: Partial<News>): Promise<{ data: News }> {
    const response = await strapiApi.post('/news', { data: newsData });
    return response.data;
  },

  // Update news article
  async updateNews(id: number, newsData: Partial<News>): Promise<{ data: News }> {
    const response = await strapiApi.put(`/news/${id}`, { data: newsData });
    return response.data;
  },

  // Delete news article
  async deleteNews(id: number): Promise<{ data: News }> {
    const response = await strapiApi.delete(`/news/${id}`);
    return response.data;
  },

  // Get featured news for homepage
  async getFeaturedNews(): Promise<News[]> {
    const response = await this.getNews({
      populate: 'image',
      sort: 'publishedAt:desc',
      pageSize: 6
    });
    
    return response.data.map(entity => ({
      ...entity,
      image: entity.image
    }));
  }
};

// Error handling utility
export function handleStrapiError(error: any): string {
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Ocorreu um erro inesperado';
}

// Mock data fallback (when Strapi is not available)
export const mockData = {
  events: [
    {
      id: 1,
      title: "Copa Regional Nordeste",
      description: "Competição regional para atletas do nordeste brasileiro",
      startDate: "2025-03-15",
      endDate: "2025-03-16",
      location: "Salvador, BA",
      organizer: "Federação Baiana de Pentatlo",
      expectedParticipants: 45,
      status: "approved" as const,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01"
    },
    {
      id: 2,
      title: "Campeonato Estadual SP",
      description: "Campeonato paulista de pentatlo moderno",
      startDate: "2025-03-22",
      endDate: "2025-03-23",
      location: "São Paulo, SP",
      organizer: "Federação Paulista de Pentatlo",
      expectedParticipants: 60,
      status: "approved" as const,
      createdAt: "2025-01-02",
      updatedAt: "2025-01-02"
    },
    {
      id: 3,
      title: "Torneio Regional Sul",
      description: "Torneio para atletas da região sul",
      startDate: "2025-04-05",
      endDate: "2025-04-06",
      location: "Porto Alegre, RS",
      organizer: "Federação Gaúcha de Pentatlo",
      expectedParticipants: 35,
      status: "approved" as const,
      createdAt: "2025-01-03",
      updatedAt: "2025-01-03"
    }
  ],
  news: [
    {
      id: 1,
      title: "Brasil conquista medalha de ouro no Mundial de Pentatlo",
      content: "Atleta brasileiro se destaca na competição internacional...",
      excerpt: "Resultado histórico para o pentatlo brasileiro",
      publishedAt: "2025-01-10",
      featured: true,
      category: "Competições",
      createdAt: "2025-01-10",
      updatedAt: "2025-01-10"
    },
    {
      id: 2,
      title: "Novo centro de treinamento inaugurado em São Paulo",
      content: "Inauguração de moderno centro de treinamento...",
      excerpt: "Facilidade irá beneficiar atletas de todo o estado",
      publishedAt: "2025-01-08",
      featured: false,
      category: "Infraestrutura",
      createdAt: "2025-01-08",
      updatedAt: "2025-01-08"
    },
    {
      id: 3,
      title: "Calendário de eventos 2025 é divulgado",
      content: "Confederação divulga calendário oficial...",
      excerpt: "Mais de 30 eventos programados para este ano",
      publishedAt: "2025-01-05",
      featured: true,
      category: "Eventos",
      createdAt: "2025-01-05",
      updatedAt: "2025-01-05"
    }
  ]
};
