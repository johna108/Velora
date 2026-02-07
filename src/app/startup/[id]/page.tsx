import { publicStartups, type StartupProfile } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Users, Briefcase, Target, Milestone, Lightbulb } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

type DetailCardProps = {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
};

function DetailCard({ icon, title, children }: DetailCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                {icon}
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{children}</p>
            </CardContent>
        </Card>
    )
}

export default function StartupDetailPage({ params }: { params: { id: string } }) {
    const startup = publicStartups.find(s => s.id === params.id);

    if (!startup) {
        notFound();
    }

    return (
        <div className="bg-secondary/30 min-h-screen">
            <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background">
                <Link href="/" className="flex items-center justify-center" prefetch={false}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                    <path d="M21.3333 2.66699H10.6667C9.95942 2.66699 9.28115 2.94795 8.78105 3.44805C8.28095 3.94815 8 4.62642 8 5.33366V26.667C8 27.3742 8.28095 28.0525 8.78105 28.5526C9.28115 29.0527 9.95942 29.3337 10.6667 29.3337H21.3333C22.0406 29.3337 22.7189 29.0527 23.219 28.5526C23.7191 28.0525 24 27.3742 24 26.667V5.33366C24 4.62642 23.7191 3.94815 23.219 3.44805C22.7189 2.94795 22.0406 2.66699 21.3333 2.66699Z" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 24H16.0133" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8H20" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="sr-only">StartupOps</span>
                </Link>
                <h1 className="text-2xl font-bold font-headline ml-2">StartupOps</h1>
                 <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Button variant="outline" asChild>
                        <Link href="/">Back to Discover</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/login">Go to Dashboard</Link>
                    </Button>
                </nav>
            </header>

            <main className="container mx-auto py-12 px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-2">
                             <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-teal-400">
                                {startup.name}
                            </h1>
                            <p className="text-xl text-muted-foreground">{startup.description}</p>
                        </div>

                         <div className="grid md:grid-cols-2 gap-6">
                            <DetailCard icon={<Lightbulb className="text-primary"/>} title="The Problem">
                                {startup.problem}
                            </DetailCard>
                             <DetailCard icon={<Milestone className="text-primary"/>} title="The Solution">
                                {startup.solution}
                            </DetailCard>
                            <DetailCard icon={<Briefcase className="text-primary"/>} title="Business Model">
                                {startup.businessModel}
                            </DetailCard>
                            <DetailCard icon={<Target className="text-primary"/>} title="Target Market">
                                {startup.targetMarket}
                            </DetailCard>
                         </div>
                    </div>
                    <div className="space-y-6">
                         <Card>
                            <CardHeader>
                                <CardTitle>Startup Info</CardTitle>
                            </CardHeader>
                             <CardContent className="space-y-4 text-sm">
                                <p><strong>Industry:</strong> {startup.industry}</p>
                                <p><strong>Stage:</strong> {startup.stage}</p>
                                 <Button className="w-full" asChild>
                                    <a href={`mailto:${startup.founderEmail}`}>
                                        <Mail className="mr-2 h-4 w-4" /> Contact Founder
                                    </a>
                                </Button>
                             </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Users /> The Team</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                {startup.team.map((member) => (
                                <div key={member.name} className="flex items-center space-x-4">
                                    <Avatar>
                                    {member.avatar && (
                                        <AvatarImage src={member.avatar.imageUrl} alt={member.name} data-ai-hint={member.avatar.imageHint} />
                                    )}
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                    <p className="text-sm font-medium leading-none">{member.name}</p>
                                    <p className="text-sm text-muted-foreground">{member.role}</p>
                                    </div>
                                </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
