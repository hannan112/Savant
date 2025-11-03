"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MAX_PARAPHRASE_WORDS } from "@/lib/constants"

interface ParaphraserInputProps {
  value: string
  onChange: (value: string) => void
}

export function ParaphraserInput({ value, onChange }: ParaphraserInputProps) {
  const wordCount = value.split(/\s+/).filter(Boolean).length
  const isOverLimit = wordCount > MAX_PARAPHRASE_WORDS

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="paraphraser-input">Enter text to paraphrase</Label>
        <span
          className={`text-sm ${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}
        >
          {wordCount} / {MAX_PARAPHRASE_WORDS} words
        </span>
      </div>
      <Textarea
        id="paraphraser-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type or paste your text here..."
        className="min-h-[300px] resize-none"
        maxLength={10000}
      />
      {isOverLimit && (
        <p className="text-sm text-destructive">
          Text exceeds {MAX_PARAPHRASE_WORDS} word limit. Please reduce the
          length.
        </p>
      )}
    </div>
  )
}

