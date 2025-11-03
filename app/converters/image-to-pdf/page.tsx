"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUploader } from "@/components/converters/FileUploader"
import { Download, Loader2, Plus, X } from "lucide-react"
import { ConversionIcon } from "@/components/conversion-icon"

export default function ImageToPdfPage() {
  const [files, setFiles] = useState<File[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (file: File) => {
    if (files.length < 10) {
      setFiles([...files, file])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleConvert = async () => {
    if (files.length === 0) return

    setIsConverting(true)
    setError(null)

    try {
      const formData = new FormData()
      
      // Add all files
      if (files.length === 1) {
        // Single image
        formData.append("file", files[0])
        formData.append("from", "image")
      } else {
        // Multiple images
        files.forEach((file) => {
          formData.append("files", file)
        })
        formData.append("from", "image")
      }
      
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
      setError(err.message || "Failed to convert files")
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <ConversionIcon from="JPG" to="PDF" size="lg" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Image to PDF Converter
          </h1>
          <p className="text-lg text-muted-foreground">
            Combine multiple images into a single PDF document. Free, secure,
            and instant.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Images</CardTitle>
            <CardDescription>
              Upload up to 10 images (JPG, PNG, GIF, WebP) to combine into a PDF
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {files.length < 10 && (
              <FileUploader
                onFileSelect={handleFileSelect}
                acceptedTypes={["image/jpeg", "image/png", "image/gif", "image/webp"]}
              />
            )}

            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Images ({files.length}/10)</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="relative border rounded-md p-2 flex items-center justify-between"
                    >
                      <span className="text-sm truncate flex-1">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              onClick={handleConvert}
              disabled={files.length === 0 || isConverting}
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
                <a href={downloadUrl} download="combined.pdf">
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
              <CardTitle>How to Convert Images to PDF</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>1. Upload one or more images using the uploader</p>
              <p>2. Arrange images in the desired order</p>
              <p>3. Click "Convert to PDF" button</p>
              <p>4. Download your combined PDF document</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>✓ Supports JPG, PNG, GIF, WebP</p>
              <p>✓ Combine multiple images</p>
              <p>✓ Custom page size options</p>
              <p>✓ Preserves image quality</p>
              <p>✓ 100% free and secure</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

