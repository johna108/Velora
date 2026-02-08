import { redirect } from "next/navigation";
import { getUserWithStartup } from "@/lib/db";
import PitchGeneratorClient from "./client";

export default async function PitchGeneratorPage() {
  const { user, startup } = await getUserWithStartup();

  if (!user) {
    redirect("/login");
  }

  if (!startup) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">No startup found. Please create one on the Dashboard.</p>
      </div>
    );
  }

  return <PitchGeneratorClient startup={startup} />;
}
