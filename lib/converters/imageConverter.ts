import sharp from "sharp";
import { PDFDocument } from "pdf-lib";

/**
 * Convert image to different format
 */
export async function convertImageFormat(
  buffer: Buffer,
  format: "jpg" | "jpeg" | "png" | "webp" | "gif"
): Promise<Buffer> {
  let pipeline = sharp(buffer);

  switch (format) {
    case "jpg":
    case "jpeg":
      pipeline = pipeline.jpeg({ quality: 90 });
      break;
    case "png":
      pipeline = pipeline.png({ quality: 90 });
      break;
    case "webp":
      pipeline = pipeline.webp({ quality: 90 });
      break;
    case "gif":
      pipeline = pipeline.gif();
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  return pipeline.toBuffer();
}

/**
 * Convert single image to PDF
 */
export async function imageToPdfSingle(buffer: Buffer): Promise<Buffer> {
  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();
    
    if (!metadata.width || !metadata.height) {
      throw new Error("Invalid image dimensions");
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([metadata.width, metadata.height]);
    
    // Convert image to PNG for embedding
    const pngBuffer = await image.png().toBuffer();
    const pngImage = await pdfDoc.embedPng(pngBuffer);
    
    page.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: metadata.width,
      height: metadata.height,
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (error) {
    throw new Error(`Failed to convert image to PDF: ${error}`);
  }
}

/**
 * Convert multiple images to PDF
 */
export async function imagesToPdf(
  images: Array<{ buffer: Buffer; width?: number; height?: number }>
): Promise<Buffer> {
  try {
    const pdfDoc = await PDFDocument.create();
    
    for (const imageData of images) {
      const image = sharp(imageData.buffer);
      const metadata = await image.metadata();
      
      const width = imageData.width || metadata.width || 612;
      const height = imageData.height || metadata.height || 792;
      
      const page = pdfDoc.addPage([width, height]);
      
      // Convert image to PNG for embedding
      const pngBuffer = await image.png().toBuffer();
      const pngImage = await pdfDoc.embedPng(pngBuffer);
      
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: width,
        height: height,
      });
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (error) {
    throw new Error(`Failed to convert images to PDF: ${error}`);
  }
}
