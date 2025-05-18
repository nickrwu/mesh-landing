"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { User } from "@supabase/supabase-js"
import Image from "next/image"
import { OnboardingModal } from "@/components/auth/onboarding-modal"
import { Skeleton } from "@/components/ui/skeleton"

// Define a type for profile data
interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  onboarding_complete: boolean | null;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const waitlistLink = "https://form.typeform.com/to/Dtj9Lc6p"

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        if (authError || !authUser) {
          router.push("/login")
          return
        }
        setUser(authUser)

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, onboarding_complete")
          .eq("id", authUser.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means no rows found, which is okay if profile not created yet
          console.error("Error fetching profile:", profileError)
          toast({
            title: "Error",
            description: "Could not load your profile data.",
            variant: "destructive",
          })
        } else {
          setProfile(profileData as Profile) // Cast because single() can return null
          // Determine if onboarding modal should be shown
          if (!profileData || !profileData.onboarding_complete) {
            setIsOnboardingModalOpen(true)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        })
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, toast])

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
  
  const handleOnboardingComplete = async () => {
    setIsOnboardingModalOpen(false)
    // Optionally, re-fetch profile to ensure UI consistency, or trust the modal's update
    setLoading(true)
    try {
        if (user) {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("id, first_name, last_name, onboarding_complete")
              .eq("id", user.id)
              .single()
            if (profileError && profileError.code !== 'PGRST116') throw profileError;
            setProfile(profileData as Profile)
            if (profileData?.first_name) { // Update user metadata for display if changed
              setUser(prevUser => prevUser ? ({...prevUser, user_metadata: {...prevUser.user_metadata, first_name: profileData.first_name}}) : null )
            }
        }
    } catch (error) {
        console.error("Error re-fetching profile after onboarding:", error)
        toast({ title: "Update", description: "Profile updated.", variant: "default"})
    } finally {
        setLoading(false)
    }
  }


  if (loading && !user) { // Show detailed skeleton only if user data is not yet available (initial load)
    return (
      <div className="flex min-h-screen flex-col">
        {/* Skeleton Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </header>
        {/* Skeleton Main Content */}
        <main className="flex-1">
          <div className="container mx-auto py-8">
            <div className="mb-8">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="border-2 border-[#7C45F5]/10 bg-gradient-to-br from-background to-[#7C45F5]/5">
                  <CardHeader>
                    <Skeleton className="h-6 w-1/2 mb-1" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }
  
  if (loading && user) { // Simpler loader if user is known but profile is still loading for modal check
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-[#7C45F5]" />
      </div>
    )
  }


  if (!user) {
    // This case should ideally be handled by the redirect in useEffect,
    // but as a fallback:
    return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Redirecting to login...</p>
        </div>
    );
  }
  
  // Display OnboardingModal if conditions are met
  if (user && (!profile || !profile.onboarding_complete)) {
      // If loading is finished, but modal should be open, ensure it is
      if (!isOnboardingModalOpen && !loading) setIsOnboardingModalOpen(true);
  }


  return (
    <div className="flex min-h-screen flex-col">
      {user && (
         <OnboardingModal
            user={user}
            isOpen={isOnboardingModalOpen}
            onClose={() => setIsOnboardingModalOpen(false)}
            onComplete={handleOnboardingComplete}
          />
      )}
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
            <Button variant="ghost" onClick={handleSignOut}>
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
            <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.first_name || user.email}</h1>
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
                <Button className="mt-8 w-full">
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
                  <p className="font-medium">Email: {user.email}</p>
                  <p className="text-sm text-muted-foreground">Last signed in: {new Date(user.last_sign_in_at || '').toLocaleDateString()}</p>
                  <Link href="/account">
                     <Button variant="link" className="p-0 mt-2">Manage Account</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-[#7C45F5]/10 bg-gradient-to-br from-background to-[#7C45F5]/5">
              <CardHeader>
                <CardTitle>Join Waitlist</CardTitle>
                <CardDescription>Get early access to new features</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Be the first to know when we launch new tools and updates.</p>
                <Button className="w-full" asChild>
                  <a href={waitlistLink} target="_blank" rel="noopener noreferrer">
                    Join Now
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
} 