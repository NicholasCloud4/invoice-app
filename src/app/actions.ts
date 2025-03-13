"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

import { Invoices, Status } from "@/db/schema";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";

export async function createAction(formData: FormData) {
    const { userId } = await auth();
    const amount = Math.floor(
        Number.parseFloat(String(formData.get("amount"))) * 100
    );
    const description = formData.get("description") as string;

    if (!userId) return;

    const results = await db
        .insert(Invoices)
        .values({
            amount,
            description,
            userId,
            status: "draft",
        })
        .returning({
            id: Invoices.id,
        });

    redirect(`/invoices/${results[0].id}`);
}

export async function updateStatusAction(formData: FormData) {
    const { userId } = await auth();

    if (!userId) return;

    const id = formData.get("id") as string;
    const status = formData.get("status") as Status;

    const result = await db
        .update(Invoices)
        .set({ status })
        .where(and(eq(Invoices.id, parseInt(id)), eq(Invoices.userId, userId)));

    revalidatePath(`/invoices/${id}`, "page");
}
