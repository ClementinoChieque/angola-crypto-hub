
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useAccountApproval = () => {
  const [isAccountApproved, setIsAccountApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      checkAccountApproval();
    }
  }, [user]);

  const checkAccountApproval = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_proofs')
        .select('status')
        .eq('user_id', user?.id)
        .eq('status', 'verified')
        .limit(1);

      if (error) throw error;
      
      setIsAccountApproved(data && data.length > 0);
    } catch (error) {
      console.error('Error checking account approval:', error);
    } finally {
      setLoading(false);
    }
  };

  return { isAccountApproved, loading };
};
