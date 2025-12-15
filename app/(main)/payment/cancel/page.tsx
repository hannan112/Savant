import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function CancelPage() {
    return (
        <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center text-center px-4">
            <XCircle className="h-24 w-24 text-red-500 mb-6" />
            <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
                Your payment was cancelled. No charges were made.
            </p>
            <div className="flex gap-4">
                <Button asChild variant="outline">
                    <Link href="/pricing">Try Again</Link>
                </Button>
                <Button asChild>
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
        </div>
    );
}
