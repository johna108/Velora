"use server";

import { generateInvestorPitch } from "@/ai/ai-generate-investor-pitch";
import type { Startup } from "@/lib/db";

export async function generatePitchAction(startup: Startup) {
  try {
    const result = await generateInvestorPitch({
      companyName: startup.name,
      problem: startup.problem || "N/A",
      solution: startup.solution || "N/A",
      roadmap: startup.roadmap || "N/A",
      traction: startup.traction || "N/A",
    });

    if (!result || !result.slides) {
      return { error: "AI failed to generate a pitch. Please try again." };
    }

    return { slides: result.slides };
  } catch (e) {
    console.error(e);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
