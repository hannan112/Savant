import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Conversion from "@/lib/db/models/Conversion";

export async function GET() {
  try {
    // Test database connection
    console.log("[Test] Attempting to connect to MongoDB...");
    await connectDB();
    console.log("[Test] MongoDB connection successful");

    // Count total conversions
    const totalCount = await Conversion.countDocuments();
    console.log("[Test] Total conversions in database:", totalCount);

    // Get recent conversions
    const recentConversions = await Conversion.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      success: true,
      connected: true,
      totalConversions: totalCount,
      recentConversions: recentConversions.map((conv: any) => ({
        id: conv._id,
        type: conv.conversionType,
        fileName: conv.fileName,
        status: conv.status,
        createdAt: conv.createdAt,
      })),
      message: "Database connection successful",
    });
  } catch (error: any) {
    console.error("[Test] Database connection failed:", error);
    return NextResponse.json(
      {
        success: false,
        connected: false,
        error: error.message,
        message: "Database connection failed. Check MongoDB is running and MONGODB_URI is correct.",
      },
      { status: 500 }
    );
  }
}

