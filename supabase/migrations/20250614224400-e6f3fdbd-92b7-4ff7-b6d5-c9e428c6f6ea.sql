
-- Remover índice não utilizado na tabela payment_proofs
DROP INDEX IF EXISTS idx_payment_proofs_user_id;
