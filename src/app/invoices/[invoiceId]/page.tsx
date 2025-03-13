import { notFound } from "next/navigation";
import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import Invoice from "./Invoice";

export default async function InvoicePage({
    params,
}: {
    params: { invoiceId: string };
}) {
    const { userId } = await auth();

    if (!userId) {
        return;
    }

    const { invoiceId } = await params;
    const parsedInvoiceId = parseInt(invoiceId);
    // const invoiceId = parseInt(params.invoiceId);

    if (isNaN(parsedInvoiceId)) {
        throw new Error("Invoice ID is not a number");
    }

    const [result] = await db
        .select()
        .from(Invoices)
        .where(
            and(eq(Invoices.id, parsedInvoiceId), eq(Invoices.userId, userId))
        )
        .limit(1);

    if (!result) return notFound();

    // console.log(result);

    return <Invoice invoice={result} />;
}
