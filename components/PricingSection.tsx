"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function PricingSection({ className }: { className?: string }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        if (!session) {
            router.push("/auth/signin");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId: "default" }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Checkout failed");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={className}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-lg text-muted-foreground">
                        Choose the plan that's right for you.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Free</CardTitle>
                            <CardDescription>For basic usage</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold mb-6">$0<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> 5 Paraphrases / day</li>
                                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Basic File Conversion</li>
                                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Ad supported</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline">Current Plan</Button>
                        </CardFooter>
                    </Card>

                    {/* Premium Plan */}
                    <Card className="border-primary shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl">Popular</div>
                        <CardHeader>
                            <CardTitle>Premium</CardTitle>
                            <CardDescription>For power users</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold mb-6">$19.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Unlimited Paraphrasing</li>
                                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Faster Conversions</li>
                                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Priority Support</li>
                                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> No Ads</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={handleCheckout} disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Upgrade Now
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>
    );
}
