"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { FileText, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { generatePitchAction } from "./actions";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { type Startup } from "@/lib/db";
import PptxGenJS from "pptxgenjs";

type PitchSectionProps = {
    title: string;
    children: React.ReactNode;
};

function PitchSection({ title, children }: PitchSectionProps) {
    return (
        <div>
            <h3 className="text-xl font-semibold font-headline text-primary mb-2">{title}</h3>
            <div className="prose prose-sm max-w-none text-muted-foreground">{children}</div>
        </div>
    )
}

type Slide = {
    title: string;
    content: string;
};

export default function PitchGeneratorClient({ startup }: { startup: Startup }) {
    const [isPending, startTransition] = useTransition();
    const [generatedSlides, setGeneratedSlides] = useState<Slide[] | null>(null);
    const { toast } = useToast();

    const handleGeneratePitch = () => {
        startTransition(async () => {
            const result = await generatePitchAction(startup);
            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.error,
                });
            } else if (result.slides) {
                setGeneratedSlides(result.slides);
                toast({
                    title: "Success!",
                    description: "AI has generated your investor pitch.",
                });
            }
        });
    }

    const handleDownloadPPT = () => {
        if (!generatedSlides) {
            toast({
                variant: "destructive",
                title: "No slides to download",
                description: "Please generate a pitch first.",
            });
            return;
        }

        const pptx = new PptxGenJS();
        
        generatedSlides.forEach(slide => {
            const pptxSlide = pptx.addSlide();
            
            // Explicitly set background to white
            pptxSlide.background = { color: "FFFFFF" };
            
            const titleColor = "363636";
            const contentColor = "6A6A6A";

            pptxSlide.addText(slide.title, { 
                x: 0.5, 
                y: 0.25, 
                w: '90%', 
                h: 1, 
                fontSize: 36, 
                bold: true, 
                align: 'center',
                color: titleColor
            });

            // Strip markdown formatting for cleaner PPT output
            const content = slide.content
                .split('\n')
                .map(line => line.replace(/^[*-•]\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1').trim())
                .filter(line => line)
                .join('\n');

            pptxSlide.addText(content, { 
                x: 1, 
                y: 1.8, 
                w: '80%', 
                h: '70%', 
                fontSize: 18,
                bullet: true,
                color: contentColor,
                lineSpacing: 36,
            });
        });

        pptx.writeFile({ fileName: `${startup.name}-Pitch-Deck.pptx` });
    };

  return (
    <div className="grid gap-6">
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="text-primary" />
            AI Investor Pitch Generator
          </CardTitle>
          <CardDescription>
            Use your startup data to generate a compelling pitch deck and preview the slides.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px]">
            {isPending ? (
                <div className="flex justify-center items-center h-full min-h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="ml-4 text-muted-foreground">Generating your pitch...</p>
                </div>
            ) : generatedSlides ? (
                <Carousel className="w-full max-w-xl mx-auto">
                    <CarouselContent>
                        {generatedSlides.map((slide, index) => (
                        <CarouselItem key={index}>
                            <div className="p-1">
                            <Card className="h-[400px] w-full flex flex-col relative overflow-hidden bg-white text-black border-2 border-slate-200">
                                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                                    <CardTitle className="text-xl font-bold text-slate-800 text-center">{slide.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 overflow-y-auto flex-1 text-left">
                                     <ul className="list-disc pl-4 space-y-2 text-slate-700">
                                        {slide.content.split('\n').filter(line => line.trim()).map((line, i) => (
                                            <li key={i} className="pl-1 text-sm">
                                                {line.replace(/^[*-•]\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
                                            </li>
                                        ))}
                                     </ul>
                                </CardContent>
                                <div className="absolute bottom-2 right-4 text-xs text-slate-400">
                                    Slide {index + 1}
                                </div>
                            </Card>
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            ) : (
                <div className="space-y-8">
                    <PitchSection title="1. Problem">
                        <p>{startup.problem || "Describe the problem you are solving in your Profile."}</p>
                    </PitchSection>
                    <PitchSection title="2. Solution">
                        <p>{startup.solution || "Describe your solution in your Profile."}</p>
                    </PitchSection>
                    <PitchSection title="3. Market Size">
                        <p>
                           {startup.target_market ? (
                               <>Target Market: {startup.target_market}</>
                           ) : "Define your target market in your Profile."}
                        </p>
                    </PitchSection>
                    <PitchSection title="4. Product">
                        <p>Key features and product details would appear here based on your profile description.</p>
                    </PitchSection>
                    <PitchSection title="5. Business Model">
                        <p>
                            {startup.business_model ? (
                                <>Business Model: {startup.business_model}</>
                            ) : "Define your business model in your Profile."}
                        </p>
                    </PitchSection>
                    <PitchSection title="6. Roadmap">
                        <p>{startup.roadmap || "Outline your roadmap in your Profile."}</p>
                    </PitchSection>
                </div>
            )}
        </CardContent>
        <CardFooter className="flex gap-2">
            <Button onClick={handleGeneratePitch} disabled={isPending}>
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                    </>
                ) : (
                    "Generate Pitch"
                )}
            </Button>
            <Button variant="outline" onClick={handleDownloadPPT} disabled={!generatedSlides || isPending}>Download as PPT</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
