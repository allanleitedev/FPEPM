import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, Mail, UserPlus } from 'lucide-react';

interface LoginProps {
  onSuccess?: () => void;
}

export default function Login({ onSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (isSignUp && !name) {
      setError('Por favor, preencha o nome');
      return;
    }

    try {
      const result = isSignUp
        ? await signUp(email, password, name)
        : await signIn(email, password);

      if (result.success) {
        // Show success message if provided (e.g., demo mode notification)
        if (result.message) {
          setSuccessMessage(result.message);
          // Clear success message after 3 seconds
          setTimeout(() => setSuccessMessage(''), 3000);
        }
        onSuccess?.();
      } else {
        setError(result.error || 'Erro durante a autenticação');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Erro inesperado durante o login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pentathlon-green/20 via-pentathlon-blue/15 to-pentathlon-gold/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pentathlon-green to-pentathlon-blue rounded-full flex items-center justify-center">
            {isSignUp ? <UserPlus className="w-8 h-8 text-white" /> : <Lock className="w-8 h-8 text-white" />}
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isSignUp ? 'Criar Conta Admin' : 'Acesso Administrativo'}
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              {isSignUp 
                ? 'Cadastre-se para gerenciar documentos e eventos'
                : 'Entre com suas credenciais para acessar o painel administrativo'
              }
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@fppm.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-pentathlon-green to-pentathlon-green-dark hover:from-pentathlon-green-dark hover:to-pentathlon-green"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp ? 'Criando conta...' : 'Entrando...'}
                </>
              ) : (
                isSignUp ? 'Criar Conta' : 'Entrar'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setEmail('');
                setPassword('');
                setName('');
              }}
              disabled={isLoading}
              className="text-pentathlon-blue hover:text-pentathlon-green"
            >
              {isSignUp 
                ? 'Já tem uma conta? Fazer login' 
                : 'Não tem conta? Criar conta'
              }
            </Button>
          </div>
          
          {!isSignUp && (
            <div className="mt-6 space-y-3">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 font-medium mb-2">✅ Autenticação Real:</p>
                <div className="text-xs text-green-700 space-y-1">
                  <p>• Crie uma conta ou use qualquer email/senha</p>
                  <p>• Dados sincronizados com Supabase</p>
                  <p>• Fallback automático para modo demo</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium mb-2">🚀 Credenciais Demo:</p>
                <div className="text-xs text-blue-700 space-y-1">
                  <p><strong>Admin:</strong> admin@fppm.com.br / admin123</p>
                  <p><strong>Moderador:</strong> moderator@fppm.com.br / mod123</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
