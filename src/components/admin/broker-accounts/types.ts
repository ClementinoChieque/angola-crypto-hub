
export interface BankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  is_active: boolean;
  created_at: string;
}

export interface UsdtWallet {
  id: string;
  wallet_address: string;
  network: string;
  is_active: boolean;
  created_at: string;
}

export interface BankAccountForm {
  bank_name: string;
  account_number: string;
  account_holder: string;
  is_active: boolean;
}

export interface UsdtWalletForm {
  wallet_address: string;
  network: string;
  is_active: boolean;
}
