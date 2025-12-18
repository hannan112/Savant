import connectDB from "@/lib/db/mongodb";
import Conversion from "@/lib/db/models/Conversion";

interface TrackConversionParams {
  conversionType: string;
  fromFormat: string;
  toFormat: string;
  fileName: string;
  fileSize: number;
  status: "success" | "failed";
  errorMessage?: string;
  duration?: number;
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
}

export async function trackConversion(params: TrackConversionParams) {
  try {
    console.log("[Tracking] Starting conversion tracking...", {
      type: params.conversionType,
      fileName: params.fileName,
    });

    await connectDB();
    console.log("[Tracking] Database connected successfully");

    const result = await Conversion.create({
      conversionType: params.conversionType,
      fromFormat: params.fromFormat,
      toFormat: params.toFormat,
      fileName: params.fileName,
      fileSize: params.fileSize,
      status: params.status,
      errorMessage: params.errorMessage,
      duration: params.duration,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      userId: params.userId,
    });

    console.log("[Tracking] Conversion tracked successfully:", {
      id: result._id,
      type: params.conversionType,
      status: params.status,
    });

    return result;
  } catch (error: any) {
    // Log detailed error information
    console.error("[Tracking] Failed to track conversion:", {
      error: error.message,
      stack: error.stack,
      params: {
        conversionType: params.conversionType,
        fromFormat: params.fromFormat,
        toFormat: params.toFormat,
        fileName: params.fileName,
      },
    });

    // Re-throw so the caller knows tracking failed
    throw error;
  }
}
