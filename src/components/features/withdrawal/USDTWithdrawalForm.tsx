
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type USDTWithdrawalFormProps = {
  amount: string;
  onAmountChange: (v: string) => void;
  walletAddress: string;
  onWalletAddressChange: (v: string) => void;
};

const USDTWithdrawalForm: React.FC<USDTWithdrawalFormProps> = ({
  amount,
  onAmountChange,
  walletAddress,
  onWalletAddressChange,
}) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="amount-usdt">Valor (USDT)</Label>
      <Input
        id="amount-usdt"
        type="number"
        placeholder="0.00"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="usdt-wallet">Endereço da Carteira USDT</Label>
      <Input
        id="usdt-wallet"
        type="text"
        placeholder="Insira seu endereço USDT"
        value={walletAddress}
        onChange={(e) => onWalletAddressChange(e.target.value)}
        autoComplete="off"
        spellCheck={false}
      />
    </div>
    <p className="text-xs text-muted-foreground">
      Saque | Mínimo: 5 USDT
    </p>
  </div>
);

export default USDTWithdrawalForm;

