"use client"

import { Suspense } from "react"
import { LoginForm } from "./login-form"

export default function DesktopAuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
} 