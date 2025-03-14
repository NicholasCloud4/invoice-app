"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

import { Customers, Invoices, Status } from "@/db/schema";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";

export async function createAction(formData: FormData) {
    const { userId } = await auth();

    if (!userId) return;

    const amount = Math.floor(
        Number.parseFloat(String(formData.get("amount"))) * 100
    );
    const description = formData.get("description") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    const [customer] = await db
        .insert(Customers)
        .values({
            name,
            email,
            userId,
        })
        .returning({
            id: Customers.id,
        });

    const results = await db
        .insert(Invoices)
        .values({
            amount,
            description,
            userId,
            customerId: customer.id,
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

    console.log(result);

    revalidatePath(`/invoices/${id}`, "page");
}

export async function deleteInvoiceAction(formData: FormData) {
    const { userId } = await auth();

    if (!userId) return;

    const id = formData.get("id") as string;

    const result = await db
        .delete(Invoices)
        .where(and(eq(Invoices.id, parseInt(id)), eq(Invoices.userId, userId)));

    console.log(result);

    redirect("/dashboard");
}
