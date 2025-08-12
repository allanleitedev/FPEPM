import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F83197d83cffa4d76b43dffc4a37dfe2d%2Fbb91c0eedcf347ef94d319f58f5bc083?format=webp&width=800"
                  alt="FPPM"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <div className="font-bold text-lg">FPPM</div>
                <div className="text-sm text-gray-400">Federação Pernambucana</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Promovendo a excelência esportiva e o desenvolvimento do pentatlo moderno no Brasil.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              {[
                { name: 'Início', href: '/' },
                { name: 'Eventos', href: '/eventos' },
                { name: 'Transparência', href: '/transparencia' },
                { name: 'Atletas', href: '/atletas' },
                { name: 'Sobre', href: '/sobre' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-gray-400 hover:text-pentathlon-green transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Transparência */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Transparência</h3>
            <ul className="space-y-2">
              {[
                { name: 'Relatórios Financeiros', href: '/transparencia/financeiro' },
                { name: 'Gestão', href: '/transparencia/gestao' },
                { name: 'Resultados', href: '/transparencia/resultados' },
                { name: 'Estatuto', href: '/transparencia/estatuto' },
                { name: 'Atas', href: '/transparencia/atas' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-gray-400 hover:text-pentathlon-green transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-pentathlon-green" />
                <span className="text-gray-400">contato@fppm.org.br</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-pentathlon-green" />
                <span className="text-gray-400">(11) 3456-7890</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={16} className="text-pentathlon-green mt-0.5" />
                <span className="text-gray-400">
                  Rua do Esporte, 123<br />
                  São Paulo, SP - 01234-567
                </span>
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="mt-6">
              <h4 className="font-medium mb-3">Siga-nos</h4>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: '#' },
                  { icon: Instagram, href: '#' },
                  { icon: Youtube, href: '#' },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pentathlon-green transition-colors"
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Federação Pernambucana de Pentatlo Moderno. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacidade" className="text-gray-400 hover:text-pentathlon-green text-sm transition-colors">
              Política de Privacidade
            </Link>
            <Link to="/termos" className="text-gray-400 hover:text-pentathlon-green text-sm transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
