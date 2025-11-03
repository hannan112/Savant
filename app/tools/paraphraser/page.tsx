"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ParaphraserInput } from "@/components/paraphraser/ParaphraserInput"
import { ParaphraserOutput } from "@/components/paraphraser/ParaphraserOutput"
import { ModeSelector } from "@/components/paraphraser/ModeSelector"
import { Loader2, Sparkles } from "lucide-react"
import { PARAPHRASE_MODES, FREE_DAILY_PARAPHRASE_LIMIT, MAX_PARAPHRASE_WORDS } from "@/lib/constants"
import type { Metadata } from "next"

export default function ParaphraserPage() {
  const [text, setText] = useState("")
  const [mode, setMode] = useState("standard")
  const [isParaphrasing, setIsParaphrasing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const wordCount = text.split(/\s+/).filter(Boolean).length
  const canParaphrase = wordCount >= 10 && wordCount <= MAX_PARAPHRASE_WORDS && !isParaphrasing

  const handleParaphrase = async () => {
    if (!canParaphrase) return

    setIsParaphrasing(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/paraphrase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, mode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to paraphrase text")
      }

      setResult(data.paraphrased)
    } catch (err: any) {
      setError(err.message || "Failed to paraphrase text. Please try again.")
    } finally {
      setIsParaphrasing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            AI-Powered Text Paraphraser
          </h1>
          <p className="text-lg text-muted-foreground">
            Transform your text with our advanced paraphrasing tool. Choose from
            6 different modes to match your needs.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Paraphrase Your Text</CardTitle>
            <CardDescription>
              Enter your text and select a paraphrasing mode to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ModeSelector value={mode} onChange={setMode} />

            <ParaphraserInput value={text} onChange={setText} />

            {error && (
              <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              onClick={handleParaphrase}
              disabled={!canParaphrase}
              className="w-full"
              size="lg"
            >
              {isParaphrasing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Paraphrasing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Paraphrase Text
                </>
              )}
            </Button>

            {result && <ParaphraserOutput text={result} />}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Paraphrasing Modes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {PARAPHRASE_MODES.map((m) => (
                <div key={m.value}>
                  <h4 className="font-medium">{m.label}</h4>
                  <p className="text-sm text-muted-foreground">
                    {m.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>✓ Free tier: {FREE_DAILY_PARAPHRASE_LIMIT} paraphrases per day</p>
              <p>✓ Maximum {MAX_PARAPHRASE_WORDS} words per paraphrase</p>
              <p>✓ 6 different paraphrasing modes</p>
              <p>✓ Powered by Google Gemini Flash 1.5</p>
              <p>✓ Instant results</p>
              <p>✓ Copy or download paraphrased text</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What is Paraphrasing?</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              Paraphrasing is the process of rewording or rephrasing a piece of
              text while maintaining its original meaning. It's an essential
              skill for writers, students, and professionals who want to express
              ideas in different ways.
            </p>
            <p>
              Our AI-powered paraphrasing tool uses advanced natural language
              processing to understand your text and rewrite it in different
              ways. Whether you need a formal tone for a business document, a
              casual style for a blog post, or simplified language for clarity,
              our tool can help.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

