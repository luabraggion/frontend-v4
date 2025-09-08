export default function AdminSettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Configurações do Sistema</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Configurações Gerais</h2>
          {/* TODO: Implementar configurações gerais */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome da Aplicação</label>
              <input
                type="text"
                defaultValue="Portal de Benefícios"
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tema Padrão</label>
              <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
                <option value="system">Sistema</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Configurações de Email</h2>
          {/* TODO: Implementar configurações de email */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Servidor SMTP</label>
              <input
                type="text"
                placeholder="smtp.exemplo.com"
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Porta</label>
              <input
                type="number"
                placeholder="587"
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
