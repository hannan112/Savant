import mammoth from "mammoth";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Document, Packer, Paragraph, TextRun } from "docx";

/**
 * Convert DOCX to text
 */
export async function docxToText(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error: any) {
    // If it's a .doc file (old format), mammoth can't handle it
    if (error.message && error.message.includes("Invalid file")) {
      throw new Error(
        "Old .doc format files are not supported. Please convert to .docx format first."
      );
    }
    throw new Error(`Failed to extract text from DOCX file: ${error.message}`);
  }
}

/**
 * Convert DOCX to HTML
 */
export async function docxToHtml(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.convertToHtml({ buffer });
    return result.value;
  } catch (error) {
    throw new Error("Failed to convert DOCX to HTML");
  }
}

/**
 * Sanitize text to remove characters not supported by WinAnsi encoding
 */
function sanitizeTextForPdf(text: string): string {
  // Map common Unicode characters to ASCII equivalents
  const charMap: { [key: string]: string } = {
    '\u2192': '->',     // →
    '\u2190': '<-',     // ←
    '\u2191': '^',      // ↑
    '\u2193': 'v',      // ↓
    '\u2022': '*',      // •
    '\u2013': '-',      // –
    '\u2014': '--',     // —
    '\u201C': '"',      // "
    '\u201D': '"',      // "
    '\u2018': "'",      // '
    '\u2019': "'",      // '
    '\u2026': '...',    // …
    '\u20AC': 'EUR',    // €
    '\u00A3': 'GBP',    // £
    '\u00A5': 'JPY',    // ¥
    '\u00A9': '(c)',    // ©
    '\u00AE': '(R)',    // ®
    '\u2122': '(TM)',   // ™
    '\u00B0': ' degrees', // °
    '\u00B1': '+/-',    // ±
    '\u00D7': 'x',      // ×
    '\u00F7': '/',      // ÷
  };

  // Replace known characters
  let sanitized = text;
  for (const [unicode, ascii] of Object.entries(charMap)) {
    sanitized = sanitized.replace(new RegExp(unicode, 'g'), ascii);
  }

  // Remove any remaining non-WinAnsi characters (keep only printable ASCII + basic Latin-1)
  sanitized = sanitized.replace(/[^\x20-\x7E\xA0-\xFF]/g, '');

  return sanitized;
}

/**
 * Convert DOCX text to PDF
 */
export async function docxToPdf(buffer: Buffer): Promise<Buffer> {
  try {
    // Extract text from DOCX
    const text = await docxToText(buffer);

    if (!text || text.trim().length === 0) {
      throw new Error("Document appears to be empty or couldn't extract text");
    }

    // Sanitize text to remove unsupported characters
    const sanitizedText = sanitizeTextForPdf(text);

    // Create PDF from text
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let currentPage = pdfDoc.addPage([612, 792]); // US Letter size

    const { width, height } = currentPage.getSize();
    const fontSize = 12;
    const lineHeight = fontSize + 5;
    const paragraphSpacing = lineHeight * 0.5; // Extra space between paragraphs
    const margin = 50;
    const maxWidth = width - 2 * margin;
    let y = height - margin;

    // Split text into paragraphs (preserve paragraph structure)
    const paragraphs = sanitizedText
      .split(/\n\s*\n/)
      .filter(p => p.trim().length > 0);

    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i].trim();

      // Split paragraph into lines based on wrapping
      const words = paragraph.split(/\s+/);
      let currentLine = "";

      for (const word of words) {
        const testLine = currentLine + (currentLine ? " " : "") + word;

        try {
          const textWidth = font.widthOfTextAtSize(testLine, fontSize);

          if (textWidth > maxWidth && currentLine) {
            // Draw current line
            try {
              // Add new page if needed
              if (y < margin) {
                currentPage = pdfDoc.addPage([612, 792]);
                y = currentPage.getSize().height - margin;
              }

              currentPage.drawText(currentLine, {
                x: margin,
                y: y,
                size: fontSize,
                font: font,
                color: rgb(0, 0, 0),
              });

              y -= lineHeight;
            } catch (drawError) {
              console.warn('Skipped line with unsupported characters');
            }

            currentLine = word;
          } else {
            currentLine = testLine;
          }
        } catch (widthError) {
          // Skip word with unsupported characters
          continue;
        }
      }

      // Draw remaining text from paragraph
      if (currentLine) {
        try {
          // Add new page if needed
          if (y < margin) {
            currentPage = pdfDoc.addPage([612, 792]);
            y = currentPage.getSize().height - margin;
          }

          currentPage.drawText(currentLine, {
            x: margin,
            y: y,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
          });

          y -= lineHeight;
        } catch (drawError) {
          console.warn('Skipped final line with unsupported characters');
        }
      }

      // Add paragraph spacing (except for last paragraph)
      if (i < paragraphs.length - 1) {
        y -= paragraphSpacing;
      }
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (error: any) {
    throw new Error(`Failed to convert DOCX to PDF: ${error.message}`);
  }
}

/**
 * Create DOCX file from text
 */
export async function createDocxFromText(text: string): Promise<Buffer> {
  try {
    // Split text into paragraphs (by double newlines or single newlines)
    const paragraphs = text
      .split(/\n\s*\n/)
      .filter((p) => p.trim().length > 0)
      .map((paragraph) => {
        // Split paragraph into lines and create text runs
        const lines = paragraph.split("\n");
        const children = lines.flatMap((line, index) => {
          const runs = [
            new TextRun({
              text: line.trim(),
              size: 24, // 12pt in half-points
            }),
          ];
          
          // Add line break if not the last line
          if (index < lines.length - 1) {
            runs.push(new TextRun({ text: "", break: 1 }));
          }
          
          return runs;
        });
        
        return new Paragraph({
          children: children.length > 0 ? children : [new TextRun({ text: " " })],
        });
      });
    
    // If no paragraphs found, create one with all text
    const finalParagraphs =
      paragraphs.length > 0
        ? paragraphs
        : [
            new Paragraph({
              children: [
                new TextRun({
                  text: text.trim(),
                  size: 24,
                }),
              ],
            }),
          ];
    
    const doc = new Document({
      sections: [
        {
          children: finalParagraphs,
        },
      ],
    });
    
    const buffer = await Packer.toBuffer(doc);
    return buffer;
  } catch (error: any) {
    throw new Error(`Failed to create DOCX from text: ${error.message}`);
  }
}
