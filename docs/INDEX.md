# 📚 Documentação do Projeto

Esta pasta contém toda a documentação técnica e histórica do projeto organizada em categorias específicas. Para informações gerais e quick start, consulte o [README.md](../README.md) na raiz do projeto.

## � Estrutura da Documentação

```
docs/
├── 📖 guides/              # Guias de desenvolvimento e uso
├── 🏗️ architecture/        # Documentação arquitetural
├── 💡 examples/            # Exemplos práticos e código
├── 📜 history/             # Histórico de refatorações
└── 📋 INDEX.md            # Este arquivo (navegação principal)
```

## 📋 Navegação por Categoria

### 📖 **[Guias de Desenvolvimento](./guides/)**

> **Para:** Desenvolvedores de todos os níveis

- **[DEVELOPER_GUIDE.md](./guides/DEVELOPER_GUIDE.md)** - Guia completo para desenvolvedores
- **[COMMANDS.md](./guides/COMMANDS.md)** - Todos os comandos disponíveis
- **[DOCS.md](./guides/DOCS.md)** - Documentação completa do sistema

### 🏗️ **[Arquitetura & Design](./architecture/)**

> **Para:** Arquitetos, Tech Leads e Desenvolvedores Sênior

- **[ARCHITECTURE.md](./architecture/ARCHITECTURE.md)** - Documentação técnica da arquitetura
- **[HYBRID_ARCHITECTURE.md](./architecture/HYBRID_ARCHITECTURE.md)** - Arquitetura híbrida implementada

### 💡 **[Exemplos Práticos](./examples/)**

> **Para:** Implementação e Referência

- **[API_EXAMPLES.md](./examples/API_EXAMPLES.md)** - Exemplos de uso das APIs

### 📜 **[Histórico de Refatorações](./history/)**

> **Para:** Contexto e Evolução do Projeto

- **[ESTRUTURA_NEXTJS15.md](./history/ESTRUTURA_NEXTJS15.md)** - Implementação da estrutura Next.js 15
- **[REMOCAO_SRC_COMPLETA.md](./history/REMOCAO_SRC_COMPLETA.md)** - Processo de remoção da pasta /src
- **[MIDDLEWARE_REORGANIZADO.md](./history/MIDDLEWARE_REORGANIZADO.md)** - Reorganização do middleware
- **[MIDDLEWARE_REFACTOR.md](./history/MIDDLEWARE_REFACTOR.md)** - Refatoração do middleware
- **[REVIEW_COMPLETE.md](./history/REVIEW_COMPLETE.md)** - Review completo do projeto

---

## 🎯 Fluxos de Navegação Recomendados

### 👥 **Para Novos Desenvolvedores**

```
1. 📖 guides/DEVELOPER_GUIDE.md    # Visão geral e setup
2. 📖 guides/COMMANDS.md           # Comandos essenciais
3. 💡 examples/API_EXAMPLES.md     # Exemplos práticos
4. 📖 guides/DOCS.md               # Referência completa
```

### 🔧 **Para Arquitetos/Tech Leads**

```
1. 🏗️ architecture/ARCHITECTURE.md        # Arquitetura atual
2. 🏗️ architecture/HYBRID_ARCHITECTURE.md # Arquitetura híbrida
3. 📜 history/                            # Contexto histórico
4. 💡 examples/API_EXAMPLES.md            # Padrões de implementação
```

### 📚 **Para Auditoria/Review**

```
1. 📖 guides/DOCS.md                      # Estado atual
2. 🏗️ architecture/                       # Decisões arquiteturais
3. 📜 history/REVIEW_COMPLETE.md          # Último review
4. 📜 history/                            # Evolução completa
```

### � **Para Implementação Rápida**

```
1. 📖 guides/COMMANDS.md           # Comandos necessários
2. 💡 examples/API_EXAMPLES.md     # Código pronto
3. 📖 guides/DEVELOPER_GUIDE.md    # Contexto técnico
```

---

## 🔍 Busca Rápida

| Preciso de...               | Vá para...                     |
| --------------------------- | ------------------------------ |
| **Setup do projeto**        | `guides/DEVELOPER_GUIDE.md`    |
| **Comandos npm**            | `guides/COMMANDS.md`           |
| **Referência completa**     | `guides/DOCS.md`               |
| **Decisões arquiteturais**  | `architecture/ARCHITECTURE.md` |
| **Exemplos de código**      | `examples/API_EXAMPLES.md`     |
| **Histórico de mudanças**   | `history/`                     |
| **Como foi implementado X** | `history/` + pesquisar         |

---

**💡 Dica:** Cada pasta possui seu próprio README.md com navegação específica e contexto detalhado!
