import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";

export async function POST() {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Upgrade the user to Premium
        await User.findOneAndUpdate(
            { email: session.user.email },
            { plan: "premium" }
        );

        console.log(`[Mock Payment] Upgraded user ${session.user.email} to premium`);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Mock payment error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
