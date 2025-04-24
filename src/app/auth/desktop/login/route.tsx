import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")
  const state = searchParams.get("state")
  const challenge = searchParams.get("code_challenge")
  const redirect = searchParams.get("redirect_uri")

  // If email is provided, redirect to password form
  if (email) {
    return NextResponse.redirect(
      new URL(
        `/auth/desktop/password?email=${encodeURIComponent(email)}&state=${state}&code_challenge=${challenge}&redirect_uri=${encodeURIComponent(redirect || '')}`,
        request.url
      )
    )
  }

  // Otherwise, continue to login form
  return NextResponse.next()
} 