"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUploader } from "@/components/converters/FileUploader"
import { Download, Loader2 } from "lucide-react"
import { ConversionIcon } from "@/components/conversion-icon"

export default function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null)
  const [format, setFormat] = useState<string>("jpg")
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
      formData.append("to", format)

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
            <ConversionIcon from="PDF" to="JPG" size="lg" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            PDF to Image Converter
          </h1>
            <p className="text-lg text-muted-foreground">
            Convert PDF pages to JPG or PNG images. Extract images from PDF
            files instantly. Note: Full PDF to image conversion requires canvas library support.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Convert PDF to Image</CardTitle>
            <CardDescription>
              Select a PDF file and choose your desired image format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUploader
              onFileSelect={setFile}
              acceptedTypes={["pdf", "application/pdf"]}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Output Format</label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jpg">JPG (JPEG)</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                "Convert to Image"
              )}
            </Button>

            {downloadUrl && (
              <Button
                asChild
                variant="outline"
                className="w-full"
                size="lg"
              >
                <a
                  href={downloadUrl}
                  download={`${file?.name.replace(/\.pdf$/i, "")}.${format}`}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Image
                </a>
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Supported Formats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>✓ Input: PDF files</p>
              <p>✓ Output: JPG, PNG</p>
              <p>✓ Maximum file size: 10MB</p>
              <p>✓ High-quality conversion</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>✓ Convert entire PDF or specific pages</p>
              <p>✓ Choose image quality</p>
              <p>✓ Fast processing</p>
              <p>✓ 100% free to use</p>
              <p>✓ No registration required</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

