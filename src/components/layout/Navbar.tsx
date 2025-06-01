
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { Menu, X, LogOut, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { balance } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/a968357d-2b22-46e9-9a6c-d590de85e923.png" 
            alt="Bitget12" 
            className="h-8 w-8"
          />
          <span className="font-bold text-xl text-crypto-blue">Bitget12</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Saldo:</span>
                <span className="font-medium">{balance.amount.toLocaleString()} {balance.currency}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <User size={16} />
                <span>{user.phoneNumber}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-1"
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
            <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] sm:w-[350px]">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between py-4 border-b">
                <div className="flex items-center gap-2">
                  <img 
                    src="/lovable-uploads/a968357d-2b22-46e9-9a6c-d590de85e923.png" 
                    alt="Bitget12" 
                    className="h-6 w-6"
                  />
                  <span className="font-bold text-xl text-crypto-blue">Menu</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex flex-col py-4 space-y-4">
                {user ? (
                  <>
                    <div className="flex flex-col gap-1 p-4 rounded-lg bg-muted">
                      <span className="text-sm text-muted-foreground">Saldo:</span>
                      <span className="font-bold text-lg">{balance.amount.toLocaleString()} {balance.currency}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 p-4">
                      <User size={18} />
                      <span>{user.phoneNumber}</span>
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      <span>Sair</span>
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
