import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminEventos from "./pages/AdminEventos";
import Transparencia from "./pages/Transparencia";
import Header from "./components/Header";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

// Placeholder component for pages not yet implemented
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-xl text-gray-600 mb-8">
          Esta página está em desenvolvimento. Continue explorando o site ou entre em contato conosco para mais informações.
        </p>
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <p className="text-gray-500">
            Em breve você encontrará aqui todas as informações sobre {title.toLowerCase()}.
          </p>
        </div>
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin/eventos" element={<AdminEventos />} />
              <Route path="/eventos" element={<PlaceholderPage title="Eventos" />} />
              <Route path="/noticias" element={<PlaceholderPage title="Notícias" />} />
              <Route path="/transparencia" element={<PlaceholderPage title="Transparência" />} />
              <Route path="/transparencia/financeiro" element={<PlaceholderPage title="Relatórios Financeiros" />} />
              <Route path="/transparencia/gestao" element={<PlaceholderPage title="Gestão" />} />
              <Route path="/transparencia/resultados" element={<PlaceholderPage title="Resultados" />} />
              <Route path="/transparencia/estatuto" element={<PlaceholderPage title="Estatuto" />} />
              <Route path="/transparencia/atas" element={<PlaceholderPage title="Atas" />} />
              <Route path="/atletas" element={<PlaceholderPage title="Atletas" />} />
              <Route path="/sobre" element={<PlaceholderPage title="Sobre" />} />
              <Route path="/privacidade" element={<PlaceholderPage title="Política de Privacidade" />} />
              <Route path="/termos" element={<PlaceholderPage title="Termos de Uso" />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
