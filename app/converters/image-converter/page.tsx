"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUploader } from "@/components/converters/FileUploader"
import { Download, Loader2 } from "lucide-react"
import { ConversionIcon } from "@/components/conversion-icon"

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [outputFormat, setOutputFormat] = useState<string>("jpg")
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
      formData.append("from", "image")
      formData.append("to", outputFormat)

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
            <ConversionIcon from="JPG" to="PNG" size="lg" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Image Format Converter
          </h1>
          <p className="text-lg text-muted-foreground">
            Convert images between JPG, PNG, WebP, and GIF formats. Free,
            secure, and instant conversion.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Convert Your Image</CardTitle>
            <CardDescription>
              Select an image file and choose your desired output format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUploader
              onFileSelect={setFile}
              acceptedTypes={["image/jpeg", "image/png", "image/webp", "image/gif"]}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Output Format</label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jpg">JPG (JPEG)</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                  <SelectItem value="gif">GIF</SelectItem>
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
                "Convert Image"
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
                  download={`${file?.name.replace(/\.[^/.]+$/, "")}.${outputFormat}`}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Converted Image
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
              <p>✓ Input: JPG, PNG, WebP, GIF</p>
              <p>✓ Output: JPG, PNG, WebP, GIF</p>
              <p>✓ Maximum file size: 10MB</p>
              <p>✓ High-quality conversion</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why Use Our Converter?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>✓ Fast and instant conversion</p>
              <p>✓ Preserves image quality</p>
              <p>✓ 100% free to use</p>
              <p>✓ No registration required</p>
              <p>✓ Secure file processing</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

