import { getCurrentYear } from '@/lib/ui/date-utils';
import { cn } from '@/lib/ui/utils';
import Image from 'next/image';

interface FooterProps {
  companyName?: string;
  year?: number;
  version?: string;
  className?: string;
}

const Version = ({ version }: { version: string }) => (
  <div className="flex justify-center gap-x-6 md:order-2">
    <span className="text-sm text-gray-600 dark:text-gray-400">v{version}</span>
  </div>
);

const Copyright = ({ year, companyName }: { year: number; companyName: string }) => (
  <div className="flex items-center mt-8 text-center text-sm/6 text-gray-600 md:order-1 md:mt-0 dark:text-gray-400">
    &copy; {year}
    <span className="flex items-center gap-1 font-semibold ml-1">
      <Image
        src="/images/logo.png"
        alt="Logo Portal de Benefícios"
        width={20}
        height={20}
        className="object-contain"
      />
      {companyName}
    </span>
    <span className="ml-1">Todos os direitos reservados.</span>
  </div>
);

export const Footer = ({
  companyName = 'Your Company, Inc.',
  year,
  className,
  version = '4.0.0',
}: FooterProps) => {
  const displayYear = year ?? getCurrentYear();

  return (
    <footer
      className={cn(
        'w-full mx-auto max-w-7xl px-6 py-6 md:flex md:items-center md:justify-between lg:px-8 bg-white dark:bg-gray-900',
        className,
      )}
    >
      <Version version={version} />
      <Copyright year={displayYear} companyName={companyName} />
    </footer>
  );
};

export default Footer;
