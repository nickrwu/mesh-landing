"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/auth/auth-layout"
import { EyeOpenIcon, EyeClosedIcon, ChevronLeftIcon } from "@radix-ui/react-icons"

export function PasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const state = searchParams.get('state')
  const challenge = searchParams.get('code_challenge')
  const redirect = searchParams.get('redirect_uri')
  const clientId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF!
  const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!state || !challenge || !redirect) {
      router.push("/auth/desktop/login");
    }
  }, [router, state, challenge, redirect]);

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
      const u = new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token`)
      
      u.searchParams.set('grant_type', 'password')
      u.searchParams.set('client_id', clientId)
      u.searchParams.set('apikey', apikey)
      u.searchParams.set('redirect_uri', redirect!)
      u.searchParams.set('state', state!)
      u.searchParams.set('code_challenge', challenge!)
      u.searchParams.set('code_challenge_method', 'S256')
      
      const response = await fetch(u.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Invalid email or password')
      }
      
      const data = await response.json()
      window.location.href = `${redirect}?code=${data.code}&state=${state}`
    } catch (error) {
      console.error("Error signing in:", error)
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Enter your password"
      description={`Sign in to your account`}
    >
      <div className="grid gap-6">
        <form onSubmit={handlePasswordSignIn}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Label className="text-muted-foreground">{email}</Label>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button
                  variant="link"
                  onClick={() => router.push(`/auth/desktop/forgot-password?email=${encodeURIComponent(email)}&state=${state}&code_challenge=${challenge}&redirect_uri=${encodeURIComponent(redirect || '')}`)}
                  className="text-xs text-muted-foreground hover:underline p-0 m-0"
                  disabled={loading}
                  asChild
                >
                  Forgot your password?
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOpenIcon className="h-4 w-4" />
                  ) : (
                    <EyeClosedIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {error && (
              <div className="text-sm text-red-500">
                {error}
              </div>
            )}
            <Button type="submit" disabled={loading}>
              Sign in
            </Button>
          </div>
        </form>
        <Link 
          className="text-center text-sm flex flex-row justify-center items-center gap-1 hover:underline"
          href={{
            pathname: "/auth/desktop",
            query: {
              email: email,
              state: state,
              code_challenge: challenge,
              redirect_uri: redirect,
              client_id: clientId,
              apikey: apikey
            }
          }}
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  )
} 