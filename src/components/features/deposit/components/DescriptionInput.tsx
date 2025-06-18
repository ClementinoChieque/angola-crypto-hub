
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface DescriptionInputProps {
  description: string;
  onDescriptionChange: (description: string) => void;
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({
  description,
  onDescriptionChange
}) => {
  return (
    <div>
      <Label htmlFor="description">Descrição (opcional)</Label>
      <Textarea
        id="description"
        placeholder="Adicione uma descrição para este depósito..."
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        rows={3}
      />
    </div>
  );
};

export default DescriptionInput;
