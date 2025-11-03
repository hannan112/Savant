import type { Metadata } from "next"
import { SITE_CONFIG } from "@/lib/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Zap, Lock, Heart } from "lucide-react"

export const metadata: Metadata = {
  title: `About Us - ${SITE_CONFIG.name}`,
  description: `Learn about ${SITE_CONFIG.name}, our mission, values, and commitment to providing free, secure file conversion and paraphrasing tools.`,
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">About Us</h1>
          <p className="text-lg text-muted-foreground">
            Your trusted partner for file conversion and text paraphrasing
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              At {SITE_CONFIG.name}, our mission is to make file conversion and text
              paraphrasing accessible to everyone. We believe that powerful
              tools should be free, easy to use, and secure. Our platform
              provides a comprehensive suite of file conversion tools and an
              AI-powered paraphrasing tool to help you work more efficiently.
            </p>
            <p>
              We're committed to delivering high-quality services without
              compromising on privacy or security. All files are processed
              securely and automatically deleted after conversion, ensuring your
              data remains private and protected.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Why Choose {SITE_CONFIG.name}?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <strong>Fast & Efficient:</strong> Our optimized algorithms
                process files and text in seconds, not minutes.
              </p>
              <p>
                <strong>100% Free:</strong> All our tools are completely free
                to use with no hidden fees or subscriptions.
              </p>
              <p>
                <strong>Secure & Private:</strong> Your files are processed
                securely and deleted automatically after conversion.
              </p>
              <p>
                <strong>No Registration:</strong> Start using our tools
                immediately without creating an account.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <strong>Privacy First:</strong> We never store your files
                permanently and respect your privacy.
              </p>
              <p>
                <strong>User-Centric:</strong> We design our tools with users
                in mind, focusing on ease of use and functionality.
              </p>
              <p>
                <strong>Transparency:</strong> We're transparent about how our
                tools work and how we handle your data.
              </p>
              <p>
                <strong>Innovation:</strong> We continuously improve our tools
                to provide the best experience possible.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Our Commitment</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We're committed to providing reliable, secure, and free tools for
              file conversion and text paraphrasing. Our team works tirelessly
              to ensure that our platform remains fast, secure, and
              user-friendly.
            </p>
            <p>
              Whether you're a student, professional, or casual user, we're
              here to help you work more efficiently. If you have any questions,
              suggestions, or feedback, please don't hesitate to{" "}
              <a href="/contact" className="text-primary hover:underline">
                contact us
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

