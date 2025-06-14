
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { Menu, X, LogOut, User, Wallet } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { balance } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-white/20 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src="/lovable-uploads/a968357d-2b22-46e9-9a6c-d590de85e923.png" 
              alt="Bitget12" 
              className="h-8 w-8 transition-transform duration-300 hover:scale-110"
            />
          </div>
          <span className="font-bold text-xl crypto-gradient-text">Bitget12</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <div className="flex items-center gap-3 glass-card px-4 py-2 rounded-full border border-white/20">
                <Wallet size={16} className="text-crypto-blue" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Saldo:</span>
                  <span className="font-semibold text-sm crypto-gradient-text">
                    {balance.amount.toLocaleString()} {balance.currency}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-full border border-white/20">
                <User size={16} className="text-crypto-purple" />
                <span className="text-sm font-medium">{user.phoneNumber}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 glass-card border-white/20 hover:bg-red-50 hover:border-red-200 transition-all duration-300"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </Button>
            </>
          ) : null}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9 p-0 hover:bg-white/10">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] sm:w-[350px] glass-card-dark border-l border-white/20">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between py-4 border-b border-white/20">
                <div className="flex items-center gap-3">
                  <img 
                    src="/lovable-uploads/a968357d-2b22-46e9-9a6c-d590de85e923.png" 
                    alt="Bitget12" 
                    className="h-6 w-6"
                  />
                  <span className="font-bold text-xl crypto-gradient-text">Menu</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex flex-col py-6 space-y-4">
                {user ? (
                  <>
                    <div className="professional-card">
                      <div className="flex items-center gap-3 mb-3">
                        <Wallet size={20} className="text-crypto-blue" />
                        <span className="font-semibold">Saldo Atual</span>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold crypto-gradient-text">
                          {balance.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">{balance.currency}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 professional-card">
                      <User size={18} className="text-crypto-purple" />
                      <div>
                        <div className="text-sm text-muted-foreground">Usuário</div>
                        <div className="font-medium">{user.phoneNumber}</div>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="flex items-center gap-3 crypto-button justify-start"
                    >
                      <LogOut size={16} />
                      <span>Sair da Conta</span>
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
