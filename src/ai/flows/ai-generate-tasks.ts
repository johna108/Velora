'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating startup tasks based on a startup profile.
 *
 * It exports:
 * - `generateStartupTasks`: A function to trigger the task generation flow.
 * - `StartupTasksInput`: The input type for the `generateStartupTasks` function.
 * - `StartupTasksOutput`: The output type for the `generateStartupTasks` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StartupTasksInputSchema = z.object({
  startupProfile: z
    .string()
    .describe(
      'Detailed description of the startup, including its industry, target market, business model, and current stage.'
    ),
});
export type StartupTasksInput = z.infer<typeof StartupTasksInputSchema>;

const StartupTasksOutputSchema = z.object({
  tasks: z
    .array(z.string())
    .describe('A list of suggested tasks for the startup to focus on.'),
});
export type StartupTasksOutput = z.infer<typeof StartupTasksOutputSchema>;

export async function generateStartupTasks(input: StartupTasksInput): Promise<StartupTasksOutput> {
  return generateStartupTasksFlow(input);
}

const generateTasksPrompt = ai.definePrompt({
  name: 'generateTasksPrompt',
  input: {schema: StartupTasksInputSchema},
  output: {schema: StartupTasksOutputSchema},
  prompt: `You are an AI assistant designed to help startup founders identify key tasks.

  Based on the following startup profile, suggest a list of actionable tasks the founder should prioritize.

  Startup Profile: {{{startupProfile}}}

  Tasks:
  `, // Ensure that 'Tasks:' is included to guide the model output.
});

const generateStartupTasksFlow = ai.defineFlow(
  {
    name: 'generateStartupTasksFlow',
    inputSchema: StartupTasksInputSchema,
    outputSchema: StartupTasksOutputSchema,
  },
  async input => {
    const {output} = await generateTasksPrompt(input);
    return output!;
  }
);
