"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) throw error

        if (session) {
          router.push("/")
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Error handling auth callback:", error)
        router.push("/login")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black to-purple-900/20">
      <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-purple-500" />
    </div>
  )
} 