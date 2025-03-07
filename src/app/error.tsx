"use client";
export default function Error({ error }: { error: Error }) {
    return (
        <main className="flex flex-col justify-center min-h-screen h-full text-center gap-5 max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold">{error.message}</h1>
        </main>
    );
}
