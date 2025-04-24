"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/auth/auth-layout"
import { ChevronLeftIcon } from "@radix-ui/react-icons"

export default function ForgotPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const state = searchParams.get('state')
  const challenge = searchParams.get('code_challenge')
  const redirect = searchParams.get('redirect_uri')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!state || !challenge || !redirect) {
      router.push("/auth/desktop/login");
    }
  }, [router, state, challenge, redirect]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/recover`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify({
          email,
          redirect_to: `${window.location.origin}/auth/desktop/reset-password`,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to send reset email')
      }
      
      setSuccess(true)
    } catch (error) {
      console.error("Error sending reset email:", error)
      setError("Failed to send reset email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      description={success ? "Check your email for a reset link" : "We'll send you a link to reset your password"}
    >
      <div className="grid gap-6">
        {!success ? (
          <form onSubmit={handleResetPassword}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  readOnly
                  disabled
                />
              </div>
              {error && (
                <div className="text-sm text-red-500">
                  {error}
                </div>
              )}
              <Button type="submit" disabled={loading}>
                Send reset link
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <p className="mb-4">
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Please check your email and follow the instructions to reset your password.
            </p>
          </div>
        )}
        <Link 
          className="text-center text-sm flex flex-row justify-center items-center gap-1 hover:underline"
          href={`/auth/desktop/login?email=${encodeURIComponent(email)}&state=${state}&code_challenge=${challenge}&redirect_uri=${encodeURIComponent(redirect || '')}`}
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  )
} 