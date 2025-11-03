# NextFile Converter & Paraphraser

A professional, SEO-optimized, production-ready Next.js 14+ web application that serves as a multi-tool platform for file conversion and text paraphrasing.

## Features

- **5 File Converters:**
  - PDF to Word
  - Word to PDF
  - PDF to Image
  - Image to PDF
  - Image Format Converter (JPG, PNG, WebP, GIF)

- **AI-Powered Paraphraser:**
  - 6 paraphrasing modes (Standard, Formal, Casual, Academic, Creative, Simplify)
  - Powered by Google Gemini Flash 1.5
  - Free tier: 500 words per paraphrase, 5 paraphrases per day

- **Complete CMS:**
  - Blog system with Payload CMS
  - SEO-optimized blog posts
  - Media library management

- **Analytics Dashboard:**
  - Conversion statistics
  - Usage analytics
  - Recent activity feed

- **SEO Optimized:**
  - Dynamic sitemap generation
  - Robots.txt configuration
  - Structured data (JSON-LD)
  - Open Graph and Twitter Card tags
  - Mobile-responsive design

## Technology Stack

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS + shadcn/ui components
- **CMS:** Payload CMS (self-hosted, TypeScript-native)
- **AI Integration:** Google Gemini Flash 1.5 API
- **File Processing:**
  - pdf-lib (PDF manipulation)
  - sharp (Image processing)
  - mammoth (DOCX processing)
  - xlsx (Excel files)
- **Form Handling:** React Hook Form + Zod validation
- **SEO:** next-sitemap, next-seo

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (for Payload CMS)
- Google Gemini API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/nextfile-converter.git
cd nextfile-converter
```

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

3. Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

4. Fill in your environment variables:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
PAYLOAD_SECRET=your_secret_key_here
MONGODB_URI=mongodb://localhost:27017/nextfile
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
nextfile-converter/
├── app/
│   ├── (main)/              # Main pages (home, about, contact, etc.)
│   ├── converters/          # File converter pages
│   ├── tools/               # Tool pages (paraphraser)
│   ├── dashboard/           # Dashboard pages
│   ├── api/                 # API routes
│   └── blog/                # Blog pages
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Header, Footer
│   ├── converters/          # Converter components
│   ├── paraphraser/         # Paraphraser components
│   └── dashboard/           # Dashboard components
├── lib/
│   ├── converters/          # Conversion utilities
│   ├── paraphraser/         # Paraphrasing utilities
│   └── utils.ts             # Utility functions
└── public/                  # Static assets
```

## Environment Variables

See `.env.local.example` for all required environment variables.

### Required

- `GOOGLE_API_KEY` - Google Gemini API key for paraphrasing
- `PAYLOAD_SECRET` - Secret key for Payload CMS
- `MONGODB_URI` - MongoDB connection string

### Optional

- `RESEND_API_KEY` - For email functionality
- `NEXT_PUBLIC_GA_ID` - Google Analytics tracking ID
- `NEXT_PUBLIC_SITE_URL` - Site URL for SEO

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The project is compatible with any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted (Docker, etc.)

## Building for Production

```bash
npm run build
npm start
```

## Features in Detail

### File Converters

All converters support:
- Drag & drop file upload
- File size validation (max 10MB)
- Progress indicators
- Error handling
- Download converted files

### Paraphraser Tool

- **6 Paraphrasing Modes:**
  - Standard: Balanced paraphrasing
  - Formal: Professional tone
  - Casual: Conversational style
  - Academic: Scholarly language
  - Creative: Varied phrasing
  - Simplify: Easier to understand

- **Features:**
  - Real-time word counter
  - Copy to clipboard
  - Download as TXT
  - Rate limiting (5 per day for free tier)

### Blog System

- SEO-optimized blog posts
- Category management
- Featured images
- Auto-generated table of contents
- Related posts section

### SEO Optimization

- Dynamic sitemap generation
- Robots.txt configuration
- Structured data (JSON-LD):
  - Organization
  - WebSite with SearchAction
  - BreadcrumbList
  - HowTo (for converters & paraphraser)
  - FAQPage
  - BlogPosting
- Open Graph tags
- Twitter Card tags
- Canonical URLs

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, email support@nextfile-converter.com or visit our [contact page](/contact).

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Payload CMS](https://payloadcms.com/) - Headless CMS
- [Google Gemini](https://gemini.google.com/) - AI API
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
# Savant
