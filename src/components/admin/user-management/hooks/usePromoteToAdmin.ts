
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook para promover um usuário a admin pelo número de telefone.
 * Uso: const { promoteToAdmin, loading } = usePromoteToAdmin();
 *       await promoteToAdmin("+244947896752");
 */
export function usePromoteToAdmin() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const promoteToAdmin = async (phone: string) => {
    setLoading(true);
    try {
      // Busca user pelo telefone
      const { data: users, error: userErr } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", phone)
        .limit(1);

      let userId: string | undefined;
      if (users && users.length > 0) {
        userId = users[0].id;
      } else {
        // Se não achar em profiles, tenta no auth.users:
        const { data: authUserData, error: authErr } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
        if (authErr) throw authErr;
        const found = authUserData.users.find((u: any) => u.phone === phone);
        if (!found) throw new Error("Usuário não encontrado para o telefone informado!");
        userId = found.id;
      }

      if (!userId) throw new Error("Não foi possível encontrar o user_id.");

      // Insere papel admin (se não existir ainda)
      const { error: roleErr } = await supabase
        .from("user_roles")
        .upsert([{ user_id: userId, role: "admin" }], { onConflict: "user_id,role" });

      if (roleErr) throw roleErr;

      toast({
        title: "Usuário promovido",
        description: `Usuário com telefone ${phone} agora é admin.`,
      });
      return true;
    } catch (err: any) {
      toast({
        title: "Erro ao promover admin",
        description: err?.message || String(err),
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { promoteToAdmin, loading };
}
