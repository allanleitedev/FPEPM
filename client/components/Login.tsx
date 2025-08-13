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
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (isSignUp && !name) {
      setError('Por favor, preencha o nome');
      return;
    }
    
    const result = isSignUp 
      ? await signUp(email, password, name)
      : await signIn(email, password);
    
    if (result.success) {
      onSuccess?.();
    } else {
      setError(result.error || 'Erro durante a autenticação');
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
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 font-medium mb-2">Credenciais de demonstração:</p>
              <div className="text-xs text-gray-500 space-y-1">
                <p><strong>Email:</strong> admin@fppm.com.br</p>
                <p><strong>Senha:</strong> admin123</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
