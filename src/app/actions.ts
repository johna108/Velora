"use server";

import {
  generateStartupTasks,
  type StartupTasksInput,
} from "@/ai/flows/ai-generate-tasks";
import { z } from "zod";

const StartupTasksInputSchema = z.object({
  startupProfile: z.string().min(10, {
    message: "Startup profile must be at least 10 characters long.",
  }),
});

export async function getAITasks(values: StartupTasksInput) {
  try {
    const validatedFields = StartupTasksInputSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid input provided." };
    }

    const result = await generateStartupTasks(validatedFields.data);

    if (!result || !result.tasks) {
        return { error: "AI failed to generate tasks. Please try again." };
    }

    return { tasks: result.tasks };
  } catch (e) {
    console.error(e);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
