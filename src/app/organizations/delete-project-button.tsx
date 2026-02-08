"use client"

import { useState, useTransition } from "react"
import { deleteProject } from "./actions"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function DeleteProjectButton({ projectId, projectName }: { projectId: string, projectName: string }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = (e: React.MouseEvent) => {
    // Prevent bubbling to the card click (which selects the project)
    e.stopPropagation() 
    
    startTransition(async () => {
      const formData = new FormData()
      formData.append("projectId", projectId)
      // @ts-ignore
      const result = await deleteProject(formData)
      
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message
        })
      } else {
        toast({
          title: "Success",
          description: "Project deleted"
        })
        setOpen(false)
        router.refresh()
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-muted-foreground hover:text-destructive absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()} // Prevent card selection on trigger click
        >
          <Trash2 className="h-3 w-3" />
          <span className="sr-only">Delete Project</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Project?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{projectName}</strong> and all its data (tasks, feedback, etc).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
