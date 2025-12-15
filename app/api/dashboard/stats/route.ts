import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db/mongodb";
import Conversion from "@/lib/db/models/Conversion";

export async function GET() {
  try {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    const userId = (session?.user as any)?.id;

    if (!session || !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Define query filter based on role
    // Admins see all, Users see only theirs
    const filter = userRole === "admin" ? {} : { userId: userId };

    // Get total conversions
    const totalConversions = await Conversion.countDocuments(filter);

    // Get conversions by type
    const conversionsByType = await Conversion.aggregate([
      { $match: filter },
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
      ...filter,
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Get conversions from previous 30 days for comparison
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const previousPeriodConversions = await Conversion.countDocuments({
      ...filter,
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
    const recentActivity = await Conversion.find(filter)
      .sort({ createdAt: -1 })
      .limit(10)
      .select("conversionType fromFormat toFormat status createdAt fileName");

    // Get success rate
    const successfulConversions = await Conversion.countDocuments({
      ...filter,
      status: "success",
    });
    const failedConversions = await Conversion.countDocuments({
      ...filter,
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
