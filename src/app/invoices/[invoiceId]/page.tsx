import { notFound } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { AVAILABLE_STATUSES } from "@/data/invoices";
import { updateStatusAction } from "@/app/actions";

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

    return (
        <main className="w-full h-full max-w-5xl mx-auto my-12">
            <Container>
                <div className="justify-between mb-8">
                    <h1 className="text-4xl font-bold">Invoice #{invoiceId}</h1>
                    <br />
                    <div className="inline-flex items-center gap-4">
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Change Status</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {AVAILABLE_STATUSES.map((status) => {
                                    return (
                                        <DropdownMenuItem key={status.id}>
                                            <form action={updateStatusAction}>
                                                <input
                                                    type="hidden"
                                                    name="id"
                                                    value={invoiceId}
                                                />
                                                <input
                                                    type="hidden"
                                                    name="status"
                                                    value={status.id}
                                                />
                                                <button>{status.label}</button>
                                            </form>
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <p className="text-2xl mb-3">
                    ${(result.amount / 100).toFixed(2)}
                </p>
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
            </Container>
        </main>
    );
}
