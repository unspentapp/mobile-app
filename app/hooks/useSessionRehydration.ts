import { useState, useEffect } from 'react'
import { supabase } from 'app/services/auth/supabase'

export function useSessionRehydration() {
  const [isRehydrated, setIsRehydrated] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'INITIAL_SESSION') {
        setIsRehydrated(true)
      }
    })

    // Fallback timer in case the event never fires
    const timeoutId = setTimeout(() => {
      setIsRehydrated(true)
    }, 3000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeoutId)
    }
  }, [])

  return { isRehydrated }
}