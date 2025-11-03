export const SITE_CONFIG = {
  name: "Savant",
  description: "Your All-in-One Content & File Tool - Convert files and paraphrase text with ease",
  url: "https://nextfile-converter.com",
  ogImage: "/og-image.jpg",
  author: "Savant Team",
}

export const CONVERTERS = [
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Convert PDF files to editable Word documents (DOCX)",
    icon: "📄",
    href: "/converters/pdf-to-word",
    supportedFormats: ["PDF"],
    outputFormat: "DOCX",
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    description: "Convert Word documents to PDF format",
    icon: "📝",
    href: "/converters/word-to-pdf",
    supportedFormats: ["DOCX", "DOC"],
    outputFormat: "PDF",
  },
  {
    id: "pdf-to-image",
    name: "PDF to Image",
    description: "Convert PDF pages to JPG or PNG images",
    icon: "🖼️",
    href: "/converters/pdf-to-image",
    supportedFormats: ["PDF"],
    outputFormat: "JPG, PNG",
  },
  {
    id: "image-to-pdf",
    name: "Image to PDF",
    description: "Combine multiple images into a single PDF",
    icon: "📑",
    href: "/converters/image-to-pdf",
    supportedFormats: ["JPG", "PNG", "GIF", "WEBP"],
    outputFormat: "PDF",
  },
  {
    id: "image-converter",
    name: "Image Converter",
    description: "Convert images between JPG, PNG, WebP, and GIF formats",
    icon: "🔄",
    href: "/converters/image-converter",
    supportedFormats: ["JPG", "PNG", "GIF", "WEBP"],
    outputFormat: "JPG, PNG, WEBP, GIF",
  },
]

export const PARAPHRASE_MODES = [
  {
    value: "standard",
    label: "Standard",
    description: "Balanced paraphrasing maintaining original meaning",
  },
  {
    value: "formal",
    label: "Formal/Professional",
    description: "Professional and business-appropriate tone",
  },
  {
    value: "casual",
    label: "Casual/Conversational",
    description: "Friendly and conversational style",
  },
  {
    value: "academic",
    label: "Academic/Scholarly",
    description: "Scholarly and research-oriented language",
  },
  {
    value: "creative",
    label: "Creative/Varied",
    description: "More varied and creative phrasing",
  },
  {
    value: "simplify",
    label: "Simplify/Easy Reading",
    description: "Simplified for easier understanding",
  },
] as const

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const MAX_PARAPHRASE_WORDS = 500
export const FREE_DAILY_PARAPHRASE_LIMIT = 5

