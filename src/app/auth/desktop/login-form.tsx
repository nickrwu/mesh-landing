"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
// import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/auth/auth-layout"
import { EnvelopeClosedIcon } from "@radix-ui/react-icons"
import { Github } from "lucide-react"

export function LoginForm() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const searchParams = useSearchParams()
    const state = searchParams.get('state')
    const challenge = searchParams.get('code_challenge')
    const redirect = searchParams.get('redirect')        // mesh://auth/callback
        
    if (!state || !challenge || !redirect) {
        router.push('/login')
        return
    }

    const handleSignIn = async (provider: string) => {
        setLoading(true)
        const u = new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/authorize`)

        u.searchParams.set('response_type',       'code')
        u.searchParams.set('client_id',           process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF!)
        u.searchParams.set('redirect_uri',        redirect)
        u.searchParams.set('state',               state)
        u.searchParams.set('code_challenge',      challenge)
        u.searchParams.set('code_challenge_method','S256')
        u.searchParams.set('provider',            provider)

        window.location.href = u.toString()

        setLoading(false)
    }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your account"
    >
      <div className="grid gap-6">
        <form onSubmit={() => handleSignIn("email")}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              <EnvelopeClosedIcon className="mr-2 h-4 w-4" />
              Continue
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              OR
            </span>
          </div>
        </div>
        <div className="grid gap-4">
          <Button
            variant="outline"
            type="button"
            disabled={loading}
            onClick={() => handleSignIn("google")}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
          <Button
            variant="outline"
            type="button"
            disabled={loading}
            onClick={() => handleSignIn("github")}
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>
        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
} 