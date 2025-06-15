
export type DepositType = 'USDT' | 'AKZ';

export interface UsdtWallet {
  id: string;
  wallet_address: string;
  network: string;
}

export interface BankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
}
