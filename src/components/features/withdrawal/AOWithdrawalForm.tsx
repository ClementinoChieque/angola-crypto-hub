
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type AOWithdrawalFormProps = {
  amount: string;
  onAmountChange: (v: string) => void;
};

const AOWithdrawalForm: React.FC<AOWithdrawalFormProps> = ({
  amount,
  onAmountChange,
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
    <p className="text-xs text-muted-foreground">
      Saque | Mínimo: 5.000 AKZ
    </p>
  </div>
);

export default AOWithdrawalForm;
