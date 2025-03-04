import { sql } from "drizzle-orm";
import { db } from "@/db";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { createAction } from "@/app/actions";

export default function Home() {
    return (
        <main className="flex flex-col justify-center h-full gap-5 max-w-5xl mx-auto my-12">
            <div className="flex justify-between">
                <h1 className="text-4xl font-bold">Create a New Invoice</h1>
            </div>

            <form action={createAction} className="grid gap-4 max-w-xs">
                <div>
                    <Label
                        htmlFor="name"
                        className="block font-semibold text-sm mb-2"
                    >
                        Billing Name
                    </Label>
                    <Input id="name" name="name" type="text" />
                </div>
                <div>
                    <Label
                        htmlFor="email"
                        className="block font-semibold text-sm mb-2"
                    >
                        Billing Email
                    </Label>
                    <Input id="email" name="email" type="email" />
                </div>
                <div>
                    <Label
                        htmlFor="amount"
                        className="block font-semibold text-sm mb-2"
                    >
                        Amount
                    </Label>
                    <Input id="amount" name="amount" type="text" />
                </div>
                <div>
                    <Label
                        htmlFor="description"
                        className="block font-semibold text-sm mb-2"
                    >
                        Description
                    </Label>
                    <Textarea id="description" name="description" />
                </div>

                <div>
                    <Button className="w-full font-semibold">
                        Create Invoice
                    </Button>
                </div>
            </form>
        </main>
    );
}
