
export interface UserWithReferrals {
  id: string;
  phone: string;
  created_at: string;
  referral_count: number;
  quantification_active: boolean;
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
