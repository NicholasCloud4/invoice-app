"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Invoices } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { AVAILABLE_STATUSES } from "@/data/invoices";
import { updateStatusAction, deleteInvoiceAction } from "@/app/actions";
import { CircleChevronDown, Ellipsis, Trash } from "lucide-react";
import { useOptimistic } from "react";

interface InvoiceProps {
    invoice: typeof Invoices.$inferSelect;
}

export default function Invoice({ invoice }: InvoiceProps) {
    const [currentStatus, setCurrentStatus] = useOptimistic(
        invoice.status,
        (state, newStatus) => {
            return String(newStatus);
        }
    );

    async function handleOnUpdateStatus(formData: FormData) {
        const originalStatus = currentStatus;
        setCurrentStatus(formData.get("status"));
        try {
            await updateStatusAction(formData);
        } catch (e) {
            setCurrentStatus(originalStatus);
        }
    }

    return (
        <main className="w-full h-full max-w-5xl mx-auto my-12">
            <Container>
                <div className="justify-between mb-8">
                    <h1 className="text-4xl font-bold">
                        Invoice #{invoice.id}
                    </h1>
                    <br />
                    <div className="inline-flex items-center gap-4">
                        <Badge
                            className={cn(
                                "rounded-full text-xs capitalize flex",
                                currentStatus === "draft" && "bg-gray-600",
                                currentStatus === "sent" && "bg-yellow-600",
                                currentStatus === "paid" && "bg-green-600",
                                currentStatus === "overdue" && "bg-red-600",
                                currentStatus === "void" && "bg-gray-600"
                            )}
                        >
                            {currentStatus}
                        </Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    Change Status
                                    <CircleChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {AVAILABLE_STATUSES.map((status) => {
                                    return (
                                        <DropdownMenuItem key={status.id}>
                                            <form action={handleOnUpdateStatus}>
                                                <input
                                                    type="hidden"
                                                    name="id"
                                                    value={invoice.id}
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

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <span className="sr-only">
                                        More Options
                                    </span>
                                    <Ellipsis className="w-4 h-auto" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    <form action={deleteInvoiceAction}>
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={invoice.id}
                                        />
                                        <input type="hidden" name="status" />
                                        <button className="flex items-center gap-2">
                                            <Trash />
                                            Delete Invoice
                                        </button>
                                    </form>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <p className="text-2xl mb-3">
                    ${(invoice.amount / 100).toFixed(2)}
                </p>
                <p className="text-lg mb-8">{invoice.description}</p>
                <h2 className="font-bold text-lg mb-4">Billing Details</h2>
                <ul className="grid gap-2">
                    <li className="flex gap-4">
                        <strong className="block w-28 flex-shrink-0 font-medium text-sm">
                            Invoice ID
                        </strong>
                        <span>{invoice.id}</span>
                    </li>
                    <li className="flex gap-4">
                        <strong className="block w-28 flex-shrink-0 font-medium text-sm">
                            Invoice Date
                        </strong>
                        <span>{new Date(invoice.createTs).toDateString()}</span>
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
