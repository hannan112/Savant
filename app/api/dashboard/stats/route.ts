import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db/mongodb";
import Conversion from "@/lib/db/models/Conversion";

export async function GET() {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get total conversions
    const totalConversions = await Conversion.countDocuments();

    // Get conversions by type
    const conversionsByType = await Conversion.aggregate([
      {
        $group: {
          _id: "$conversionType",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get recent conversions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentConversions = await Conversion.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Get conversions from previous 30 days for comparison
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const previousPeriodConversions = await Conversion.countDocuments({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
    });

    // Calculate percentage change
    const changePercent =
      previousPeriodConversions === 0
        ? 100
        : ((recentConversions - previousPeriodConversions) /
            previousPeriodConversions) *
          100;

    // Get recent activity (last 10 conversions)
    const recentActivity = await Conversion.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("conversionType fromFormat toFormat status createdAt fileName");

    // Get success rate
    const successfulConversions = await Conversion.countDocuments({
      status: "success",
    });
    const failedConversions = await Conversion.countDocuments({
      status: "failed",
    });

    return NextResponse.json({
      stats: {
        totalConversions,
        recentConversions,
        changePercent: changePercent.toFixed(1),
        successRate:
          totalConversions > 0
            ? ((successfulConversions / totalConversions) * 100).toFixed(1)
            : 0,
      },
      conversionsByType: conversionsByType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>),
      recentActivity: recentActivity.map((conv) => ({
        id: conv._id,
        type: conv.conversionType,
        from: conv.fromFormat,
        to: conv.toFormat,
        status: conv.status,
        fileName: conv.fileName,
        createdAt: conv.createdAt,
      })),
      summary: {
        successful: successfulConversions,
        failed: failedConversions,
        total: totalConversions,
      },
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats", details: error.message },
      { status: 500 }
    );
  }
}
