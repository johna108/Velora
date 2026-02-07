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
import { startupProfileData, type StartupProfile } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const [profileData, setProfileData] =
    useState<StartupProfile>(startupProfileData);
  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: StartupProfile["stage"]) => {
    setProfileData((prev) => ({ ...prev, stage: value }));
  };

  const handleSaveChanges = () => {
    // In a real application, you would persist these changes to your backend.
    console.log("Saving Profile:", profileData);
    toast({
      title: "Success!",
      description: "Your startup profile has been saved.",
    });
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
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={profileData.industry}
                  onChange={handleInputChange}
                  placeholder="e.g., Artificial Intelligence"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="businessModel">Business Model</Label>
              <Input
                id="businessModel"
                value={profileData.businessModel}
                onChange={handleInputChange}
                placeholder="e.g., B2B Subscription"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="targetMarket">Target Market</Label>
              <Textarea
                id="targetMarket"
                value={profileData.targetMarket}
                onChange={handleInputChange}
                placeholder="Describe your target customers"
                className="min-h-24"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stage">Current Stage</Label>
              <Select
                value={profileData.stage}
                onValueChange={handleSelectChange}
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
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your team and their roles.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {profileData.team.map((member) => (
            <div
              key={member.name}
              className="flex items-center justify-between space-x-4"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  {member.avatar && (
                    <AvatarImage
                      src={member.avatar.imageUrl}
                      alt={member.name}
                      data-ai-hint={member.avatar.imageHint}
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
              <Button variant="outline" size="sm">
                Edit
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
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="member@example.com"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select>
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
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}
