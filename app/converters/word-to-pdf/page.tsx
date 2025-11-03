"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUploader } from "@/components/converters/FileUploader"
import { Download, Loader2 } from "lucide-react"
import { ConversionIcon } from "@/components/conversion-icon"

export default function WordToPdfPage() {
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
      formData.append("from", "docx")
      formData.append("to", "pdf")

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
            <ConversionIcon from="DOCX" to="PDF" size="lg" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Word to PDF Converter
          </h1>
          <p className="text-lg text-muted-foreground">
            Convert your Word documents to PDF format instantly. Free, secure,
            and no registration required.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Your Word Document</CardTitle>
            <CardDescription>
              Select a DOCX file up to 10MB to convert to PDF format. Note: Old .doc format files are not supported - please convert to .docx first.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUploader
              onFileSelect={setFile}
              acceptedTypes={["docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"]}
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
                "Convert to PDF"
              )}
            </Button>

            {downloadUrl && (
              <Button
                asChild
                variant="outline"
                className="w-full"
                size="lg"
              >
                <a href={downloadUrl} download={`${file?.name.replace(/\.(docx?)$/i, "")}.pdf`}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </a>
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>How to Convert Word to PDF</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>1. Upload your Word document using the uploader above</p>
              <p>2. Click "Convert to PDF" button</p>
              <p>3. Wait for the conversion to complete</p>
              <p>4. Download your converted PDF file</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>✓ Supports DOCX and DOC files</p>
              <p>✓ Converts to PDF format</p>
              <p>✓ Preserves formatting and layout</p>
              <p>✓ 100% free and secure</p>
              <p>✓ No registration required</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

