/**
 * @file Barrel exports para todos os componentes da aplicação
 * Este arquivo centraliza todas as exportações de componentes para facilitar importações
 */

// Componentes de Formulários (inputs, selects, checkboxes, etc.)
export * from './forms';

// Componentes de Botões (buttons, button icons, etc.)
export * from './buttons';

// Componentes de Navegação (breadcrumbs, progress indicators, etc.)
export * from './navigation';

// Componentes de Feedback (alerts, notifications, dialogs, etc.)
export * from './feedback';

// Componentes de Layout (headers, footers, sidebars, etc.)
export * from './layout';

// Componentes Base (shadcn ui e outros componentes de baixo nível)
// Obs: Idealmente, componentes da pasta ui devem ser importados diretamente usando @/components/ui
// e não através deste arquivo barrel para evitar importações desnecessárias
// export * from './ui';

// Providers e Contextos
export { PageTitleProvider, usePageTitle } from './PageTitleContext';
export { ThemeProvider } from './theme-provider';

// Componentes independentes
export { Drawer } from './Drawer';
