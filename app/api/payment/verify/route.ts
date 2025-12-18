import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
});

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
        return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    try {
        // 1. Retrieve the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // 2. Check payment status
        if (session.payment_status !== "paid") {
            return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
        }

        // 3. Get userId from metadata
        const userId = session.metadata?.userId;
        if (!userId) {
            return NextResponse.json({ error: "No user ID found in session" }, { status: 400 });
        }

        // 4. Update user in database
        await connectDB();
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { plan: "premium" },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, plan: updatedUser.plan });
    } catch (error: any) {
        console.error("Payment verification error:", error);
        return NextResponse.json(
            { error: "Verification failed", details: error.message },
            { status: 500 }
        );
    }
}
