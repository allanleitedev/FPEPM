# Fusion Starter - Sistema de Gestão de Documentos

Sistema completo de gestão de documentos e eventos com autenticação, upload de arquivos e interface administrativa.

## 🚀 Deploy

### Vercel (Recomendado)

Este projeto está configurado para deploy na Vercel. Veja o guia completo em [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md).

**Deploy rápido:**
1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente (Supabase)
3. Deploy automático!

### Outras Plataformas

- **Netlify**: Configurado com `netlify.toml`
- **GitHub Pages**: Configurado com workflows

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + Radix UI
- **Backend**: Express.js + Supabase
- **Autenticação**: Supabase Auth
- **Deploy**: Vercel/Netlify

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build
npm run build

# Testes
npm test
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` com:

```bash
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
PING_MESSAGE=pong
```

### Supabase Setup

Execute os scripts SQL em `supabase_setup.sql` para configurar o banco de dados.

## 📁 Estrutura

```
├── client/          # Frontend React
├── server/          # Backend Express
├── api/             # API Routes (Vercel)
├── shared/          # Código compartilhado
├── public/          # Arquivos estáticos
└── docs/            # Documentação
```

## 🎯 Funcionalidades

- ✅ Autenticação de usuários
- ✅ Upload e gestão de documentos
- ✅ Sistema de eventos
- ✅ Interface administrativa
- ✅ Responsivo e acessível
- ✅ Internacionalização (EN/PT/ES)

## 📚 Documentação

- [Guia de Deploy Vercel](./VERCEL_DEPLOY.md)
- [Sistema de Documentos](./SISTEMA_DOCUMENTOS.md)
- [Agentes AI](./AGENTS.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
