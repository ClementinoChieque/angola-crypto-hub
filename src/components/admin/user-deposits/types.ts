
export interface DepositRequest {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  description: string | null;
  status: string;
  created_at: string;
  type: string;
  profiles?: {
    username: string;
  };
}
