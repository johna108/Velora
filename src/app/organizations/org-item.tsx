"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Activity } from "lucide-react"
import { selectStartup } from "./actions"
import { useTransition } from "react"
import { Badge } from "@/components/ui/badge"
import { DeleteProjectButton } from "./delete-project-button"

export function OrganizationItem({ startup }: { startup: any }) {
    const [isPending, startTransition] = useTransition()

    const handleSelect = () => {
        startTransition(() => {
            selectStartup(startup.id)
        })
    }

    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer group relative" onClick={handleSelect}>
            <DeleteProjectButton projectId={startup.id} projectName={startup.name} />
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{startup.name}</CardTitle>
                    <Badge variant={startup.stage === 'Idea' ? 'secondary' : 'default'}>{startup.stage}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                    {startup.description || "No description provided."}
                </p>
            </CardContent>
            <CardFooter className="pt-0">
                 <Button variant="ghost" className="w-full justify-between hover:bg-transparent px-0" disabled={isPending}>
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Activity className="h-3 w-3" />
                        {isPending ? "Loading..." : "View Dashboard"}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                 </Button>
            </CardFooter>
        </Card>
    )
}
