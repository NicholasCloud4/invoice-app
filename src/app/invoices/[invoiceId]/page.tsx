import { notFound } from "next/navigation";
import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import Invoice from "./Invoice";

// Typing the params as a Promise
type tParams = Promise<{ invoiceId: string }>;

export default async function InvoicePage({ params }: { params: tParams }) {
    const { userId } = await auth();

    if (!userId) {
        return;
    }

    // Await params to resolve it
    const { invoiceId } = await params;
    const parsedInvoiceId = parseInt(invoiceId);

    if (isNaN(parsedInvoiceId)) {
        throw new Error("Invoice ID is not a number");
    }

    const [result] = await db
        .select()
        .from(Invoices)
        .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
        .where(
            and(eq(Invoices.id, parsedInvoiceId), eq(Invoices.userId, userId))
        )
        .limit(1);

    if (!result) return notFound();

    const invoice = {
        ...result.invoices,
        customer: result.customers,
    };

    return <Invoice invoice={invoice} />;
}
