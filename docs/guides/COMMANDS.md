# 🚀 Comandos do Projeto Next.js

Este documento lista todos os comandos disponíveis para desenvolvimento, build e manutenção do projeto.

## 📝 **Comandos de Desenvolvimento**

```bash
# Inicia o servidor de desenvolvimento (porta 8000)
npm run dev

# Inicia o servidor de desenvolvimento com HTTPS
npm run dev:prod

# Preview da build de produção
npm run preview
```

## 🏗️ **Comandos de Build**

```bash
# Build padrão para produção
npm run build

# Build com análise de bundle
npm run build:analyze

# Inicia o servidor de produção
npm run start

# Inicia o servidor de produção na porta 3000
npm run start:prod

# Limpa arquivos de build
npm run clean
```

## 🔍 **Comandos de Qualidade de Código**

```bash
# Verifica problemas de linting
npm run lint

# Corrige automaticamente problemas de linting
npm run lint:fix

# Formata todos os arquivos
npm run format

# Verifica se os arquivos estão formatados
npm run format:check

# Verifica tipos TypeScript
npm run type-check

# Executa todas as verificações
npm run check-all
```

## 🛠️ **Comandos de Instalação**

```bash
# Instala dependências
npm install

# Instala dependências para Git Hooks
npm run prepare
```

## 📊 **Análise de Performance**

```bash
# Analisa o tamanho do bundle
ANALYZE=true npm run build

# No Windows (PowerShell):
$env:ANALYZE="true"; npm run build
```

## 🎯 **Scripts Utilitários**

### Verificação Completa

```bash
# Executa type-check + lint + format:check
npm run check-all
```

### Limpeza e Rebuild

```bash
# Limpa e reconstrói o projeto
npm run clean && npm run build
```

### Desenvolvimento com HTTPS

```bash
# Para testar funcionalidades que requerem HTTPS
npm run dev:prod
```

## 🔧 **Configurações Importantes**

- **Porta de desenvolvimento**: 8000
- **Porta de produção**: 3000
- **Turbopack**: Habilitado por padrão
- **TypeScript**: Modo estrito ativado
- **ESLint**: Configurado com Prettier
- **Git Hooks**: Lint-staged configurado

## 📁 **Estrutura de Pastas**

```
src/
├── app/                 # App Router (Next.js 13+)
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── forms/          # Componentes de formulário
│   ├── buttons/        # Componentes de botão
│   ├── navigation/     # Componentes de navegação
│   └── feedback/       # Componentes de feedback
└── lib/                # Utilitários e configurações
```

## 🎨 **Extensões Recomendadas**

Instale as extensões listadas em `.vscode/extensions.json` para melhor experiência de desenvolvimento:

- Prettier (formatação)
- ESLint (linting)
- Tailwind CSS IntelliSense
- TypeScript Importer
- Error Lens
- GitLens

## 📋 **Checklist de Deploy**

1. ✅ `npm run check-all` - Verificar qualidade do código
2. ✅ `npm run build` - Build de produção
3. ✅ `npm run start` - Testar build localmente
4. ✅ Verificar logs de erro
5. ✅ Testar funcionalidades principais
6. ✅ Deploy para produção
