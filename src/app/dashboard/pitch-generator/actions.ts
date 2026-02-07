"use server";

import { generateInvestorPitch } from "@/ai/ai-generate-investor-pitch";
import { startupProfileData } from "@/lib/data";

export async function generatePitchAction() {
  try {
    const result = await generateInvestorPitch({
      companyName: startupProfileData.name,
      problem: startupProfileData.problem,
      solution: startupProfileData.solution,
      roadmap: startupProfileData.roadmap,
      traction: startupProfileData.traction,
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
