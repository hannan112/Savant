"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const { update } = useSession();

    useEffect(() => {
        if (!sessionId) {
            setStatus("error");
            return;
        }

        const verifyPayment = async () => {
            try {
                const res = await fetch(`/api/payment/verify?session_id=${sessionId}`);
                const data = await res.json();
                if (res.ok && data.success) {
                    setStatus("success");
                    // Force session update to reflect new plan immediately
                    await update();
                } else {
                    console.error("Verification failed:", data);
                    setStatus("error");
                }
            } catch (error) {
                console.error("Verification error:", error);
                setStatus("error");
            }
        };

        verifyPayment();
    }, [sessionId, update]);

    if (status === "loading") {
        return (
            <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center text-center px-4">
                <Loader2 className="h-24 w-24 text-primary mb-6 animate-spin" />
                <h1 className="text-3xl font-bold mb-4">Verifying Payment...</h1>
                <p className="text-lg text-muted-foreground">Please wait while we confirm your transaction.</p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center text-center px-4">
                <XCircle className="h-24 w-24 text-red-500 mb-6" />
                <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-md">
                    We couldn't verify your payment. If you were charged, please contact support.
                </p>
                <Button asChild>
                    <Link href="/contact">Contact Support</Link>
                </Button>
            </div>
        );
    }

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

export default function SuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}

