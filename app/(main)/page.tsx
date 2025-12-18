import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Zap, Lock, Download, CheckCircle, ArrowRight } from "lucide-react"
import { CONVERTERS, SITE_CONFIG } from "@/lib/constants"
import { ConversionIcon } from "@/components/conversion-icon"
import type { Metadata } from "next"
import { auth } from "@/lib/auth"
import { PricingSection } from "@/components/PricingSection"

export const metadata: Metadata = {
  title: "Home - Your All-in-One Content & File Tool",
  description: "Convert files and paraphrase text with ease. Free online PDF, Word, and Image converters plus AI-powered paraphraser.",
  openGraph: {
    title: `${SITE_CONFIG.name} - Your All-in-One Content & File Tool`,
    description: "Convert files and paraphrase text with ease. Free online PDF, Word, and Image converters plus AI-powered paraphraser.",
  },
}

export default async function HomePage() {
  const session = await auth()
  const showPricing = !session || (session.user as any)?.plan !== "premium"

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-24 md:py-32">
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Your All-in-One Content &{" "}
              <span className="text-primary">File Tool</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Convert files between formats and paraphrase text instantly. Fast,
              secure, and completely free—no registration required.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/tools/paraphraser">
                  Start Paraphrasing <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/converters">Browse Converters</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Process files and text in seconds with our optimized algorithms
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Lock className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">100% Secure</h3>
              <p className="text-sm text-muted-foreground">
                All files are processed securely and deleted automatically
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Completely Free</h3>
              <p className="text-sm text-muted-foreground">
                No hidden fees, no subscriptions—use all features for free
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Download className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Registration</h3>
              <p className="text-sm text-muted-foreground">
                Start using immediately without creating an account
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Converters Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Powerful File Converters
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Convert between popular file formats with ease. All conversions
              happen securely in your browser.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CONVERTERS.map((converter) => (
              <Card key={converter.id} className="card-hover">
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
                  <div className="mb-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">
                      Supports: {converter.supportedFormats.join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Output: {converter.outputFormat}
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
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Your File</h3>
              <p className="text-muted-foreground">
                Select your file or paste your text. We support multiple formats
                with no size limits for most tools.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Process & Convert</h3>
              <p className="text-muted-foreground">
                Our advanced algorithms process your content instantly. Watch the
                magic happen in real-time.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Download Results</h3>
              <p className="text-muted-foreground">
                Get your converted file or paraphrased text. Download, copy, or
                convert another file immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Paraphraser Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <Card className="border-2 card-hover">
              <CardHeader className="text-center">
                <div className="flex flex-col items-center">
                  <div className="mb-4 flex justify-center">
                    <FileText className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-center">AI-Powered Paraphraser</CardTitle>
                  <CardDescription className="text-base mt-2 text-center">
                    Transform your text with our advanced paraphrasing tool.
                    Choose from 6 different modes to match your needs.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    {["Standard", "Formal", "Casual", "Academic", "Creative", "Simplify"].map((mode) => (
                      <div key={mode} className="px-3 py-2 bg-muted rounded-md text-center">
                        {mode}
                      </div>
                    ))}
                  </div>
                  <Button asChild className="w-full" size="lg">
                    <Link href="/tools/paraphraser">
                      Try Paraphraser Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {showPricing && <PricingSection className="py-16" />}

      {/* FAQ Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: `Is ${SITE_CONFIG.name} completely free?`,
                  a: "Yes! All our file converters and the basic paraphraser tool are completely free to use. No registration or payment required.",
                },
                {
                  q: "Are my files secure?",
                  a: "Absolutely. All files are processed securely and automatically deleted after conversion. We never store your files permanently.",
                },
                {
                  q: "What file formats do you support?",
                  a: "We support PDF, DOCX, DOC, JPG, PNG, GIF, WEBP, and more. Check each converter page for specific format details.",
                },
                {
                  q: "How many files can I convert per day?",
                  a: "There's no daily limit on file conversions. You can convert as many files as you need.",
                },
                {
                  q: "Do I need to create an account?",
                  a: "No account required! Start converting files and paraphrasing text immediately without registration.",
                },
                {
                  q: "Can I paraphrase long texts?",
                  a: "The free tier allows up to 500 words per paraphrase. Premium plans support longer texts.",
                },
                {
                  q: "What is the maximum file size?",
                  a: "Most converters support files up to 10MB. Larger files may require premium plans.",
                },
              ].map((faq, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground border-none">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg mb-8 text-primary-foreground/90">
                Start converting files and paraphrasing text today. No
                registration required.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/tools/paraphraser">Try Paraphraser</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link href="/converters">Browse Converters</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

