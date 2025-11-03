import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { CONVERTERS } from "@/lib/constants"
import { ConversionIcon } from "@/components/conversion-icon"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "File Converters - Convert Files Online Free",
  description: "Convert files between PDF, Word, and Image formats. Free online file converters with no registration required.",
}

export default function ConvertersPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            File Converters
          </h1>
          <p className="text-lg text-muted-foreground">
            Convert files between popular formats. Free, secure, and instant.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CONVERTERS.map((converter) => (
            <Card key={converter.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mb-4 flex justify-center">
                  <ConversionIcon 
                    from={converter.supportedFormats} 
                    to={converter.outputFormat.split(',')[0].trim()} 
                    size="lg"
                  />
                </div>
                <CardTitle className="text-center">{converter.name}</CardTitle>
                <CardDescription className="text-center">{converter.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 space-y-2 text-center">
                  <p className="text-sm text-muted-foreground">
                    <strong>Supported formats:</strong> {converter.supportedFormats.join(", ")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Output format:</strong> {converter.outputFormat}
                  </p>
                </div>
                <Button asChild className="w-full">
                  <Link href={converter.href}>
                    Convert Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-12">
          <CardHeader>
            <CardTitle>About Our File Converters</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              Our file converters allow you to convert files between different
              formats instantly. All conversions are performed securely on our
              servers, and your files are automatically deleted after
              processing.
            </p>
            <p>
              Whether you need to convert PDF to Word, Word to PDF, or convert
              between different image formats, our tools make it easy. No
              registration required, completely free, and secure.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
