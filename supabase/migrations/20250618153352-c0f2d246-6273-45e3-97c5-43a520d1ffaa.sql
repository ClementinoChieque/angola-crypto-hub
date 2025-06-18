
-- Criar tabela para registrar ganhos da quantificação
CREATE TABLE public.quantification_earnings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'AKZ',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  description TEXT DEFAULT 'Ganho de quantificação'
);

-- Adicionar RLS para que usuários vejam apenas seus próprios ganhos
ALTER TABLE public.quantification_earnings ENABLE ROW LEVEL SECURITY;

-- Política para visualizar ganhos próprios
CREATE POLICY "Users can view their own earnings" 
  ON public.quantification_earnings 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para inserir ganhos próprios
CREATE POLICY "Users can create their own earnings" 
  ON public.quantification_earnings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
