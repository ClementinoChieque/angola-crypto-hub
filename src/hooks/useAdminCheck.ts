
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export const useAdminCheck = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkAdminStatus = () => {
      if (!user?.phoneNumber) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Check if the user's phone number matches our admin user
      const adminPhones = ['+244947896752', '244947896752'];
      const isAdminUser = adminPhones.includes(user.phoneNumber);
      
      setIsAdmin(isAdminUser);
      setLoading(false);
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin, loading };
};
