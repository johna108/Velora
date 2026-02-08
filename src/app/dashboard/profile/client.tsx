"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { updateStartupProfile, inviteTeamMember, removeTeamMember } from "./actions";
import { Switch } from "@/components/ui/switch";

type ProfileClientProps = {
  startup: Startup;
  team: TeamMember[];
};

export default function ProfileClient({ startup, team }: ProfileClientProps) {
  const [profileData, setProfileData] = useState<Startup>(startup);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: Startup["stage"]) => {
    setProfileData((prev) => ({ ...prev, stage: value }));
  };

  const handleTogglePublic = (checked: boolean) => {
    setProfileData((prev) => ({ ...prev, is_public: checked }));
  };

  const handleSaveChanges = async () => {
    await updateStartupProfile(startup.id, {
      name: profileData.name,
      industry: profileData.industry,
      description: profileData.description,
      business_model: profileData.business_model,
      target_market: profileData.target_market,
      stage: profileData.stage,
      is_public: profileData.is_public,
    });
    
    toast({
      title: "Success!",
      description: "Your startup profile has been saved.",
    });
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

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
                  value={profileData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., InnovateAI"
                  disabled={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={profileData.industry}
                  onChange={handleInputChange}
                  placeholder="e.g., Artificial Intelligence"
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">Public Visibility</Label>
                    <div className="text-sm text-muted-foreground">
                        Show your startup on the home page and public directory.
                    </div>
                </div>
                <Switch
                    checked={profileData.is_public}
                    onCheckedChange={handleTogglePublic}
                    disabled={!isEditing}
                />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="business_model">Business Model</Label>
              <Input
                id="business_model"
                value={profileData.business_model || ""}
                onChange={handleInputChange}
                placeholder="e.g., B2B Subscription"
                disabled={!isEditing}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="target_market">Target Market</Label>
              <Textarea
                id="target_market"
                value={profileData.target_market || ""}
                onChange={handleInputChange}
                placeholder="Describe your target customers"
                className="min-h-24"
                disabled={!isEditing}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stage">Current Stage</Label>
              <Select
                value={profileData.stage}
                onValueChange={handleSelectChange}
                disabled={!isEditing}
              >
                <SelectTrigger id="stage">
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
          {isEditing ? (
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          ) : (
            <Button onClick={handleEdit}>Edit</Button>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your team and their roles.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {team.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between space-x-4"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  {member.avatar_url && (
                    <AvatarImage
                      src={member.avatar_url}
                      alt={member.name}
                    />
                  )}
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {member.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.role}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={async () => {
                    await removeTeamMember(member.id);
                    toast({ title: "Removed", description: "Team member removed." });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Invite Member</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Invite Member</DialogTitle>
                <DialogDescription>
                  Enter the email and role for the new team member. They will
                  receive an invitation to join.
                </DialogDescription>
              </DialogHeader>
              <form action={async (formData) => {
                  await inviteTeamMember(formData);
                  toast({ title: "Sent", description: "Invitation sent successfully." });
              }}>
                <input type="hidden" name="startupId" value={startup.id} />
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="member@example.com"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Role
                    </Label>
                    <Select name="role" required defaultValue="Team Member">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Team Member">Team Member</SelectItem>
                        <SelectItem value="Founder">Founder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Send Invitation</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}
