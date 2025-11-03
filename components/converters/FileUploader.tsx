"use client"

import { useCallback, useState } from "react"
import { Upload, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { MAX_FILE_SIZE } from "@/lib/constants"

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  acceptedTypes?: string[]
  maxSize?: number
  className?: string
}

export function FileUploader({
  onFileSelect,
  acceptedTypes = [],
  maxSize = MAX_FILE_SIZE,
  className,
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size exceeds ${(maxSize / 1024 / 1024).toFixed(0)}MB limit`
    }
    if (acceptedTypes.length > 0) {
      const fileType = file.type || file.name.split(".").pop()?.toLowerCase()
      const isValid = acceptedTypes.some((type) =>
        fileType?.includes(type.toLowerCase())
      )
      if (!isValid) {
        return `File type not supported. Accepted: ${acceptedTypes.join(", ")}`
      }
    }
    return null
  }

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }
      setError(null)
      setFile(file)
      onFileSelect(file)
    },
    [onFileSelect, maxSize, acceptedTypes]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        handleFile(droppedFile)
      }
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        handleFile(selectedFile)
      }
    },
    [handleFile]
  )

  const removeFile = useCallback(() => {
    setFile(null)
    setError(null)
  }, [])

  return (
    <div className={cn("space-y-4", className)}>
      <Card
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "cursor-pointer transition-colors",
          isDragging && "border-primary bg-primary/5",
          error && "border-destructive"
        )}
      >
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          {file ? (
            <div className="flex items-center gap-4">
              <FileText className="h-12 w-12 text-primary" />
              <div className="flex-1 text-left">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="mb-2 text-lg font-medium">
                Drag & drop your file here
              </p>
              <p className="mb-4 text-sm text-muted-foreground">
                or click to browse
              </p>
              <Button type="button" variant="outline" asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Choose File
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept={acceptedTypes.join(",")}
                    onChange={handleFileInput}
                  />
                </label>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

