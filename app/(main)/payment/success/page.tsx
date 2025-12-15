import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
    return (
        <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center text-center px-4">
            <CheckCircle className="h-24 w-24 text-green-500 mb-6" />
            <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
                Thank you for your purchase. Your account has been upgraded to Premium.
            </p>
            <div className="flex gap-4">
                <Button asChild>
                    <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
            </div>
        </div>
    );
}
