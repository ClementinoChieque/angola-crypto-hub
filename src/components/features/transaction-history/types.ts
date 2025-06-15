
export type Transaction = {
  id: string;
  amount: number;
  currency: string;
  type: 'deposit' | 'withdraw';
  description?: string | null;
  created_at: string;
  status?: string; // Usado apenas para saques
};
