"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/auth/auth-layout"
import { EyeOpenIcon, EyeClosedIcon, ChevronLeftIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons"

export function PasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/dashboard")
    } catch (error) {
      console.error("Error signing in:", error)
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }
  
  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email
      })
      if (error) throw error
      router.push("/dashboard")
    } catch (error) {
      console.error("Error sending magic link:", error)
      setError("Failed to send magic link. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      router.push("/verify-email")
    } catch (error) {
      console.error("Error sending reset email:", error)
      setError("Failed to send reset email. Please try again.")
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
              <Label htmlFor="password">Email</Label>
              <Label className="text-muted-foreground">{email}</Label>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button
                  variant="link"
                  onClick={handleForgotPassword}
                  className="text-xs text-muted-foreground hover:underline p-0 m-0"
                  disabled={loading}
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
              onClick={handleMagicLinkSignIn}
              className="text-primary"
            >
            <EnvelopeClosedIcon className="mr-2 h-4 w-4" />
            Sign in with a magic link
          </Button>
        </div>
        <Link 
          className="text-center text-sm flex flex-row justify-center items-center gap-1 hover:underline"
          href={`/login?email=${encodeURIComponent(email)}`}
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  )
} 