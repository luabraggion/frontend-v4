export default function AdminUsersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gerenciar Usuários</h1>
      <div className="bg-card rounded-lg border">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Lista de Usuários</h2>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
              Adicionar Usuário
            </button>
          </div>
          {/* TODO: Implementar tabela de usuários */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <h3 className="font-medium">João Silva</h3>
                <p className="text-muted-foreground">joao@exemplo.com</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-primary hover:text-primary/90">Editar</button>
                <button className="text-destructive hover:text-destructive/90">Excluir</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
