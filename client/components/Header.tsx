import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Trophy, Calendar, FileText, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Início', href: '/', icon: null },
    { name: 'Eventos', href: '/eventos', icon: Calendar },
    { name: 'Transparência', href: '/transparencia', icon: FileText },
    { name: 'Atletas', href: '/atletas', icon: Users },
    { name: 'Sobre', href: '/sobre', icon: Trophy },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 flex items-center justify-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F83197d83cffa4d76b43dffc4a37dfe2d%2F4c6593141cce41149696bda6e0c6120a?format=webp&width=800"
                alt="FPPM"
                className="h-10 w-auto object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-gray-900">FPPM</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-pentathlon-green font-medium text-sm transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Admin & CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/admin/eventos">
              <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Settings size={16} className="mr-2" />
                Admin
              </Button>
            </Link>
            <Button size="sm" className="bg-pentathlon-green hover:bg-pentathlon-green-dark text-white">
              Fale Conosco
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-pentathlon-green transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center gap-3 text-gray-700 hover:text-pentathlon-green font-medium text-sm transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <item.icon size={18} />}
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link to="/admin/eventos" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Settings size={16} className="mr-2" />
                    Admin Eventos
                  </Button>
                </Link>
                <Button size="sm" className="w-full bg-pentathlon-green hover:bg-pentathlon-green-dark text-white">
                  Fale Conosco
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
