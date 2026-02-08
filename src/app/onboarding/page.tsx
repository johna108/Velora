import { OnboardingForm } from "./onboarding-form"
import { getAuthUser, getUserOrganization } from "@/lib/db"
import { redirect } from "next/navigation"

export default async function OnboardingPage() {
    const user = await getAuthUser()
    if (!user) {
        redirect("/login")
    }

    const org = await getUserOrganization(user.id)
    if (org) {
        // Already onboarded
        redirect("/dashboard")
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-muted/40">
           <OnboardingForm />
        </div>
    )
}
