
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
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  link?: string;
};

interface DashboardMenuProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const DashboardMenu: React.FC<DashboardMenuProps> = ({ activeTab, setActiveTab }) => {
  const menuItems: MenuItem[] = [
    { id: 'quantify', label: 'Quantificar', icon: <Circle size={20} /> },
    { id: 'ganhos', label: 'Ganhos', icon: <Coins size={20} /> },
    { id: 'investment', label: 'Plano de Investimento', icon: <TrendingUp size={20} /> },
    { id: 'add-account', label: 'Adicionar Conta', icon: <Plus size={20} /> },
    { id: 'invite', label: 'Convidar', icon: <UserPlus size={20} /> },
    { id: 'my-invites', label: 'Meus Convidados', icon: <Users size={20} /> },
    { id: 'transactions', label: 'Transações', icon: <List size={20} /> },
    { id: 'suporte-telegram', label: 'Suporte Telegram', icon: <Send size={20} /> },
    { id: 'suporte-whatsapp', label: 'Suporte WhatsApp', icon: <MessageCircle size={20} />, link: 'https://wa.link/upzjio' },
  ];

  return (
    <nav className="space-y-2">
      {menuItems.map((item) =>
        item.link ? (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-gray-100 rounded-md text-gray-700"
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ) : (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full justify-start gap-3 px-4 py-2 text-sm transition-colors hover:bg-gray-100 text-gray-700",
              activeTab === item.id && "bg-gray-100"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Button>
        )
      )}
    </nav>
  );
};

export default DashboardMenu;
