import RoletaCanvas from '@/app/RoletaCanvas';

export default function DetalhesPage() {
  const optionsRolueta = [
    { label: 'Prêmio 1', color: '#ff914d' },
    { label: 'Prêmio 2', color: '#e45d56' },
    { label: 'Prêmio 3', color: '#bb2f5d' },
    { label: 'Prêmio 4', color: '#87095e' },
    { label: 'Prêmio 5', color: '#4b0056' },
    { label: 'Prêmio 6', color: '#4e3d8f' },
    { label: 'Prêmio 7', color: '#3f6ec1' },
    { label: 'Prêmio 8', color: '#1b9ee6' },
    { label: 'Prêmio 9', color: '#F79EB1' },
    { label: 'Prêmio 10', color: '#ae8fba' },
  ];

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-12 xl:gap-x-4 p-0">
      <div className="col-span-9">
        <header className="mb-6">
          <h1 className="text-xl font-bold tracking-tight">Detalhes da Campanha</h1>
          <p className="text-gray-600 mt-1">Informações detalhadas sobre esta campanha</p>
        </header>

        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">
            Estatísticas da campanha
          </h2>
          <ul
            role="list"
            className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-6 xl:gap-x-4 mt-8"
          >
            <li className="col-span-1 flex flex-col bg-white rounded-lg shadow p-8">
              <h3 className="text-sm font-medium text-gray-500">Participantes únicos</h3>
              <span className="text-5xl font-semibold mt-2">120</span>
            </li>
            <li className="col-span-1 flex flex-col bg-white rounded-lg shadow p-8">
              <h3 className="text-sm font-medium text-gray-500">Total de jogadas</h3>
              <span className="text-5xl font-semibold mt-2">350</span>
            </li>
            <li className="col-span-1 flex flex-col bg-white rounded-lg shadow p-8">
              <h3 className="text-sm font-medium text-gray-500">Prêmios distribuídos</h3>
              <span className="text-5xl font-semibold mt-2">42</span>
            </li>
            <li className="col-span-1 flex flex-col bg-white rounded-lg shadow p-8">
              <h3 className="text-sm font-medium text-gray-500">Taxa de conversão</h3>
              <span className="text-5xl font-semibold mt-2">35%</span>
            </li>
            <li className="col-span-1 flex flex-col bg-white rounded-lg shadow p-8">
              <h3 className="text-sm font-medium text-gray-500">Engajamento</h3>
              <span className="text-5xl font-semibold mt-2">78%</span>
            </li>
            <li className="col-span-1 flex flex-col bg-white rounded-lg shadow p-8">
              <h3 className="text-sm font-medium text-gray-500">Dias restantes</h3>
              <span className="text-5xl font-semibold mt-2">15</span>
            </li>
          </ul>
        </section>

        <section aria-labelledby="description-heading" className="mt-10">
          <h2 id="description-heading" className="text-xl font-bold tracking-tight">
            Detalhes dos Benefícios
          </h2>
          <p className="text-gray-600 mt-1">
            Informações detalhadas sobre os benefícios desta campanha
          </p>
          <div className="overflow-hidden mt-8">
            <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase">
                    Tipo de Benefício
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase">
                    Segmento
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase">
                    Canal
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase">
                    Data de Criação
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase">
                    Data da Finalização
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase">
                    Data do Resultado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase">
                    Divulgações
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase">
                    Otimizador de Mídia
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase">
                    Prêmios
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase">
                    Roleta
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-3 text-sm text-gray-500 font-light">Sorteio</td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-light">Varejo</td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-light">Online</td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-light">01/09/2024</td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-light">30/09/2024</td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-light">05/10/2024</td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-light">5</td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-light">Ativo</td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-light">10 prêmios</td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-light">Sim</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <div className="col-span-3 self-center h-full content-end-safe">
        <RoletaCanvas options={optionsRolueta} />
      </div>
    </div>
  );
}
