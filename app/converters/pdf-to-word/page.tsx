"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUploader } from "@/components/converters/FileUploader"
import { Download, Loader2, FileText } from "lucide-react"
import { ConversionIcon } from "@/components/conversion-icon"
import type { Metadata } from "next"

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleConvert = async () => {
    if (!file) return

    setIsConverting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("from", "pdf")
      formData.append("to", "docx")

      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Conversion failed")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
    } catch (err: any) {
      setError(err.message || "Failed to convert file")
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <ConversionIcon from="PDF" to="DOCX" size="lg" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            PDF to Word Converter
          </h1>
          <p className="text-lg text-muted-foreground">
            Convert your PDF files to editable Word documents (DOCX) instantly.
            Free, secure, and no registration required.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Your PDF File</CardTitle>
            <CardDescription>
              Select a PDF file up to 10MB to convert to Word format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUploader
              onFileSelect={setFile}
              acceptedTypes={["pdf", "application/pdf"]}
            />

            {error && (
              <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              onClick={handleConvert}
              disabled={!file || isConverting}
              className="w-full"
              size="lg"
            >
              {isConverting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                "Convert to Word"
              )}
            </Button>

            {downloadUrl && (
              <Button
                asChild
                variant="outline"
                className="w-full"
                size="lg"
              >
                <a href={downloadUrl} download={`${file?.name.replace(/\.pdf$/i, "")}.docx`}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Word Document
                </a>
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>How to Convert PDF to Word</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>1. Upload your PDF file using the uploader above</p>
              <p>2. Click "Convert to Word" button</p>
              <p>3. Wait for the conversion to complete</p>
              <p>4. Download your converted Word document</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>✓ Supports PDF files up to 10MB</p>
              <p>✓ Converts to editable DOCX format</p>
              <p>✓ Preserves text formatting</p>
              <p>✓ 100% free and secure</p>
              <p>✓ No registration required</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>About PDF to Word Conversion</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              Converting PDF files to Word format allows you to edit and modify
              your documents easily. Our PDF to Word converter extracts text and
              formatting from your PDF files and converts them into editable
              Microsoft Word documents.
            </p>
            <p>
              Whether you need to update a document, extract text from a PDF, or
              make changes to a scanned document, our converter makes it easy.
              Simply upload your PDF file, and within seconds, you'll have an
              editable Word document ready for download.
            </p>
            <p>
              All conversions are performed securely on our servers, and your
              files are automatically deleted after processing. We never store
              your files permanently, ensuring your privacy and security.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

