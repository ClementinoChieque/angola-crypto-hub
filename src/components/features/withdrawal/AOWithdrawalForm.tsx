
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type AOWithdrawalFormProps = {
  amount: string;
  onAmountChange: (v: string) => void;
  bankName: string;
  onBankNameChange: (v: string) => void;
  bankAccount: string;
  onBankAccountChange: (v: string) => void;
};

const AOWithdrawalForm: React.FC<AOWithdrawalFormProps> = ({
  amount,
  onAmountChange,
  bankName,
  onBankNameChange,
  bankAccount,
  onBankAccountChange,
}) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="amount-ao">Valor (AKZ)</Label>
      <Input
        id="amount-ao"
        type="number"
        placeholder="0.00"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="bank-name">Nome do Banco</Label>
      <Input
        id="bank-name"
        type="text"
        placeholder="Ex: BAI, BFA, ATL"
        value={bankName}
        onChange={(e) => onBankNameChange(e.target.value)}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="bank-account">Número da Conta</Label>
      <Input
        id="bank-account"
        type="text"
        placeholder="Número da Conta"
        value={bankAccount}
        onChange={(e) => onBankAccountChange(e.target.value)}
      />
    </div>
    <p className="text-xs text-muted-foreground">
      Saque | Mínimo: 5.000 AKZ
    </p>
  </div>
);

export default AOWithdrawalForm;

