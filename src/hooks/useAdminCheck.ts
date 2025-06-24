
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useAdminCheck = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.phoneNumber && !user?.id) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Check if the user's phone number matches our hardcoded admin users
        const adminPhones = ['+244947896752', '244947896752', '+244930024983', '244930024983'];
        const isHardcodedAdmin = user.phoneNumber && adminPhones.includes(user.phoneNumber);
        
        // Also check if user has admin role in database
        let hasAdminRole = false;
        if (user.id) {
          const { data: userRoles, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'admin')
            .single();

          if (!error && userRoles) {
            hasAdminRole = true;
          }
        }
        
        const isAdminUser = isHardcodedAdmin || hasAdminRole;
        setIsAdmin(isAdminUser);
      } catch (error) {
        console.error('Erro ao verificar status de admin:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin, loading };
};
