
export interface Referral {
  id: string;
  referral_code: string;
  invited_email?: string;
  invited_phone?: string;
  status: 'pending' | 'completed' | 'expired';
  created_at: string;
  completed_at?: string;
  referred_user_id?: string;
}
