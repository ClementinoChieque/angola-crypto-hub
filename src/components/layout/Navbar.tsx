
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import { Menu, X, LogOut, User, Wallet } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { balance } = useUser();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src="/lovable-uploads/a968357d-2b22-46e9-9a6c-d590de85e923.png" 
              alt="Bitget12" 
              className="h-8 w-8"
            />
          </div>
          <span className="font-bold text-xl text-primary">Bitget12</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <LanguageSelector />
          {user ? (
            <>
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border">
                <Wallet size={16} className="text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">{t('balance')}:</span>
                  <span className="font-semibold text-sm text-primary">
                    {balance.amount.toLocaleString()} {balance.currency}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full border">
                <User size={16} className="text-gray-600" />
                <span className="text-sm font-medium">{user.phoneNumber}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                <span>{t('logout')}</span>
              </Button>
            </>
          ) : (
            <LanguageSelector />
          )}
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
                <div className="flex items-center gap-3">
                  <img 
                    src="/lovable-uploads/a968357d-2b22-46e9-9a6c-d590de85e923.png" 
                    alt="Bitget12" 
                    className="h-6 w-6"
                  />
                  <span className="font-bold text-xl text-primary">{t('menu')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <LanguageSelector />
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col py-6 space-y-4">
                {user ? (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex items-center gap-3 mb-3">
                        <Wallet size={20} className="text-primary" />
                        <span className="font-semibold">{t('currentBalance')}</span>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {balance.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">{balance.currency}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border">
                      <User size={18} className="text-gray-600" />
                      <div>
                        <div className="text-sm text-muted-foreground">{t('user')}</div>
                        <div className="font-medium">{user.phoneNumber}</div>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="flex items-center gap-3 justify-start"
                    >
                      <LogOut size={16} />
                      <span>{t('logoutAccount')}</span>
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
