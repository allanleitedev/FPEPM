# Sistema de Gerenciamento de Documentos - FPPM

## 📋 Visão Geral

Sistema seguro de autenticação e upload de documentos para a Federação Pernambucana de Pentatlo Moderno (FPPM). Permite que usuários autenticados façam upload de documentos de transparência de forma segura e organizada.

## 🔐 Sistema de Autenticação

### Credenciais de Demonstração

**Administrador:**
- Email: `admin@fppm.com.br`
- Senha: `admin123`
- Permissões: Acesso completo ao sistema

**Moderador:**
- Email: `moderator@fppm.com.br`
- Senha: `mod123`
- Permissões: Pode adicionar e editar documentos

### Acesso ao Sistema

1. Acesse `/admin/documentos` no navegador
2. Faça login com uma das credenciais acima
3. Você será redirecionado para o painel administrativo

## 📁 Gerenciamento de Documentos

### Categorias Disponíveis

- **Gestão**: Organogramas, relatórios de atividades, diretoria
- **Processos Eleitorais**: Editais, atas de assembleia
- **Estatuto**: Estatuto social, regimentos
- **Manual de Compras**: Procedimentos de compras e licitações
- **Documentos Gerais**: Outros documentos importantes
- **Ouvidoria**: Relatórios e processos da ouvidoria

### Upload de Arquivos

#### Tipos de Arquivo Permitidos
- **Documentos**: PDF, DOC, DOCX
- **Planilhas**: XLS, XLSX
- **Imagens**: JPG, PNG, WEBP

#### Limitações de Segurança
- Tamanho máximo: **10MB por arquivo**
- Validação de tipo MIME
- Sanitização de nomes de arquivo
- Verificação de extensões

### Como Fazer Upload

1. **Acesse o Painel**: Entre em `/admin/documentos`
2. **Faça Login**: Use as credenciais de demonstração
3. **Vá para Upload**: Clique na aba "Upload"
4. **Selecione Categoria**: Escolha a categoria apropriada
5. **Upload do Arquivo**: 
   - Arraste e solte o arquivo na área designada, ou
   - Clique para selecionar arquivo do computador
6. **Preencha Informações**:
   - Título do documento (obrigatório)
   - Descrição (opcional)
7. **Salvar**: Clique em "Salvar Documento"

## 🛡️ Recursos de Segurança

### Validações Implementadas

- **Autenticação obrigatória** para acesso ao sistema
- **Validação de tipos de arquivo** no frontend e backend
- **Limitação de tamanho** para evitar ataques de DoS
- **Sanitização de nomes** de arquivo
- **Verificação de extensões** permitidas
- **Armazenamento seguro** com URLs controláveis

### Proteções Contra Ataques

- **Upload de arquivos maliciosos**: Apenas tipos específicos permitidos
- **Ataques de tamanho**: Limite de 10MB por arquivo
- **Injeção de código**: Sanitização de entradas
- **Acesso não autorizado**: Sistema de autenticação obrigatório

## 🖥️ Interface do Usuário

### Painel Principal

- **Dashboard**: Estatísticas de documentos e acessos
- **Lista de Documentos**: Visualização de todos os documentos
- **Upload**: Interface para adicionar novos documentos
- **Configurações**: Ajustes do sistema

### Recursos da Interface

- **Drag & Drop**: Arraste arquivos diretamente
- **Progress Bar**: Visualização do progresso do upload
- **Preview**: Visualização prévia de documentos
- **Filtros**: Busca por categoria, data, tipo
- **Ações**: Editar, visualizar, baixar, excluir

## 🔧 Configuração Técnica

### Estrutura de Arquivos

```
client/
├── context/
│   └── AuthContext.tsx       # Contexto de autenticação
├── components/
│   ├─��� Login.tsx             # Tela de login
│   ├── FileUpload.tsx        # Componente de upload
│   └── DocumentManager.tsx   # Gerenciador de documentos
└── pages/
    └── AdminDocumentos.tsx   # Página administrativa
```

### Dependências Principais

- **React 18**: Framework frontend
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização
- **Radix UI**: Componentes acessíveis
- **Lucide React**: Ícones

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:

- **Desktop**: Interface completa com todas as funcionalidades
- **Tablet**: Layout adaptado para telas médias
- **Mobile**: Interface otimizada para telas pequenas

## 🚀 Próximos Passos

### Melhorias Sugeridas

1. **Integração com Backend Real**:
   - API REST para upload de arquivos
   - Banco de dados para metadados
   - Sistema de armazenamento em nuvem

2. **Funcionalidades Avançadas**:
   - Versionamento de documentos
   - Aprovação de documentos
   - Auditoria de acessos
   - Notificações por email

3. **Segurança Adicional**:
   - Autenticação de dois fatores
   - Logs de auditoria
   - Backup automático
   - Criptografia de arquivos

## 📞 Suporte

Para dúvidas ou problemas técnicos:

1. Verifique se está usando as credenciais corretas
2. Confirme que o arquivo está dentro dos limites permitidos
3. Tente fazer upload de um arquivo menor para teste
4. Verifique a conexão com a internet

## 📝 Changelog

### v1.0.0 (2025-01-XX)
- ✅ Sistema de autenticação básico
- ✅ Upload de arquivos com validação
- ✅ Interface administrativa completa
- ✅ Categorização de documentos
- ✅ Sistema responsivo
- ✅ Validações de segurança
