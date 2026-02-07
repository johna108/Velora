"use server";

import { generateInvestorPitch } from "@/ai/ai-generate-investor-pitch";
import { startupProfileData } from "@/lib/data";

const problem =
  "Early-stage startups often struggle not because of a lack of ideas, but due to poor execution, unstructured planning, and the absence of data-driven decision-making. Founders rely on a fragmented set of tools, leading to inefficiency and a lack of focus on what truly matters for growth.";
const solution = `${startupProfileData.name} is a unified digital platform that acts as an operational workspace for early-stage founders. We help them manage execution, validate ideas, collaborate with their teams, and gain actionable insights to scale efficiently. Our solution is intuitive, scalable, and founder-centric, designed to mirror real-world startup workflows.`;
const roadmap =
  "Our 12-month roadmap includes: Q1: Launch public beta and onboard first 100 startups. Q2: Integrate with popular developer tools like GitHub and Slack. Q3: Introduce advanced collaboration and resource planning features. Q4: Develop a mobile application and expand our AI capabilities.";
const traction =
  "We are currently at the MVP stage with positive feedback from a small group of beta testers. Key features like task management and feedback collection are live. We have 2 external beta users providing feedback.";

export async function generatePitchAction() {
  try {
    const result = await generateInvestorPitch({
      companyName: startupProfileData.name,
      problem,
      solution,
      roadmap,
      traction,
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
