import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        // Optional: Require login
        // if (!session || !session.user) {
        //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // }

        const { priceId } = await req.json();

        // Determine the base URL dynamically to support both localhost and production
        const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";



        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Premium Subscription",
                            description: "Unlimited access to all features",
                        },
                        unit_amount: 1999, // $19.99
                    },
                    quantity: 1,
                },
            ],
            success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/payment/cancel`,
            metadata: {
                userId: (session?.user as any)?.id,
            },
            // customer_email: session?.user?.email || undefined,
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error: any) {
        console.error("Stripe error:", error);
        return NextResponse.json(
            { error: "Error creating checkout session" },
            { status: 500 }
        );
    }
}
