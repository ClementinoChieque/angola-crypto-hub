
import React from 'react';
import { 
  Circle, 
  UserPlus,
  Users,
  TrendingUp,
  Plus,
  Send,
  List
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  const menuItems: MenuItem[] = [
    { id: 'quantify', label: 'Quantificar', icon: <Circle size={isMobile ? 16 : 20} /> },
    { id: 'investment', label: 'Plano de Investimento', icon: <TrendingUp size={isMobile ? 16 : 20} /> },
    { id: 'add-account', label: 'Adicionar Conta', icon: <Plus size={isMobile ? 16 : 20} /> },
    { id: 'invite', label: 'Convidar', icon: <UserPlus size={isMobile ? 16 : 20} /> },
    { id: 'my-invites', label: 'Meus Convidados', icon: <Users size={isMobile ? 16 : 20} /> },
    { id: 'transactions', label: 'Transações', icon: <List size={isMobile ? 16 : 20} /> },
    { id: 'suporte', label: 'Suporte', icon: <Send size={isMobile ? 16 : 20} />, link: 'https://web.telegram.org/a/' },
  ];

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm">
      <div className="flex flex-col space-y-2">
        <h3 className="font-semibold text-lg mb-4 text-primary">Menu Principal</h3>
        {menuItems.map((item) =>
          item.id === 'suporte' ? (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl transition-all duration-300 cursor-pointer hover:bg-gray-50 text-primary font-semibold"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
                {item.icon}
              </div>
              <span className="flex-1 text-left">{item.label}</span>
            </a>
          ) : (
            <button
              key={item.id}
              className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === item.id
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
                {item.icon}
              </div>
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          )
        )}
      </div>
    </Card>
  );
};

export default DashboardMenu;
