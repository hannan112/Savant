import { extractPdfText } from "./pdfConverter";
import { createDocxFromText } from "./docxConverter";

/**
 * Convert PDF to DOCX
 */
export async function pdfToDocx(pdfBuffer: Buffer | Uint8Array): Promise<Buffer> {
  try {
    // Convert Buffer to Uint8Array if needed (pdfjs-dist requires Uint8Array)
    const pdfBytes = pdfBuffer instanceof Buffer 
      ? new Uint8Array(pdfBuffer) 
      : pdfBuffer;
    
    // Extract text from PDF
    const text = await extractPdfText(pdfBytes);
    
    if (!text || text.trim().length === 0) {
      throw new Error(
        "Could not extract text from PDF. The PDF might be scanned or image-based."
      );
    }
    
    // Create DOCX from extracted text
    const docxBuffer = await createDocxFromText(text);
    return docxBuffer;
  } catch (error: any) {
    throw new Error(`Failed to convert PDF to DOCX: ${error.message}`);
  }
}

