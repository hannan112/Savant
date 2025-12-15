"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";

export default function MockCheckoutPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate processing time
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Call API to upgrade user
            const response = await fetch("/api/checkout/mock-confirm", {
                method: "POST",
            });

            if (response.ok) {
                router.push("/payment/success?session_id=mock_session_123");
            } else {
                alert("Payment failed (Mock)");
            }
        } catch (error) {
            console.error("Payment error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Secure Checkout (Demo)</CardTitle>
                        <div className="flex items-center text-green-600 text-sm font-medium">
                            <Lock className="w-4 h-4 mr-1" />
                            Encrypted
                        </div>
                    </div>
                    <CardDescription>
                        Enter your payment details to upgrade to Premium.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handlePayment}>
                    <CardContent className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-md mb-4 text-sm text-blue-700">
                            <p className="font-semibold">Demo Mode Active</p>
                            <p>You can use any dummy data below. No real charge will be made.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Name on Card</Label>
                            <Input id="name" placeholder="John Doe" required defaultValue="Demo User" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="card">Card Number</Label>
                            <Input id="card" placeholder="0000 0000 0000 0000" required defaultValue="4242 4242 4242 4242" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input id="expiry" placeholder="MM/YY" required defaultValue="12/25" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvc">CVC</Label>
                                <Input id="cvc" placeholder="123" required defaultValue="123" />
                            </div>
                        </div>

                        <div className="flex justify-between items-center py-2 border-t mt-4">
                            <span className="font-medium">Total</span>
                            <span className="text-xl font-bold">$19.99</span>
                        </div>

                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing Payment...
                                </>
                            ) : (
                                "Pay Now"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
