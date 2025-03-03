import { createClient } from "@supabase/supabase-js"
import { AppState } from "react-native"
import clientAuthStorageInstance from "app/utils/storage/SupabaseClientStorage"
import Constants from 'expo-constants'

export const supabase = createClient(
  Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL,
  Constants.expoConfig?.extra?.SUPABASE_ANON_KEY,
  {
    auth: {
      storage: clientAuthStorageInstance,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)

export { type Session, type AuthError } from "@supabase/supabase-js"

/**
 * Tells Supabase to autorefresh the session while the application
 * is in the foreground. (Docs: https://supabase.com/docs/reference/javascript/auth-startautorefresh)
 */
AppState.addEventListener("change", (nextAppState) => {
  if (nextAppState === "active") {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})