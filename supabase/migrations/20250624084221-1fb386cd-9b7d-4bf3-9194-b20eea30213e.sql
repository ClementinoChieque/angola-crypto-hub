
-- Adicionar o usuário 244947896752 como admin
DO $$
DECLARE
    target_user_id uuid;
BEGIN
    -- Busca o user_id pelo telefone (pode estar com ou sem +)
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE phone IN ('244947896752', '+244947896752')
    LIMIT 1;
    
    -- Se não encontrou na auth.users, busca na profiles pelo username
    IF target_user_id IS NULL THEN
        SELECT id INTO target_user_id 
        FROM public.profiles 
        WHERE username IN ('244947896752', '+244947896752')
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
        RAISE NOTICE 'Usuário com telefone 244947896752 não encontrado!';
    END IF;
END $$;
