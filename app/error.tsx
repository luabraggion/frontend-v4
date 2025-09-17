'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Erro da aplicação:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-destructive mb-4">Oops!</h1>
        <h2 className="text-xl font-semibold mb-4">Algo deu errado</h2>
        <p className="text-muted-foreground mb-6">
          Ocorreu um erro inesperado. Nossa equipe foi notificada.
        </p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="inline-block border border-border px-4 py-2 rounded-md hover:bg-accent"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}
