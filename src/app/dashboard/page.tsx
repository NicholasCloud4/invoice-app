import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export default async function Home() {
    const { userId } = await auth();

    if (!userId) return;

    const results = await db
        .select()
        .from(Invoices)
        .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
        .where(eq(Invoices.userId, userId));

    const invoices = results?.map(({ invoices, customers }) => {
        return {
            ...invoices,
            customer: customers,
        };
    });

    return (
        <main className="h-full">
            <Container>
                <div className="flex justify-between">
                    <h1 className="text-4xl font-bold">Invoices</h1>
                    <p>
                        <Button
                            variant="outline"
                            className="inline-flex gap-2"
                            asChild
                        >
                            <Link href="/invoices/new">
                                <Plus className="h-4 w-4" />
                                Create Invoice
                            </Link>
                        </Button>
                    </p>
                </div>
                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px] p-4">
                                Date
                            </TableHead>
                            <TableHead className="p-4">Customer</TableHead>
                            <TableHead className="p-4">Email</TableHead>
                            <TableHead className="text-center p-4">
                                Status
                            </TableHead>
                            <TableHead className="text-right p-4">
                                Amount
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {invoices.map((result) => {
                            return (
                                <TableRow key={result.id}>
                                    <TableCell className="font-medium text-left p-0">
                                        <Link
                                            href={`/invoices/${result.id}`}
                                            className="font-semibold block p-4"
                                        >
                                            {new Date(
                                                result.createTs
                                            ).toDateString()}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-left p-0">
                                        <Link
                                            href={`/invoices/${result.id}`}
                                            className="font-semibold block p-4"
                                        >
                                            {result.customer.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-left p-0">
                                        <Link
                                            href={`/invoices/${result.id}`}
                                            className="block p-4"
                                        >
                                            {result.customer.email}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-center p-0">
                                        <Link
                                            href={`/invoices/${result.id}`}
                                            className="font-semibold block p-4"
                                        >
                                            <Badge
                                                className={cn(
                                                    "rounded-full text-xs capitalize flex",
                                                    result.status === "draft" &&
                                                        "bg-gray-600",
                                                    result.status === "sent" &&
                                                        "bg-yellow-600",
                                                    result.status === "paid" &&
                                                        "bg-green-600",
                                                    result.status ===
                                                        "overdue" &&
                                                        "bg-red-600",
                                                    result.status === "void" &&
                                                        "bg-gray-600"
                                                )}
                                            >
                                                {result.status}
                                            </Badge>
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-right p-0">
                                        <Link
                                            href={`/invoices/${result.id}`}
                                            className="font-semibold block p-4"
                                        >
                                            ${(result.amount / 100).toFixed(2)}
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Container>
        </main>
    );
}
