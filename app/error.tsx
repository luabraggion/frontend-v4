'use client';

import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  console.error('Erro da aplicação:', error);

  // Substitui completamente o layout
  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
          <h2 className="text-xl font-semibold mb-4">Algo deu errado</h2>
          <p className="text-gray-600 mb-6">
            Ocorreu um erro inesperado. Nossa equipe foi notificada.
          </p>
          <div className="space-x-4">
            <button
              onClick={reset}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Tentar novamente
            </button>
            <Link
              href="/"
              className="inline-block border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
