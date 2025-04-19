"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StarIcon, UserIcon } from "lucide-react"
import Image from "next/image"
import { HeroBackground } from "@/components/hero-background"
import { Session } from "@supabase/supabase-js"

export default function Home() {
  const router = useRouter()
  const waitlistLink = "https://form.typeform.com/to/Dtj9Lc6p"
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session) 
      } catch (error) {
        console.error("Error fetching session:", error)
      }
    }

    getSession()
  }, [router])

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
            {session ? (
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <UserIcon className="w-4 h-4" />
                </Link>
              </Button>
              ) : (
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            )}
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
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-[80vh]">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7C45F5]/20 to-[#D6C3FF]/20 blur-3xl" />
            <HeroBackground />
          </div>
          <div className="container mx-auto flex relative space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
            <div className="flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto">
              <div className="rounded-full bg-[#7C45F5]/10 px-4 py-1.5 text-sm font-medium text-[#7C45F5]">
                Now in Closed Alpha
              </div>
              <h1 className="font-heading text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-[#7C45F5] to-[#D6C3FF] bg-clip-text text-transparent">
                The Future of Game Development
              </h1>
              <p className="max-w-[42rem] leading-normal text-white sm:text-xl sm:leading-8">
                Experience the next generation of game development with AI-powered tools.
              </p>
              <div className="space-x-4">
                <Button 
                  size="lg" 
                  className="hover:opacity-90"
                  asChild
                >
                  <a href={waitlistLink} rel="noopener noreferrer" target="_blank">Join Waitlist</a>
                </Button>
                {/* <Button size="lg" variant="outline" asChild>
                  <Link href="/waitlist">Join Waitlist</Link>
                </Button> */}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto space-y-6 py-8 md:py-12 lg:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground">Everything you need to build amazing games</p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <Card className="border-2 border-[#7C45F5]/10 bg-gradient-to-br from-background to-[#7C45F5]/5">
              <CardHeader>
                <CardTitle>AI-Powered Tools</CardTitle>
                <CardDescription>Create content faster than ever</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Leverage cutting-edge AI to automate asset creation and optimize workflows</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#7C45F5]/10 bg-gradient-to-br from-background to-[#7C45F5]/5">
              <CardHeader>
                <CardTitle>Real-time Collaboration</CardTitle>
                <CardDescription>Work together seamlessly</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Build games with your team in real-time, with instant syncing and version control</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#7C45F5]/10 bg-gradient-to-br from-background to-[#7C45F5]/5">
              <CardHeader>
                <CardTitle>Advanced Physics</CardTitle>
                <CardDescription>Realistic game mechanics</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Industry-leading physics engine for realistic and responsive gameplay</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-gradient-to-br from-[#7C45F5]/5 to-[#D6C3FF]/5 py-16">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Loved by Game Developers</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-[64rem] mx-auto">
              {[
                {
                  name: "Sarah Chen",
                  role: "Lead Developer",
                  content: "Mesh has completely transformed how we develop games. The AI tools are incredible.",
                  rating: 5
                },
                {
                  name: "Alex Rodriguez",
                  role: "Indie Developer",
                  content: "The best game engine I've ever used. The collaboration features are game-changing.",
                  rating: 5
                },
                {
                  name: "James Wilson",
                  role: "Studio Director",
                  content: "We switched our entire studio to Mesh and haven't looked back. Simply amazing.",
                  rating: 5
                }
              ].map((testimonial, i) => (
                <Card key={i} className="border-2 border-[#7C45F5]/10">
                  <CardHeader>
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} className="w-4 h-4 fill-[#7C45F5] text-[#7C45F5]" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{testimonial.content}</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto py-16">
          <div className="max-w-[64rem] mx-auto">
            <div className="rounded-2xl bg-gradient-to-r from-[#7C45F5] to-[#D6C3FF] p-[2px]">
              <div className="rounded-2xl bg-background p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Start Building?</h2>
                <p className="text-muted-foreground mb-6">Join thousands of developers creating the next generation of games</p>
                <Button size="lg" className="hover:opacity-90" asChild>
                  <a href={waitlistLink} rel="noopener noreferrer" target="_blank">Join Waitlist</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
