
import React from 'react';
import { Separator } from '@/components/ui/separator';

interface FooterProps {
  variant?: 'light' | 'dark';
}

const Footer: React.FC<FooterProps> = ({ variant = 'light' }) => {
  const textColor = variant === 'light' ? 'text-gray-600' : 'text-white/80';
  const hoverColor = variant === 'light' ? 'hover:text-primary' : 'hover:text-white';
  const separatorColor = variant === 'light' ? 'bg-gray-200' : 'bg-white/20';

  return (
    <footer className={`bg-transparent py-6 ${textColor}`}>
      <div className="container mx-auto px-4">
        <Separator className={`my-4 ${separatorColor}`} />
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-center md:text-left mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} Bitget12. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <a href="#" className={hoverColor}>Políticas de Uso</a>
            <a href="#" className={hoverColor}>Sobre Nós</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
