import { NextRequest, NextResponse } from "next/server";
import { convertImageFormat, imageToPdfSingle, imagesToPdf } from "@/lib/converters/imageConverter";
import { docxToPdf } from "@/lib/converters/docxConverter";
import { pdfToDocx } from "@/lib/converters/pdfToDocx";
import { createPdfFromText } from "@/lib/converters/pdfConverter";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { trackConversion } from "@/lib/tracking";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  let file: File | null = null;
  let files: File[] = [];
  let from: string = "";
  let to: string = "";

  try {
    const formData = await request.formData();
    file = formData.get("file") as File | null;
    from = formData.get("from") as string;
    to = formData.get("to") as string;
    files = formData.getAll("files") as File[];

    if ((!file && !files.length) || !from || !to) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let outputBuffer: Buffer;
    let mimeType: string;
    let extension: string;
    let fileName: string;

    // Handle Word to PDF conversion
    if (from === "docx" || from === "doc") {
      if (!file) {
        return NextResponse.json(
          { error: "File is required" },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
          { status: 400 }
        );
      }

      if (to === "pdf") {
        const buffer = Buffer.from(await file.arrayBuffer());
        outputBuffer = await docxToPdf(buffer);
        mimeType = "application/pdf";
        extension = "pdf";
        fileName = file.name.replace(/\.[^/.]+$/, "") + ".pdf";
      } else {
        return NextResponse.json(
          { error: `Conversion from ${from} to ${to} not supported` },
          { status: 400 }
        );
      }
    }
    // Handle PDF to Word conversion
    else if (from === "pdf" && to === "docx") {
      if (!file) {
        return NextResponse.json(
          { error: "File is required" },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
          { status: 400 }
        );
      }

      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        outputBuffer = await pdfToDocx(buffer);
        mimeType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        extension = "docx";
        fileName = file.name.replace(/\.pdf$/i, "") + ".docx";
      } catch (error: any) {
        return NextResponse.json(
          {
            error:
              error.message ||
              "Failed to convert PDF to Word. The PDF might be scanned or image-based.",
          },
          { status: 500 }
        );
      }
    }
    // Handle PDF to Image conversion
    else if (from === "pdf" && (to === "jpg" || to === "png")) {
      if (!file) {
        return NextResponse.json(
          { error: "File is required" },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
          { status: 400 }
        );
      }

      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const { pdfToImage } = await import("@/lib/converters/pdfConverter");
        const format = to as "jpg" | "png";
        outputBuffer = await pdfToImage(buffer, format);
        mimeType = `image/${format === "jpg" ? "jpeg" : format}`;
        extension = format === "jpg" ? "jpeg" : format;
        fileName = file.name.replace(/\.pdf$/i, "") + `.${format}`;
      } catch (error: any) {
        return NextResponse.json(
          {
            error:
              error.message ||
              "Failed to convert PDF to image. The PDF might be corrupted.",
          },
          { status: 500 }
        );
      }
    }
    // Handle Image to PDF conversion
    else if (
      (from === "image" || from.startsWith("image/")) &&
      to === "pdf"
    ) {
      if (files.length > 0) {
        // Multiple images
        const imageBuffers = await Promise.all(
          files.map(async (f) => {
            if (f.size > MAX_FILE_SIZE) {
              throw new Error(
                `File ${f.name} exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`
              );
            }
            return Buffer.from(await f.arrayBuffer());
          })
        );

        const imagesWithBuffers = imageBuffers.map((buffer) => ({ buffer }));
        outputBuffer = await imagesToPdf(imagesWithBuffers);
        mimeType = "application/pdf";
        extension = "pdf";
        fileName = "combined.pdf";
      } else if (file) {
        // Single image
        if (file.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
            { status: 400 }
          );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        outputBuffer = await imageToPdfSingle(buffer);
        mimeType = "application/pdf";
        extension = "pdf";
        fileName = file.name.replace(/\.[^/.]+$/, "") + ".pdf";
      } else {
        return NextResponse.json(
          { error: "File or files are required" },
          { status: 400 }
        );
      }
    }
    // Handle Image format conversion
    else if (
      from === "image" ||
      from.startsWith("image/") ||
      ["jpg", "jpeg", "png", "webp", "gif"].includes(from.toLowerCase())
    ) {
      if (!file) {
        return NextResponse.json(
          { error: "File is required" },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
          { status: 400 }
        );
      }

      const format = to as "jpg" | "png" | "webp" | "gif";
      const buffer = Buffer.from(await file.arrayBuffer());
      outputBuffer = await convertImageFormat(buffer, format);
      mimeType = `image/${format === "jpg" ? "jpeg" : format}`;
      extension = format === "jpg" ? "jpeg" : format;
      fileName = file.name.replace(/\.[^/.]+$/, "") + `.${format}`;
    } else {
      return NextResponse.json(
        { error: `Conversion from ${from} to ${to} not supported yet` },
        { status: 400 }
      );
    }

    // Track successful conversion
    const duration = Date.now() - startTime;
    const actualFile = file || files[0];

    // Await tracking to ensure it completes before returning response
    try {
      await trackConversion({
        conversionType: `${from}-to-${to}`,
        fromFormat: from,
        toFormat: to,
        fileName: actualFile?.name || "unknown",
        fileSize: actualFile?.size || 0,
        status: "success",
        duration,
        ipAddress,
        userAgent,
      });
      console.log("[Convert] Conversion tracked successfully");
    } catch (trackingError: any) {
      console.error("[Convert] Tracking failed - conversion still succeeds:", {
        error: trackingError.message,
        type: `${from}-to-${to}`,
        fileName: actualFile?.name,
      });
      // Don't fail the conversion if tracking fails
    }

    return new NextResponse(
      (outputBuffer as Buffer).buffer.slice(
        (outputBuffer as Buffer).byteOffset,
        (outputBuffer as Buffer).byteOffset + (outputBuffer as Buffer).byteLength
      ) as ArrayBuffer,
      {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    }
    );
  } catch (error: any) {
    console.error("Conversion error:", error);

    // Track failed conversion
    const actualFile = file || files?.[0];
    if (actualFile) {
      try {
        await trackConversion({
          conversionType: `${from}-to-${to}`,
          fromFormat: from,
          toFormat: to,
          fileName: actualFile.name,
          fileSize: actualFile.size,
          status: "failed",
          errorMessage: error.message,
          duration: Date.now() - startTime,
          ipAddress,
          userAgent,
        });
        console.log("[Convert] Failed conversion tracked successfully");
      } catch (trackingError: any) {
        console.error("[Convert] Tracking failed conversion failed:", {
          error: trackingError.message,
          type: `${from}-to-${to}`,
        });
        // Don't fail the error response if tracking fails
      }
    }

    return NextResponse.json(
      { error: error.message || "Failed to convert file" },
      { status: 500 }
    );
  }
}
