
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface WithdrawalRequest {
  id: string;
  amount: number;
  currency: string;
  withdrawal_method: string;
  wallet_address?: string | null;
  bank_name?: string | null;
  bank_account?: string | null;
  status: string;
  admin_notes?: string | null;
  created_at: string;
  user_id: string;
}

interface Props {
  request: WithdrawalRequest;
  onUpdateStatus: (id: string, status: string, notes?: string) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="secondary">
          <Clock size={14} className="mr-1" />Pendente
        </Badge>
      );
    case "approved":
      return (
        <Badge variant="default">
          <CheckCircle size={14} className="mr-1" />Aprovado
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="destructive">
          <XCircle size={14} className="mr-1" />Rejeitado
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="outline">
          <CheckCircle size={14} className="mr-1" />Completo
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const WithdrawalRequestCard: React.FC<Props> = ({ request, onUpdateStatus }) => {
  const [showNotes, setShowNotes] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const { toast } = useToast();

  // Format date and hour as "dd/MM/yyyy, HH:mm:ss"
  const formattedDateTime = new Date(request.created_at).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  // Show first 8 characters of user_id (as ID: xxxxxxxx...)
  const userIdShort = request.user_id ? `${request.user_id.slice(0, 8)}...` : "";

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-medium text-lg">
            {Number(request.amount).toLocaleString()} {request.currency}
          </div>
          <div className="text-sm text-gray-500">
            {request.withdrawal_method} • {formattedDateTime}
          </div>
          <div className="text-xs text-gray-400">
            ID: {userIdShort}
          </div>
          {request.wallet_address && (
            <div className="text-xs text-gray-400 mt-1">
              Carteira: {request.wallet_address}
            </div>
          )}
          {request.bank_name && (
            <div className="text-xs text-gray-400 mt-1">
              Banco: {request.bank_name} - {request.bank_account}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">{getStatusBadge(request.status)}</div>
      </div>
      {request.admin_notes && (
        <div className="bg-gray-50 p-2 rounded text-sm mb-3">
          <strong>Notas do Admin:</strong> {request.admin_notes}
        </div>
      )}

      {request.status === "pending" && (
        <div className="flex gap-2 mt-3">
          <Button size="sm" onClick={() => setShowNotes((prev) => !prev)}>
            Gerenciar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateStatus(request.id, "approved")}
          >
            <CheckCircle size={16} className="mr-1" />
            Aprovar
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onUpdateStatus(request.id, "rejected")}
          >
            <XCircle size={16} className="mr-1" />
            Rejeitar
          </Button>
        </div>
      )}

      {request.status === "approved" && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUpdateStatus(request.id, "completed")}
          className="mt-3"
        >
          Marcar como Completo
        </Button>
      )}

      {showNotes && (
        <div className="mt-4 p-4 border-t">
          <Textarea
            placeholder="Adicionar notas administrativas..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            className="mb-3"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                onUpdateStatus(request.id, "approved", adminNotes);
                setShowNotes(false);
                setAdminNotes('');
              }}
            >
              Aprovar com Notas
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                onUpdateStatus(request.id, "rejected", adminNotes);
                setShowNotes(false);
                setAdminNotes('');
              }}
            >
              Rejeitar com Notas
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowNotes(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalRequestCard;
