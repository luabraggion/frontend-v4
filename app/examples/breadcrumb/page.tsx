'use client';

import { Breadcrumb } from '@/components/layout';
import { usePageTitle } from '@/components/PageTitleContext';
import { useEffect } from 'react';

export default function ExemploBreadcrumbPage() {
  // Atualiza o título da página (usado pelo HeaderWithTitle)
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle('Exemplo com Título e Breadcrumb');
  }, [setTitle]);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      {/* Define o breadcrumb para esta página */}
      <Breadcrumb
        items={[
          { label: 'Início', href: '/' },
          { label: 'Exemplos', href: '/examples' },
          { label: 'Exemplo com Título e Breadcrumb', isCurrent: true },
        ]}
      />

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Como usar o sistema de breadcrumb dinâmico</h2>

        <div className="mt-4 space-y-4">
          <p>
            Esta página demonstra como usar o sistema de breadcrumb dinâmico em conjunto com o
            <code className="px-1 py-0.5 bg-gray-100 rounded">HeaderWithTitle</code>.
          </p>

          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="font-medium">Para usar este sistema em suas páginas:</h3>
            <ol className="list-decimal pl-5 mt-2 space-y-2">
              <li>
                Importe o componente <code>Breadcrumb</code> de <code>@/components/layout</code>
              </li>
              <li>
                Adicione o componente <code>Breadcrumb</code> no início da sua página
              </li>
              <li>Defina os itens do breadcrumb para esta página específica</li>
              <li>
                Use o hook <code>usePageTitle</code> para definir o título da página
              </li>
            </ol>
          </div>

          <p>
            O breadcrumb acima desta página é definido diretamente nesta página, mas aparece no
            Header que está no layout principal. Isso permite que cada página defina seu próprio
            breadcrumb.
          </p>
        </div>
      </div>
    </div>
  );
}
