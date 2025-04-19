"use client"

import { Suspense } from "react"
import { PasswordForm } from "./password-form"

export default function PasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PasswordForm />
    </Suspense>
  )
} 