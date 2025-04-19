"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the code from the URL parameters
        const code = searchParams.get('code')
        
        if (!code) {
          throw new Error('No code found in URL')
        }

        // Exchange the code for a session
        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (error) throw error

        if (session) {
          // Extract the access token and refresh token
          const { access_token, refresh_token } = session
          
          // Check if this is a desktop app callback
          const isDesktopApp = searchParams.get('desktop') === 'true'
          
          if (isDesktopApp) {
            // Get the deep link scheme from the URL parameters
            const deepLinkScheme = searchParams.get('deep_link_scheme') || 'mesh'
            
            // Construct the deep link URL with the tokens
            const deepLinkUrl = `${deepLinkScheme}://auth/callback?access_token=${access_token}&refresh_token=${refresh_token}`
            
            // Redirect to the deep link
            window.location.href = deepLinkUrl
          } else {
            // Web-based flow - redirect to dashboard
            router.push("/dashboard")
          }
        } else {
          // If no session, redirect to login
          router.push("/login")
        }
      } catch (error) {
        console.error("Error handling auth callback:", error)
        
        // Check if this is a desktop app callback
        const isDesktopApp = searchParams.get('desktop') === 'true'
        
        if (isDesktopApp) {
          // Get the deep link scheme from the URL parameters
          const deepLinkScheme = searchParams.get('deep_link_scheme') || 'mesh'
          
          // Construct error deep link
          const errorDeepLinkUrl = `${deepLinkScheme}://auth/error?message=${encodeURIComponent('Authentication failed')}`
          
          // Redirect to error deep link
          window.location.href = errorDeepLinkUrl
        } else {
          // Web-based flow - redirect to login with error
          router.push("/login?error=auth_failed")
        }
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return null
}

export default function AuthCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black to-purple-900/20">
      <Suspense fallback={
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-purple-500" />
      }>
        <AuthCallbackContent />
      </Suspense>
    </div>
  )
} 