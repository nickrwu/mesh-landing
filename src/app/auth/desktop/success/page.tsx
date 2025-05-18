"use client"

import { Suspense } from "react"
import { SuccessForm } from "../success-form" // Adjust path as needed

export default function DesktopAuthSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}> 
      <SuccessForm />
    </Suspense>
  )
} 