
-- Primeiro, vamos encontrar o user_id do usuário com telefone 244930024983
-- Depois inserir o role de admin para esse usuário

-- Buscar o user_id pelo telefone (pode estar com ou sem +)
DO $$
DECLARE
    target_user_id uuid;
BEGIN
    -- Busca na tabela auth.users pelo telefone
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE phone IN ('244930024983', '+244930024983')
    LIMIT 1;
    
    -- Se não encontrou na auth.users, busca na profiles pelo username
    IF target_user_id IS NULL THEN
        SELECT id INTO target_user_id 
        FROM public.profiles 
        WHERE username IN ('244930024983', '+244930024983')
        LIMIT 1;
    END IF;
    
    -- Se encontrou o usuário, adiciona o role de admin
    IF target_user_id IS NOT NULL THEN
        -- Insere o role de admin (usando upsert para evitar duplicatas)
        INSERT INTO public.user_roles (user_id, role) 
        VALUES (target_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Usuário % promovido a admin com sucesso!', target_user_id;
    ELSE
        RAISE NOTICE 'Usuário com telefone 244930024983 não encontrado!';
    END IF;
END $$;
