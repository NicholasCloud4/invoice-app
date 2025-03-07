import { notFound } from "next/navigation";

import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default async function InvoicePage({
    params,
}: {
    params: { invoiceId: string };
}) {
    const invoiceId = parseInt(params.invoiceId);

    if (isNaN(invoiceId)) {
        throw new Error("Invoice ID is not a number");
    }

    const [result] = await db
        .select()
        .from(Invoices)
        .where(eq(Invoices.id, invoiceId))
        .limit(1);

    if (!result) return notFound();

    // console.log(result);

    return (
        <main className="h-full max-w-5xl mx-auto my-12">
            <div className="flex justify-between mb-8">
                <h1 className="text-4xl font-bold">
                    Invoice #{invoiceId}
                    <Badge
                        className={cn(
                            "rounded-full text-xs capitalize flex",
                            result.status === "draft" && "bg-gray-600",
                            result.status === "sent" && "bg-yellow-600",
                            result.status === "paid" && "bg-green-600",
                            result.status === "overdue" && "bg-red-600",
                            result.status === "void" && "bg-gray-600"
                        )}
                    >
                        {result.status}
                    </Badge>
                </h1>
                <p></p>
            </div>
            <p className="text-2xl mb-3">${(result.amount / 100).toFixed(2)}</p>
            <p className="text-lg mb-8">{result.description}</p>
            <h2 className="font-bold text-lg mb-4">Billing Details</h2>
            <ul className="grid gap-2">
                <li className="flex gap-4">
                    <strong className="block w-28 flex-shrink-0 font-medium text-sm">
                        Invoice ID
                    </strong>
                    <span>{invoiceId}</span>
                </li>
                <li className="flex gap-4">
                    <strong className="block w-28 flex-shrink-0 font-medium text-sm">
                        Invoice Date
                    </strong>
                    <span>{new Date(result.createTs).toDateString()}</span>
                </li>
                <li className="flex gap-4">
                    <strong className="block w-28 flex-shrink-0 font-medium text-sm">
                        Billing Name
                    </strong>
                    <span></span>
                </li>
                <li className="flex gap-4">
                    <strong className="block w-28 flex-shrink-0 font-medium text-sm">
                        Billing Email
                    </strong>
                    <span></span>
                </li>
            </ul>
        </main>
    );
}
