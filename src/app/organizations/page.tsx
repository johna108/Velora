import Link from "next/link"
import { getAuthUser, getUserOrganizationsWithStartups } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Plus, Rocket, ArrowRight } from "lucide-react"
import { OrganizationItem } from "./org-item"
import { NewOrganizationButton } from "./new-org-button"
import { NewProjectButton } from "./new-project-button"
import { DeleteOrganizationButton } from "./delete-org-button"

export default async function OrganizationsPage() {
  const user = await getAuthUser()
  if (!user) {
    redirect("/login")
  }

  const organizations = await getUserOrganizationsWithStartups(user.id)
  
  if (organizations.length === 0) {
    // Edge case: User has no orgs (maybe skipped onboarding?)
    redirect("/onboarding")
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
           <div className="flex bg-primary text-primary-foreground p-1 rounded-md">
                <Rocket className="h-5 w-5" />
           </div>
           <span className="text-xl font-bold">Velora</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
             <span className="text-sm text-muted-foreground">Logged in as {user.email}</span>
        </div>
      </header>

      <main className="p-4 sm:px-6 sm:py-0 md:gap-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Your Organizations</h1>
                <p className="text-muted-foreground mt-2">Manage your projects and teams.</p>
            </div>
            <NewOrganizationButton />
        </div>

        <div className="grid gap-6">
            {organizations.map((org) => (
                <Card key={org.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Building2 className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">{org.name}</CardTitle>
                                    <CardDescription>Created on {new Date(org.created_at).toLocaleDateString()}</CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">Settings</Button>
                                <DeleteOrganizationButton orgId={org.id} orgName={org.name} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Rocket className="h-4 w-4 text-muted-foreground" />
                                Projects
                            </h3>
                            <NewProjectButton orgId={org.id} />
                        </div>
                        
                        {org.startups && org.startups.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {org.startups.map((startup: any) => (
                                    <OrganizationItem key={startup.id} startup={startup} />
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-8 border-2 border-dashed rounded-lg">
                                <p className="text-sm text-muted-foreground mb-4">No projects yet</p>
                                <NewProjectButton 
                                    orgId={org.id} 
                                    trigger={<Button variant="secondary" size="sm">Create your first project</Button>} 
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
      </main>
    </div>
  )
}
