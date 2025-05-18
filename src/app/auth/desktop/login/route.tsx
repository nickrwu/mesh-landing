import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, pathname } = new URL(request.url)
  const email = searchParams.get("email")
  const state = searchParams.get("state")
  const challenge = searchParams.get("code_challenge")
  const redirect = searchParams.get("redirect_uri")

  // If this route is called with an email and we're not already on the password page, 
  // redirect to the password page
  if (email && !pathname.includes("/password")) {
    return NextResponse.redirect(
      new URL(
        `/auth/desktop/password?email=${encodeURIComponent(email)}&state=${state}&code_challenge=${challenge}&redirect_uri=${encodeURIComponent(redirect || '')}`,
        request.url
      )
    )
  }

  // If no email or we're already at the right place, just continue
  return NextResponse.next()
}

export async function POST(request: NextRequest) {
  // Redirect user to the success page
  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = '/auth/desktop/success' // Point to the new success page
  redirectUrl.search = '' // Clear query parameters
  return NextResponse.redirect(redirectUrl)
} 