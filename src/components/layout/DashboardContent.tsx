
import React from 'react';
import { Card } from '@/components/ui/card';
import Quantify from '../features/Quantify';
import InvestmentPlans from '../features/InvestmentPlans';
import AddAccount from '../features/AddAccount';
import InviteUsers from '../features/InviteUsers';
import MyInvites from '../features/MyInvites';
import TransactionHistory from '../features/TransactionHistory';

interface DashboardContentProps {
  activeTab: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activeTab }) => {
  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm">
      {activeTab === 'quantify' && <Quantify />}
      {activeTab === 'investment' && <InvestmentPlans />}
      {activeTab === 'add-account' && <AddAccount />}
      {activeTab === 'invite' && <InviteUsers />}
      {activeTab === 'my-invites' && <MyInvites />}
      {activeTab === 'transactions' && <TransactionHistory />}
    </Card>
  );
};

export default DashboardContent;
