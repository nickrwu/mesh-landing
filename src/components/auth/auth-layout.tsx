import Image from "next/image"
import Link from "next/link"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7C45F5] to-[#D6C3FF]" />
          <Link href="/" className="relative z-20 flex items-center text-3xl font-medium">
            <Image
              src="/assets/icon_outlined.svg"
              alt="Mesh Logo"
              width={32}
              height={32}
              className="mr-2"
            />
            <span className="font-bold">MESH</span>
          </Link>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &quot;Mesh has transformed how we develop games. The AI tools are incredible.&quot;
            </p>
            <footer className="text-sm">Sarah Chen, Lead Developer</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Link href="/" className="flex justify-center mb-4">
              <Image
                src="/assets/icon_outlined.svg"
                alt="Mesh Logo"
                width={48}
                height={48}
              />
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {children}
          <p className="px-8 text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
} 