'use server';
/**
 * @fileOverview Investor pitch generator AI agent.
 *
 * - generateInvestorPitch - A function that handles the investor pitch generation process.
 * - GenerateInvestorPitchInput - The input type for the generateInvestorPitch function.
 * - GenerateInvestorPitchOutput - The return type for the generateInvestorPitch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInvestorPitchInputSchema = z.object({
  companyName: z.string().describe('The name of the company.'),
  problem: z.string().describe('The problem the company is solving.'),
  solution: z.string().describe('The solution the company is offering.'),
  traction: z.string().describe('The traction the company has achieved so far.'),
  roadmap: z.string().describe('The roadmap for the company future growth.'),
});
export type GenerateInvestorPitchInput = z.infer<typeof GenerateInvestorPitchInputSchema>;

const GenerateInvestorPitchOutputSchema = z.object({
  pitch: z.string().describe('The generated investor pitch.'),
});
export type GenerateInvestorPitchOutput = z.infer<typeof GenerateInvestorPitchOutputSchema>;

export async function generateInvestorPitch(input: GenerateInvestorPitchInput): Promise<GenerateInvestorPitchOutput> {
  return generateInvestorPitchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInvestorPitchPrompt',
  input: {schema: GenerateInvestorPitchInputSchema},
  output: {schema: GenerateInvestorPitchOutputSchema},
  prompt: `You are an expert in crafting investor pitches.

  Based on the following startup data, generate a compelling investor pitch:

  Company Name: {{{companyName}}}
  Problem: {{{problem}}}
  Solution: {{{solution}}}
  Traction: {{{traction}}}
  Roadmap: {{{roadmap}}}
  `,
});

const generateInvestorPitchFlow = ai.defineFlow(
  {
    name: 'generateInvestorPitchFlow',
    inputSchema: GenerateInvestorPitchInputSchema,
    outputSchema: GenerateInvestorPitchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
