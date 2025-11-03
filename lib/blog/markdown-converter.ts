/**
 * Converts Markdown text to HTML for Tiptap editor
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return "";
  
  // Split into lines for better processing
  const lines = markdown.split('\n');
  const result: string[] = [];
  let inOrderedList = false;
  let inUnorderedList = false;
  let currentParagraph: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Empty line - close current paragraph/list
    if (!trimmed) {
      if (currentParagraph.length > 0) {
        result.push('<p>' + currentParagraph.join(' ') + '</p>');
        currentParagraph = [];
      }
      if (inOrderedList) {
        result.push('</ol>');
        inOrderedList = false;
      }
      if (inUnorderedList) {
        result.push('</ul>');
        inUnorderedList = false;
      }
      continue;
    }
    
    // Headers
    if (trimmed.startsWith('### ')) {
      if (currentParagraph.length > 0) {
        result.push('<p>' + currentParagraph.join(' ') + '</p>');
        currentParagraph = [];
      }
      if (inOrderedList) {
        result.push('</ol>');
        inOrderedList = false;
      }
      if (inUnorderedList) {
        result.push('</ul>');
        inUnorderedList = false;
      }
      result.push('<h3>' + trimmed.substring(4) + '</h3>');
      continue;
    }
    
    if (trimmed.startsWith('## ')) {
      if (currentParagraph.length > 0) {
        result.push('<p>' + currentParagraph.join(' ') + '</p>');
        currentParagraph = [];
      }
      if (inOrderedList) {
        result.push('</ol>');
        inOrderedList = false;
      }
      if (inUnorderedList) {
        result.push('</ul>');
        inUnorderedList = false;
      }
      result.push('<h2>' + trimmed.substring(3) + '</h2>');
      continue;
    }
    
    if (trimmed.startsWith('# ')) {
      if (currentParagraph.length > 0) {
        result.push('<p>' + currentParagraph.join(' ') + '</p>');
        currentParagraph = [];
      }
      if (inOrderedList) {
        result.push('</ol>');
        inOrderedList = false;
      }
      if (inUnorderedList) {
        result.push('</ul>');
        inUnorderedList = false;
      }
      result.push('<h1>' + trimmed.substring(2) + '</h1>');
      continue;
    }
    
    // Ordered list
    const orderedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (orderedMatch) {
      if (currentParagraph.length > 0) {
        result.push('<p>' + currentParagraph.join(' ') + '</p>');
        currentParagraph = [];
      }
      if (inUnorderedList) {
        result.push('</ul>');
        inUnorderedList = false;
      }
      if (!inOrderedList) {
        result.push('<ol>');
        inOrderedList = true;
      }
      result.push('<li>' + processInlineMarkdown(orderedMatch[1]) + '</li>');
      continue;
    }
    
    // Unordered list
    const unorderedMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (unorderedMatch) {
      if (currentParagraph.length > 0) {
        result.push('<p>' + currentParagraph.join(' ') + '</p>');
        currentParagraph = [];
      }
      if (inOrderedList) {
        result.push('</ol>');
        inOrderedList = false;
      }
      if (!inUnorderedList) {
        result.push('<ul>');
        inUnorderedList = true;
      }
      result.push('<li>' + processInlineMarkdown(unorderedMatch[1]) + '</li>');
      continue;
    }
    
    // Blockquote
    if (trimmed.startsWith('> ')) {
      if (currentParagraph.length > 0) {
        result.push('<p>' + currentParagraph.join(' ') + '</p>');
        currentParagraph = [];
      }
      if (inOrderedList) {
        result.push('</ol>');
        inOrderedList = false;
      }
      if (inUnorderedList) {
        result.push('</ul>');
        inUnorderedList = false;
      }
      result.push('<blockquote>' + processInlineMarkdown(trimmed.substring(2)) + '</blockquote>');
      continue;
    }
    
    // Regular paragraph content
    if (inOrderedList) {
      result.push('</ol>');
      inOrderedList = false;
    }
    if (inUnorderedList) {
      result.push('</ul>');
      inUnorderedList = false;
    }
    
    currentParagraph.push(processInlineMarkdown(trimmed));
  }
  
  // Close any remaining lists/paragraphs
  if (currentParagraph.length > 0) {
    result.push('<p>' + currentParagraph.join(' ') + '</p>');
  }
  if (inOrderedList) {
    result.push('</ol>');
  }
  if (inUnorderedList) {
    result.push('</ul>');
  }
  
  return result.join('\n');
}

/**
 * Process inline markdown (bold, italic, links, code)
 */
function processInlineMarkdown(text: string): string {
  if (!text) return "";
  
  let html = text;
  
  // Bold and Italic (***text***)
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  
  // Bold (**text**)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Italic (*text*)
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Inline code `code`
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  return html;
}
