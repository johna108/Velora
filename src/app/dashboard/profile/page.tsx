import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { startupProfileData } from "@/lib/data";

export default function ProfilePage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Startup Profile</CardTitle>
          <CardDescription>
            Manage your startup's core information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Startup Name</Label>
                <Input
                  id="name"
                  defaultValue={startupProfileData.name}
                  placeholder="e.g., InnovateAI"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  defaultValue={startupProfileData.industry}
                  placeholder="e.g., Artificial Intelligence"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="business-model">Business Model</Label>
              <Input
                id="business-model"
                defaultValue={startupProfileData.businessModel}
                placeholder="e.g., B2B Subscription"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="target-market">Target Market</Label>
              <Textarea
                id="target-market"
                defaultValue={startupProfileData.targetMarket}
                placeholder="Describe your target customers"
                className="min-h-24"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stage">Current Stage</Label>
              <Select defaultValue={startupProfileData.stage}>
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
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage your team and their roles.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {startupProfileData.team.map((member) => (
            <div key={member.name} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  {member.avatar && 
                    <AvatarImage src={member.avatar.imageUrl} alt={member.name} data-ai-hint={member.avatar.imageHint} />
                  }
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {member.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          ))}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
            <Button>Invite Member</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
