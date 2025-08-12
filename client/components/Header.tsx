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
            <div className="w-10 h-10 bg-pentathlon-green rounded-full flex items-center justify-center group-hover:bg-pentathlon-green-dark transition-colors">
              <img 
                src="https://cdn.builder.io/api/v1/image/assets%2F83197d83cffa4d76b43dffc4a37dfe2d%2F64c4550af4cc44819ea4276fee6fe144?format=webp&width=800" 
                alt="CBPM" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-gray-900">CBPM</div>
              <div className="text-xs text-gray-600">Confederação Brasileira</div>
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

          {/* CTA Button */}
          <div className="hidden md:block">
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
              <div className="pt-4 border-t border-gray-200">
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
