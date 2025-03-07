import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <main className="flex flex-col justify-center min-h-screen h-full text-center gap-5 max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold">InvoiceZen</h1>
            <p>
                <SignedOut>
                    <SignInButton />
                    <SignUpButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
                <Button asChild variant="outline">
                    <Link
                        href={"/dashboard"}
                        className={buttonVariants({ variant: "outline" })}
                    >
                        Sign In
                    </Link>
                </Button>
            </p>
        </main>
    );
}
