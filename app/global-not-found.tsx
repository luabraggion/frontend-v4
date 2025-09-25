import { Fira_Sans, Manrope } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import '../styles/globals.css';

const manrope = Manrope({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const firaSans = Fira_Sans({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

export const metadata = {
  title: 'Página Não Encontrada',
};

export default function NotFound() {
  return (
    <html lang="pt-br">
      <body className={`${manrope.variable} ${firaSans.variable} font-sans antialiased bg-gray-50`}>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="flex items-center justify-center text-6xl font-bold text-gray-500 mb-4 font-display">
              <Image
                src="/images/logo.png"
                alt="Big2be"
                width={50}
                height={50}
                className="object-contain"
                priority
              />
              <span className="align-middle bg-gradient-to-r from-yellow-300 to-amber-600 bg-clip-text font-extrabold text-transparent">
                404
              </span>
            </h1>
            <h2 className="text-2xl font-bold mb-4 text-gray-600">Página não encontrada</h2>
            <p className="text-muted-foreground mb-6">
              A página que você está procurando não existe ou foi movida.
            </p>
            <Link
              href="/"
              className="inline-block font-semibold bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-500"
            >
              Página inicial
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
