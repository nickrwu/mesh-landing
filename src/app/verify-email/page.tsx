"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { AuthLayout } from "@/components/auth/auth-layout"
import { EyeOpenIcon, EyeClosedIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const firstName = searchParams.get("firstName") || ""
  const lastName = searchParams.get("lastName") || ""
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Validate required fields on mount
  useEffect(() => {
    if (!email || !firstName || !lastName) {
      router.push("/register")
    }
  }, [email, firstName, lastName, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      })
      if (signUpError) throw signUpError

      // Create user profile in profiles table
    //   const { error: profileError } = await supabase
    //     .from('profiles')
    //     .insert([
    //       {
    //         id: data.user?.id,
    //         first_name: firstName,
    //         last_name: lastName,
    //         email: email,
    //       }
    //     ])
    //   if (profileError) throw profileError

      setIsSubmitted(true)
    } catch (error) {
      console.error("Error signing up:", error)
      setError("Failed to create account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <AuthLayout
        title=""
        description=""
      >
        <Card className="p-6">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <EnvelopeClosedIcon className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Check your email</h2>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                If you don&apos;t see the email in your inbox, please check your spam folder.
              </p>
              <p className="text-sm text-muted-foreground">
                Still can&apos;t find the email?{" "}
                <Button variant="link" className="p-0 text-primary" asChild>
                  <Link href="/login">Try signing in again</Link>
                </Button>
              </p>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login">Back to Login</Link>
            </Button>
          </div>
        </Card>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Create your password"
      description={`Complete your account setup, ${firstName}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Label className="text-muted-foreground">{email}</Label>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
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
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}
          <Button type="submit" disabled={loading}>
            Create Account
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="mt-2"
            onClick={() => router.push("/register")}
          >
            Back to Register
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
} 