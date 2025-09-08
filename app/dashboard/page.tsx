export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Bem-vindo ao Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cards de estatísticas */}
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Total de Usuários</h3>
          <p className="text-3xl font-bold text-primary">1,234</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Campanhas Ativas</h3>
          <p className="text-3xl font-bold text-primary">8</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Pontos Resgatados</h3>
          <p className="text-3xl font-bold text-primary">45,678</p>
        </div>
      </div>
    </div>
  );
}
