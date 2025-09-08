export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Fazer Login</h2>
          <p className="text-muted-foreground mt-2">
            Entre com suas credenciais para acessar sua conta
          </p>
        </div>
        <div className="bg-card p-8 rounded-lg border">
          {/* TODO: Implementar formulário de login */}
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
