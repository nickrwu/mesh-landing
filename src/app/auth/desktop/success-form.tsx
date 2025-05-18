"use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
import { AuthLayout } from "@/components/auth/auth-layout"
import { CheckCircledIcon } from "@radix-ui/react-icons"

export function SuccessForm() {
//   const router = useRouter()
//   const [countdown, setCountdown] = useState(3)

//   useEffect(() => {
//     if (countdown <= 0) {
//       router.replace("/") // Redirect to home page or dashboard
//       return
//     }

//     const timer = setTimeout(() => {
//       setCountdown(countdown - 1)
//     }, 1000)

//     return () => clearTimeout(timer) // Cleanup timer on unmount
//   }, [countdown, router])

  return (
    <AuthLayout
      title="Authentication Successful"
      description="You have successfully logged in."
    >
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <CheckCircledIcon className="h-16 w-16 text-green-500" />
        <h1 className="text-2xl font-bold">Authentication Successful</h1>
        <p className="text-muted-foreground">
          {/* You will be redirected to the application in {countdown} seconds... */}
          You may now close this window
        </p>
      </div>
    </AuthLayout>
  )
} 