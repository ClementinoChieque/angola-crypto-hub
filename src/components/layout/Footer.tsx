
import React from 'react';
import { Separator } from '@/components/ui/separator';

interface FooterProps {
  variant?: 'light' | 'dark';
}

const Footer: React.FC<FooterProps> = ({ variant = 'light' }) => {
  const textColor = 'text-white/80';
  const hoverColor = 'hover:text-white';
  const separatorColor = 'bg-white/20';

  return (
    <footer className={`bg-dark-blue py-6 ${textColor}`}>
      <div className="container mx-auto px-4">
        <Separator className={`my-4 ${separatorColor}`} />
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-center md:text-left mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} Bitget12. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <a href="/terms" className={hoverColor}>Políticas de Uso</a>
            <a href="/about" className={hoverColor}>Sobre Nós</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
