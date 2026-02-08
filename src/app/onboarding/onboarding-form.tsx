"use client"

import { useTransition } from "react"
import { completeOnboarding } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Rocket } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function OnboardingForm() {
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()

    const handleSubmit = async (formData: FormData) => {
        startTransition(async () => {
             // @ts-ignore
            const result = await completeOnboarding(null, formData)
            if (result?.error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.message
                })
            }
        })
    }

    return (
        <Card className="mx-auto max-w-lg w-full">
            <CardHeader className="text-center">
                 <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Rocket className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Create your Organization</CardTitle>
                <CardDescription>
                    Let's set up your workspace.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="orgName">Organization Name</Label>
                        <Input id="orgName" name="orgName" placeholder="e.g. Acme Corp" required />
                    </div>

                    <Button type="submit" disabled={isPending} className="w-full mt-4">
                         {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                         Create Organization
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
