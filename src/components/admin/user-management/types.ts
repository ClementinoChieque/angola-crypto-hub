
import type { Database } from '@/integrations/supabase/types';

export type InvestmentPlan = Database['public']['Tables']['investment_plans']['Row'];

export interface UserWithReferrals {
  id: string;
  phone: string;
  created_at: string;
  referral_count: number;
  quantification_active: boolean;
  investment_plan_id: string | null;
  balance: number;
  plan: InvestmentPlan | null;
  daily_limit: number;
}

export interface ReferralReward {
  id: string;
  referrer_id: string;
  referred_user_id: string;
  reward_amount: number;
  reward_currency: string;
  status: string;
  created_at: string;
}
