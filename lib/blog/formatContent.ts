/**
 * Formats plain text content into properly structured HTML with paragraphs and line breaks
 */
export function formatBlogContent(content: string): string {
  if (!content) return "";
  
  // If content already contains HTML structure (including embeds)
  if (/(<p\b|<h1\b|<h2\b|<h3\b|<h4\b|<ul\b|<ol\b|<blockquote\b|<pre\b|<code\b|<img\b|<iframe\b)/i.test(content)) {
    // Allow only safe iframe embeds (YouTube). Strip any other iframes for safety.
    const sanitized = content.replace(/<iframe[\s\S]*?<\/iframe>/gi, (match) => {
      const srcMatch = match.match(/src=\"([^\"]+)\"/i);
      const src = srcMatch?.[1] || "";
      const isYouTube = /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com)\/embed\//i.test(src);
      return isYouTube ? match : "";
    });

    // Ensure proper spacing between common block elements
    return sanitized
      .replace(/<\/p>\s*<p>/g, "</p>\n\n<p>")
      .replace(/<\/h([1-6])>\s*<p>/g, "</h$1>\n\n<p>")
      .replace(/<\/h([1-6])>\s*<h([1-6])>/g, "</h$1>\n\n<h$2>")
      .replace(/<p>\s*<\/p>/g, "") // Remove empty paragraphs
      .trim();
  }
  
  // Plain text - convert to HTML with proper formatting
  // First normalize line endings
  let normalized = content
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");
  
  // Split into paragraphs (double newlines) or sections
  let paragraphs = normalized.split(/\n\s*\n+/);
  
  let formatted = paragraphs
    .map(paragraph => {
      const trimmed = paragraph.trim();
      if (!trimmed) return "";
      
      // Check if it looks like a heading (short line, potentially all caps, ends with colon, or is very short)
      const lines = trimmed.split("\n");
      if (lines.length === 1) {
        const line = trimmed;
        // Potential heading indicators
        const isHeading = 
          (line.length < 80 && (line.toUpperCase() === line || line.endsWith(":") || /^[A-Z]/.test(line))) ||
          line.length < 50;
        
        if (isHeading && !line.includes(".") && !line.match(/^[a-z]/)) {
          // Likely a heading - use h2
          return `<h2>${escapeHtml(line)}</h2>`;
        }
      }
      
      // Regular paragraph - format with proper line breaks within
      const paraText = trimmed
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join(" ");
      
      if (!paraText) return "";
      
      return `<p>${formattedParagraph(paraText)}</p>`;
    })
    .filter(p => p.length > 0) // Remove empty strings
    .join("\n\n");
  
  return formatted;
}

/**
 * Escapes HTML characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Formats a single paragraph, preserving line breaks within it
 */
function formattedParagraph(text: string): string {
  // First escape HTML to prevent XSS
  let formatted = escapeHtml(text);
  
  // Convert markdown-style bold/italic to HTML (after escaping)
  formatted = formatted
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Convert markdown-style links
    .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  return formatted;
}

