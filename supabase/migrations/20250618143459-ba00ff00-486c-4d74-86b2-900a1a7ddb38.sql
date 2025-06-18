
-- Verificar e criar políticas RLS para user_deposits se não existirem

-- Política para usuários criarem seus próprios depósitos
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_deposits' 
        AND policyname = 'Users can create their own deposits'
    ) THEN
        CREATE POLICY "Users can create their own deposits" 
        ON public.user_deposits 
        FOR INSERT 
        TO authenticated
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Política para usuários visualizarem seus próprios depósitos
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_deposits' 
        AND policyname = 'Users can view their own deposits'
    ) THEN
        CREATE POLICY "Users can view their own deposits" 
        ON public.user_deposits 
        FOR SELECT 
        TO authenticated
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Política para admins visualizarem todos os depósitos
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_deposits' 
        AND policyname = 'Admins can view all deposits'
    ) THEN
        CREATE POLICY "Admins can view all deposits" 
        ON public.user_deposits 
        FOR SELECT 
        TO authenticated
        USING (public.has_role(auth.uid(), 'admin'));
    END IF;
END $$;

-- Política para admins atualizarem depósitos
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_deposits' 
        AND policyname = 'Admins can update deposits'
    ) THEN
        CREATE POLICY "Admins can update deposits" 
        ON public.user_deposits 
        FOR UPDATE 
        TO authenticated
        USING (public.has_role(auth.uid(), 'admin'));
    END IF;
END $$;
