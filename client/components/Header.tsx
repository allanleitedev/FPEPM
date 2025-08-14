import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Trophy, FileText, Settings, Home, Shield, LogOut, Mail, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const { isAuthenticated, user, signOut } = useAuth();
  const isDemoMode = localStorage.getItem('fppm_auth_demo');

  const navigation = [
    { name: 'Início', href: '/', icon: Home },
    { name: 'Modalidades', href: '/modalidades', icon: Trophy },
    { name: 'Transparência', href: '/transparencia', icon: FileText },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envio de mensagem
    alert(`Mensagem enviada com sucesso!\n\nNome: ${contactForm.name}\nEmail: ${contactForm.email}\nAssunto: ${contactForm.subject}\nMensagem: ${contactForm.message}`);
    setContactForm({ name: '', email: '', subject: '', message: '' });
    setIsContactOpen(false);
  };

  const resetContactForm = () => {
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <header className="bg-gradient-to-r from-white/95 via-blue-50/80 to-green-50/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50 relative transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 flex items-center justify-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F83197d83cffa4d76b43dffc4a37dfe2d%2F4c6593141cce41149696bda6e0c6120a?format=webp&width=800"
                alt="FPPM"
                className="h-10 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 group-hover:text-pentathlon-green transition-colors duration-300">FPPM</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-pentathlon-green font-medium text-sm transition-all duration-200 hover:scale-105 relative group"
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-pentathlon-green/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200 -z-0"></div>
              </Link>
            ))}
          </nav>

          {/* Admin & CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isDemoMode && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <span className="mr-1">🚀</span>
                    Demo
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-pentathlon-green/10 text-pentathlon-green">
                  <Shield size={12} className="mr-1" />
                  {user?.role}
                </Badge>
                <Link to="/admin/documentos">
                  <Button size="sm" variant="outline" className="border-pentathlon-green text-pentathlon-green hover:bg-pentathlon-green hover:text-white">
                    <FileText size={16} className="mr-2" />
                    Documentos
                  </Button>
                </Link>
                <Link to="/admin/eventos">
                  <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Settings size={16} className="mr-2" />
                    Eventos
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={signOut}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} className="mr-2" />
                  Sair
                </Button>
              </div>
            ) : (
              <Link to="/admin/documentos">
                <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Shield size={16} className="mr-2" />
                  Admin
                </Button>
              </Link>
            )}
            <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-pentathlon-green hover:bg-pentathlon-green-dark text-white">
                  <Mail className="w-4 h-4 mr-2" />
                  Fale Conosco
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-pentathlon-green" />
                    Entre em Contato
                  </DialogTitle>
                  <DialogDescription>
                    Envie uma mensagem ou acesse diretamente nossa ouvidoria para questões específicas.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Sobre o que você gostaria de falar?"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Digite sua mensagem aqui..."
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        window.open('https://ouvidoria.fppm.org.br', '_blank');
                        setIsContactOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 border-pentathlon-green text-pentathlon-green hover:bg-pentathlon-green hover:text-white"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Acessar Ouvidoria
                    </Button>
                    <Button
                      type="submit"
                      className="flex items-center justify-center gap-2 bg-pentathlon-green hover:bg-pentathlon-green-dark text-white"
                    >
                      <Send className="w-4 h-4" />
                      Enviar Mensagem
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-pentathlon-green transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <>
            {/* Backdrop - positioned below navbar */}
            <div
              className="fixed inset-0 top-16 bg-black bg-opacity-50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50 md:hidden">
              <nav className="flex flex-col p-4">
                {navigation.map((item, index) => (
                  <div key={item.name}>
                    <Link
                      to={item.href}
                      className="flex items-center gap-3 text-gray-700 hover:text-pentathlon-green hover:bg-gray-50 font-medium text-base transition-colors py-3 px-3 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon && <item.icon size={20} />}
                      {item.name}
                    </Link>
                    {index < navigation.length - 1 && (
                      <div className="border-b border-gray-100 mx-3"></div>
                    )}
                  </div>
                ))}
                <div className="pt-3 mt-3 border-t border-gray-200 space-y-3">
                  {isAuthenticated ? (
                    <>
                      <Link to="/admin/documentos" onClick={() => setIsMenuOpen(false)}>
                        <Button size="sm" variant="outline" className="w-full border-pentathlon-green text-pentathlon-green hover:bg-pentathlon-green hover:text-white">
                          <FileText size={16} className="mr-2" />
                          Admin Documentos
                        </Button>
                      </Link>
                      <Link to="/admin/eventos" onClick={() => setIsMenuOpen(false)}>
                        <Button size="sm" variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                          <Settings size={16} className="mr-2" />
                          Admin Eventos
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sair
                      </Button>
                    </>
                  ) : (
                    <Link to="/admin/documentos" onClick={() => setIsMenuOpen(false)}>
                      <Button size="sm" variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                        <Shield size={16} className="mr-2" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="w-full bg-pentathlon-green hover:bg-pentathlon-green-dark text-white">
                        <Mail className="w-4 h-4 mr-2" />
                        Fale Conosco
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
