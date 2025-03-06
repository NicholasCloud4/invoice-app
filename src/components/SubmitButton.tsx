"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { CircleEllipsis } from "lucide-react";

const SubmitButton = () => {
    const { pending } = useFormStatus();
    console.log(pending);
    return (
        <Button className="relative w-full font-semibold">
            <span className={pending ? "text-transparent" : ""}>Submit</span>
            {pending && (
                <span className="absolute flex items-center justify-center w-full h-full text-gray-500">
                    <CircleEllipsis className="animate-spin" /> Loading
                </span>
            )}
        </Button>
    );
};

export default SubmitButton;
