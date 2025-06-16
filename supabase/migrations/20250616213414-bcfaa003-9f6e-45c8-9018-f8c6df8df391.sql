
-- Vamos encontrar o user_id do usuário atual e adicionar o role de admin
-- O user_id que aparece nos logs é: 3c2b766c-304e-4b59-86f7-270fbb101879

INSERT INTO public.user_roles (user_id, role) 
VALUES ('3c2b766c-304e-4b59-86f7-270fbb101879', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Vamos também verificar se o usuário foi adicionado corretamente
-- SELECT * FROM public.user_roles WHERE user_id = '3c2b766c-304e-4b59-86f7-270fbb101879';
