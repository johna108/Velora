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

const SlideSchema = z.object({
  title: z.string().describe('The title of the slide.'),
  content: z
    .string()
    .describe(
      'The content of the slide, formatted as markdown with bullet points.'
    ),
});

const GenerateInvestorPitchOutputSchema = z.object({
  slides: z
    .array(SlideSchema)
    .describe('The generated investor pitch deck with 7-10 slides.'),
});
export type GenerateInvestorPitchOutput = z.infer<typeof GenerateInvestorPitchOutputSchema>;

export async function generateInvestorPitch(input: GenerateInvestorPitchInput): Promise<GenerateInvestorPitchOutput> {
  return generateInvestorPitchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInvestorPitchPrompt',
  input: {schema: GenerateInvestorPitchInputSchema},
  output: {schema: GenerateInvestorPitchOutputSchema},
  prompt: `You are an expert in crafting investor pitch decks. Your task is to generate a compelling slide deck based on the provided startup data. The deck should consist of 7 to 10 slides. Each slide must have a title and content with bullet points.

    Here is the startup data:
    Company Name: {{{companyName}}}
    The Problem: {{{problem}}}
    Our Solution: {{{solution}}}
    Our Traction: {{{traction}}}
    Our Roadmap: {{{roadmap}}}

    Generate slides covering these topics in a logical order:
    1.  Title Slide (Company Name & Tagline)
    2.  Problem
    3.  Solution
    4.  Market Size
    5.  Product
    6.  Traction/Progress
    7.  Business Model
    8.  Roadmap
    9.  The Team (You can make up team member strengths based on the context)
    10. The Ask (e.g., "Seeking $500K for 10% equity to scale our team and accelerate growth.")

    Ensure the output is structured as an array of slide objects, each with a 'title' and 'content'. The content should be concise and use markdown bullet points.`,
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
