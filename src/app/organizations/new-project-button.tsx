"use client"

import { useState } from "react"
import { useTransition } from "react"
import { createProject } from "./actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function NewProjectButton({ orgId, trigger }: { orgId: string, trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    formData.append("orgId", orgId)
    startTransition(async () => {
      // @ts-ignore
      const result = await createProject(formData)
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message
        })
      } else {
        toast({
          title: "Success",
          description: "Project created successfully"
        })
        setOpen(false)
        if (result.redirect) {
            router.push(result.redirect)
        }
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : (
          <Button variant="ghost" size="sm" className="h-8">
              <Plus className="mr-2 h-3 w-3" />
              New Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto w-full">
        <DialogHeader>
          <DialogTitle>Create Startup Project</DialogTitle>
          <DialogDescription>
            Enter the details of your startup to begin.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="grid grid-cols-2 gap-6 py-4">
            
          <div className="col-span-2 grid gap-2">
            <Label htmlFor="name">Startup Name *</Label>
            <Input id="name" name="name" placeholder="Project X" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" name="industry" placeholder="e.g. Fintech" />
          </div>

          <div className="grid gap-2">
              <Label htmlFor="stage">Stage</Label>
              <Select name="stage" defaultValue="Idea">
                  <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value="Idea">Idea</SelectItem>
                  <SelectItem value="MVP">MVP</SelectItem>
                  <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                  <SelectItem value="Seed">Seed</SelectItem>
                  </SelectContent>
              </Select>
          </div>

          <div className="col-span-2 grid gap-2">
            <Label htmlFor="description">Short Description *</Label>
            <Textarea id="description" name="description" placeholder="A brief pitch of your startup..." required />
          </div>

          <div className="col-span-1 grid gap-2">
            <Label htmlFor="business_model">Business Model</Label>
            <Input id="business_model" name="business_model" placeholder="e.g. SaaS, Marketplace" />
          </div>
           
           <div className="col-span-1 grid gap-2">
            <Label htmlFor="target_market">Target Market</Label>
            <Input id="target_market" name="target_market" placeholder="e.g. Small Businesses" />
          </div>

          <div className="col-span-2 border-t pt-4 mt-2">
             <h4 className="text-sm font-medium mb-3">Pitch Details (Optional)</h4>
          </div>

          <div className="col-span-2 grid gap-2">
            <Label htmlFor="problem">Problem</Label>
            <Textarea id="problem" name="problem" placeholder="What problem are you solving?" rows={2} />
          </div>
           <div className="col-span-2 grid gap-2">
            <Label htmlFor="solution">Solution</Label>
            <Textarea id="solution" name="solution" placeholder="How does your product solve it?" rows={2} />
          </div>

          <div className="col-span-2">
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Project & Enter Dashboard
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
