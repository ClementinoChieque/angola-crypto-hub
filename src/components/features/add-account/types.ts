
export interface UserBankAccount {
  id: string;
  user_id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  currency: string;
  created_at: string;
}

export interface UserUsdtWallet {
  id: string;
  user_id: string;
  wallet_address: string;
  network: string;
  created_at: string;
}

export interface BankAccountFormData {
  bank_name: string;
  account_number: string;
  account_holder: string;
}

export interface UsdtWalletFormData {
  wallet_address: string;
  network: string;
}
