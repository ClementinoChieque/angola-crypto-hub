
export interface UserBankAccountWithPhone {
  id: string;
  user_id: string;
  created_at: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  currency: string;
  user_phone?: string;
}

export interface UserUsdtWalletWithPhone {
  id: string;
  user_id: string;
  created_at: string;
  wallet_address: string;
  network: string;
  user_phone?: string;
}
