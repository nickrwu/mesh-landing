"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"  
import { supabase } from "@/lib/supabase/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { User } from "@supabase/supabase-js"
import Image from "next/image"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const waitlistLink = "https://form.typeform.com/to/Dtj9Lc6p"

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/login")
          return
        }
        setUser(user)
      } catch (error) {
        console.error("Error fetching user:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [router])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-[#7C45F5]" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/assets/icon_outlined.svg"
                  alt="Mesh Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-3xl text-white">MESH</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
            <Button 
              className="hover:opacity-90"
              asChild
            >
              <a href={waitlistLink} rel="noopener noreferrer" target="_blank">Join Waitlist</a>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.user_metadata.first_name}</h1>
            <p className="text-muted-foreground">Manage your projects and settings</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-2 border-[#7C45F5]/10 bg-gradient-to-br from-background to-[#7C45F5]/5">
              <CardHeader>
                <CardTitle>Your Projects</CardTitle>
                <CardDescription>View and manage your game projects</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No projects yet. Start by creating a new one!</p>
                <Button className="mt-4 bg-gradient-to-r from-[#7C45F5] to-[#D6C3FF] hover:opacity-90">
                  Create Project
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#7C45F5]/10 bg-gradient-to-br from-background to-[#7C45F5]/5">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">Email: {user?.email}</p>
                  <p className="text-sm text-muted-foreground">Last signed in: {new Date(user?.last_sign_in_at || '').toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#7C45F5]/10 bg-gradient-to-br from-background to-[#7C45F5]/5">
              <CardHeader>
                <CardTitle>Resources</CardTitle>
                <CardDescription>Helpful links and documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full">Documentation</Button>
                  <Button variant="outline" className="w-full">Tutorials</Button>
                  <Button variant="outline" className="w-full">Community</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
} 