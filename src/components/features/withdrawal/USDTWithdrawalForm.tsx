
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type USDTWithdrawalFormProps = {
  amount: string;
  onAmountChange: (v: string) => void;
};

const USDTWithdrawalForm: React.FC<USDTWithdrawalFormProps> = ({
  amount,
  onAmountChange,
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
    <p className="text-xs text-muted-foreground">
      Saque | Mínimo: 5 USDT
    </p>
  </div>
);

export default USDTWithdrawalForm;
