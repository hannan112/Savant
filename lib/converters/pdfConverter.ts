import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import sharp from "sharp";

/**
 * Convert PDF to images using GraphicsMagick
 */
export async function pdfToImages(
  pdfBytes: Uint8Array,
  format: "jpg" | "png" = "png"
): Promise<Buffer[]> {
  const gm = (await import("gm")).default;
  const fs = await import("fs/promises");
  const path = await import("path");
  const os = await import("os");

  // Create temporary directory for output
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdf-convert-"));
  const inputPath = path.join(tmpDir, "input.pdf");
  const outputPattern = path.join(tmpDir, `output.${format}`);

  try {
    // Write PDF to temp file
    await fs.writeFile(inputPath, Buffer.from(pdfBytes));

    // Convert PDF to images using GraphicsMagick
    await new Promise<void>((resolve, reject) => {
      gm(inputPath)
        .density(150, 150) // Set DPI for better quality
        .quality(90)
        .write(outputPattern, (err) => {
          if (err) reject(err);
          else resolve();
        });
    });

    // Read all generated image files
    const files = await fs.readdir(tmpDir);
    const imageFiles = files
      .filter(f => f.startsWith("output") && (f.endsWith(`.${format}`) || f.endsWith(`.${format === "jpg" ? "jpeg" : format}`)))
      .sort();

    const buffers: Buffer[] = [];
    for (const file of imageFiles) {
      const filePath = path.join(tmpDir, file);
      const buffer = await fs.readFile(filePath);
      buffers.push(buffer);
    }

    if (buffers.length === 0) {
      throw new Error("No images were generated from PDF");
    }

    return buffers;
  } catch (error: any) {
    throw new Error(`Failed to convert PDF to images: ${error.message}`);
  } finally {
    // Clean up temp directory
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error("Failed to clean up temp directory:", cleanupError);
    }
  }
}

/**
 * Convert PDF first page to single image using GraphicsMagick
 */
export async function pdfToImage(
  pdfBytes: Uint8Array,
  format: "jpg" | "png" = "png"
): Promise<Buffer> {
  const gm = (await import("gm")).default;
  const fs = await import("fs/promises");
  const path = await import("path");
  const os = await import("os");

  // Create temporary directory
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdf-convert-"));
  const inputPath = path.join(tmpDir, "input.pdf");
  const outputPath = path.join(tmpDir, `output.${format}`);

  try {
    // Write PDF to temp file
    await fs.writeFile(inputPath, Buffer.from(pdfBytes));

    // Convert first page only
    await new Promise<void>((resolve, reject) => {
      gm(inputPath + "[0]") // [0] means first page only
        .density(150, 150)
        .quality(90)
        .write(outputPath, (err) => {
          if (err) reject(err);
          else resolve();
        });
    });

    // Read the generated image
    const buffer = await fs.readFile(outputPath);
    return buffer;
  } catch (error: any) {
    throw new Error(`Failed to convert PDF to image: ${error.message}`);
  } finally {
    // Clean up temp directory
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error("Failed to clean up temp directory:", cleanupError);
    }
  }
}

/**
 * Create a simple PDF from text content
 */
export async function createPdfFromText(text: string): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const { width, height } = page.getSize();
  const fontSize = 12;
  const margin = 50;
  const maxWidth = width - 2 * margin;
  
  // Simple text wrapping
  const words = text.split(/\s+/);
  let currentLine = "";
  let y = height - margin;
  
  for (const word of words) {
    const testLine = currentLine + (currentLine ? " " : "") + word;
    const textWidth = font.widthOfTextAtSize(testLine, fontSize);
    
    if (textWidth > maxWidth && currentLine) {
      page.drawText(currentLine, {
        x: margin,
        y: y,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      currentLine = word;
      y -= fontSize + 5;
      
      // Add new page if needed
      if (y < margin) {
        const newPage = pdfDoc.addPage();
        y = newPage.getSize().height - margin;
      }
    } else {
      currentLine = testLine;
    }
  }
  
  // Draw remaining text
  if (currentLine) {
    page.drawText(currentLine, {
      x: margin,
      y: y,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
  }
  
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

/**
 * Extract text from PDF using pdfreader (no worker issues, Node.js friendly)
 */
export async function extractPdfText(pdfBytes: Uint8Array): Promise<string> {
  try {
    // Dynamic import for pdfreader
    const { PdfReader } = await import("pdfreader");

    // Convert Uint8Array to Buffer
    const buffer = Buffer.isBuffer(pdfBytes)
      ? pdfBytes
      : Buffer.from(pdfBytes);

    return new Promise((resolve, reject) => {
      let fullText = "";
      const textByPage: { [page: number]: Array<{y: number, text: string}> } = {};

      new PdfReader().parseBuffer(buffer, (err: any, item: any) => {
        if (err) {
          reject(new Error(`PDF parsing error: ${err.message || err}`));
          return;
        }

        if (!item) {
          // End of file - organize text by position
          const pages = Object.keys(textByPage)
            .map(Number)
            .sort((a, b) => a - b);

          fullText = pages.map(page => {
            const items = textByPage[page];
            if (!items || items.length === 0) return "";

            // Sort by Y position (vertical position on page)
            items.sort((a, b) => a.y - b.y);

            // Group items by similar Y positions (same line)
            const lines: string[] = [];
            let currentLine: string[] = [];
            let currentY = items[0].y;
            const lineThreshold = 0.5; // Items within 0.5 units are on same line

            for (const item of items) {
              if (Math.abs(item.y - currentY) > lineThreshold) {
                // New line
                if (currentLine.length > 0) {
                  lines.push(currentLine.join(" "));
                  currentLine = [];
                }
                currentY = item.y;
              }
              currentLine.push(item.text);
            }

            // Add last line
            if (currentLine.length > 0) {
              lines.push(currentLine.join(" "));
            }

            return lines.join("\n");
          }).join("\n\n--- Page Break ---\n\n");

          if (!fullText || fullText.trim().length === 0) {
            reject(new Error(
              "Could not extract text from PDF. The PDF might be scanned or image-based."
            ));
            return;
          }

          resolve(fullText.trim());
          return;
        }

        if (item.text) {
          // Store text with its Y position for proper line ordering
          const page = item.page || 1;
          if (!textByPage[page]) {
            textByPage[page] = [];
          }
          textByPage[page].push({
            y: item.y || 0,
            text: item.text
          });
        }
      });
    });
  } catch (error: any) {
    // Handle specific error cases
    if (error.message && error.message.includes("scanned")) {
      throw error;
    }
    if (error.message && error.message.includes("Invalid PDF")) {
      throw new Error("Invalid PDF file format");
    }
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}
