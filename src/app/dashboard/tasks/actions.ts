'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateTask(taskId: string, updates: any) {
    const supabase = await createClient();
    
    const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/dashboard/tasks');
}

export async function createTask(task: any) {
    const supabase = await createClient();

    const { error, data } = await supabase
        .from('tasks')
        .insert(task)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/dashboard/tasks');
    return data;
}

export async function deleteTask(taskId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/dashboard/tasks');
}
