
-- Ativar Row-Level Security para a tabela de transações
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Permitir que usuários leiam apenas suas próprias transações
CREATE POLICY "Usuarios podem ver suas transacoes"
  ON transactions
  FOR SELECT
  USING (user_id = auth.uid());

-- Ativar Row-Level Security para a tabela de solicitações de saque
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Permitir que usuários leiam apenas suas próprias solicitações de saque
CREATE POLICY "Usuarios podem ver seus saques"
  ON withdrawal_requests
  FOR SELECT
  USING (user_id = auth.uid());
