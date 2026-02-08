'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createFeedback(feedback: any) {
    const supabase = await createClient();

    const { error, data } = await supabase
        .from('feedback')
        .insert(feedback)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/dashboard/feedback');
    return data;
}

export async function deleteFeedback(feedbackId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', feedbackId);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/dashboard/feedback');
}
