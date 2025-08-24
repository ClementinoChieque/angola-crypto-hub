
import React from 'react';
import { 
  Circle, 
  UserPlus,
  Users,
  TrendingUp,
  Plus,
  Send,
  List,
  Coins,
  MessageCircle
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  link?: string;
};

interface DashboardTabsMobileProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const DashboardTabsMobile: React.FC<DashboardTabsMobileProps> = ({ activeTab, setActiveTab }) => {
  const isMobile = useIsMobile();

  const menuItems: MenuItem[] = [
   
    { id: 'ganhos', label: 'Ganhos', icon: <Coins size={isMobile ? 16 : 20} /> },
    { id: 'investment', label: 'Plano de Investimento', icon: <TrendingUp size={isMobile ? 16 : 20} /> },
    { id: 'add-account', label: 'Adicionar Conta', icon: <Plus size={isMobile ? 16 : 20} /> },
    { id: 'invite', label: 'Convidar', icon: <UserPlus size={isMobile ? 16 : 20} /> },
    { id: 'my-invites', label: 'Meus Convidados', icon: <Users size={isMobile ? 16 : 20} /> },
    { id: 'transactions', label: 'Transações', icon: <List size={isMobile ? 16 : 20} /> },
    { id: 'suporte-telegram', label: 'Suporte Telegram', icon: <Send size={isMobile ? 16 : 20} /> },
    { id: 'suporte-whatsapp', label: 'Suporte WhatsApp', icon: <MessageCircle size={isMobile ? 16 : 20} />, link: 'https://api.whatsapp.com/send?phone=48510601767&text=Ol%C3%A1%2C%20seja%20Bem-vindo(a)%20%C3%A0%20Bitget12!' },
  ];

  // Separar os botões em pares para renderizar as TabsList corretamente
  const tabPairs = [];
  for (let i = 0; i < menuItems.length; i += 2) {
    tabPairs.push(menuItems.slice(i, i + 2));
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      {tabPairs.map((pair, idx) => (
        <TabsList key={idx} className="grid grid-cols-2 mb-3 bg-white/90 backdrop-blur-sm">
          {pair.map((item) =>
            item.link ? (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center py-2 text-xs transition-colors hover:text-primary"
                style={{ textDecoration: 'none'}}
              >
                {item.icon}
                <span className="mt-1 text-center text-xs">{item.label}</span>
              </a>
            ) : (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className="flex flex-col items-center py-2 text-xs"
              >
                {item.icon}
                <span className="mt-1 text-center text-xs">{item.label}</span>
              </TabsTrigger>
            )
          )}
        </TabsList>
      ))}
    </Tabs>
  );
};

export default DashboardTabsMobile;
