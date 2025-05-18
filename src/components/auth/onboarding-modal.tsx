"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { User } from "@supabase/supabase-js"

interface OnboardingModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function OnboardingModal({ user, isOpen, onClose, onComplete }: OnboardingModalProps) {
  const { toast } = useToast()
  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || "")
  const [lastName, setLastName] = useState(user?.user_metadata?.last_name || "")
  const [agreedToTerms, setAgreedToTerms] = useState(true)
  const [agreedToMarketing, setAgreedToMarketing] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) {
      setFirstName(user.user_metadata?.first_name || "")
      setLastName(user.user_metadata?.last_name || "")
      // We don\'t pre-fill checkboxes from user_metadata here
      // because these fields are specific to the profiles table
      // and this modal is for *setting* them for the first time primarily.
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required.")
      return
    }

    if (!agreedToTerms) {
      setError("You must agree to the Terms and Conditions and Privacy Policy.")
      return
    }

    if (!user) {
      setError("User not found. Please try again.")
      return
    }

    setLoading(true)
    try {
      // First, update user_metadata if names were changed or not set
      // This is useful if the signup didn\'t capture them for some reason
      const updatedMetadata = {
        ...user.user_metadata,
        first_name: firstName,
        last_name: lastName,
      }

      const { error: updateUserError } = await supabase.auth.updateUser({
        data: updatedMetadata
      })

      if (updateUserError) {
        throw updateUserError
      }
      
      // Then, update the public.profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          agreed_to_terms: agreedToTerms,
          agreed_to_marketing: agreedToMarketing,
          // We add a flag to indicate onboarding is complete for this modal's purpose
          onboarding_complete: true 
        })
        .eq("id", user.id)

      if (profileError) {
        // Attempt to insert if update failed (e.g., profile row doesn\'t exist yet)
        // This can happen if the handle_new_user trigger hasn\'t run or failed.
        if (profileError.code === 'PGRST116') { // PGRST116: "Value in column 'id' not found" (approximated)
            const { error: insertProfileError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              first_name: firstName,
              last_name: lastName,
              agreed_to_terms: agreedToTerms,
              agreed_to_marketing: agreedToMarketing,
              onboarding_complete: true
            });
            if (insertProfileError) throw insertProfileError;
        } else {
            throw profileError
        }
      }

      toast({
        title: "Profile updated",
        description: "Your onboarding information has been saved.",
      })
      onComplete() // Call the onComplete callback passed from parent
      onClose() // Close the modal
    } catch (error: unknown) {
      console.error("Error updating profile:", error)
      let errorMessage = "Failed to update profile. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please provide a few more details to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="pb-4">
          <div className="grid gap-4 pb-4">
            <div className="grid gap-4">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-4">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="items-top flex space-x-3 mt-4">
                <Checkbox 
                    id="terms" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="mt-1"
                />
                <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Terms and Conditions</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Privacy Policy</a>.
                </label>
            </div>
            <div className="items-top flex space-x-3 my-2">
                <Checkbox 
                    id="marketing"
                    checked={agreedToMarketing}
                    onCheckedChange={(checked) => setAgreedToMarketing(checked as boolean)}
                    className="mt-1"
                />
                <label
                    htmlFor="marketing"
                    className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                I agree to receive marketing materials.
                </label>
            </div>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !agreedToTerms} className="w-full">
              {loading ? "Saving..." : "Save and Continue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 