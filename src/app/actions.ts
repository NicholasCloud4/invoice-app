"use server";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { Invoices } from "@/db/schema";
import { db } from "@/db";

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
