import { supabase } from "app/services/auth/supabase"

export const useUserIdAndNickname = async () => {
  const { data: { user } } = await supabase.auth.getUser()

  return [user?.id, user?.email?.split('@')[0]]
}