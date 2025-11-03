import type { Metadata } from "next"
import { SITE_CONFIG } from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: `Terms of Service - ${SITE_CONFIG.name}`,
  description: "Read our terms of service to understand the rules and guidelines for using our file conversion and paraphrasing services.",
}

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              By accessing and using {SITE_CONFIG.name} ("the
              Service"), you accept and agree to be bound by the terms and
              provision of this agreement. If you do not agree to abide by the
              above, please do not use this service.
            </p>
            <p>
              These Terms of Service ("Terms") govern your access to and use of
              our website and services. Please read these Terms carefully
              before using our services.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Description of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              {SITE_CONFIG.name} provides file conversion and text
              paraphrasing services through our website. Our services include:
            </p>
            <ul>
              <li>File format conversion (PDF, Word, Images, etc.)</li>
              <li>AI-powered text paraphrasing</li>
              <li>Related tools and utilities</li>
            </ul>
            <p>
              We reserve the right to modify, suspend, or discontinue any
              aspect of our services at any time, with or without notice.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Accounts and Registration</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              Most of our services can be used without creating an account.
              However, certain features may require registration. When you
              create an account, you agree to:
            </p>
            <ul>
              <li>
                Provide accurate, current, and complete information during
                registration
              </li>
              <li>
                Maintain and promptly update your account information
              </li>
              <li>
                Maintain the security of your password and account
              </li>
              <li>
                Accept responsibility for all activities that occur under your
                account
              </li>
              <li>
                Notify us immediately of any unauthorized use of your account
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Acceptable Use Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>You agree not to use our services to:</p>
            <ul>
              <li>
                Violate any local, state, national, or international law or
                regulation
              </li>
              <li>
                Transmit any content that is unlawful, harmful, threatening,
                abusive, harassing, defamatory, vulgar, obscene, or otherwise
                objectionable
              </li>
              <li>
                Infringe upon any intellectual property rights, including
                copyrights, trademarks, or patents
              </li>
              <li>
                Upload or transmit any viruses, malware, or other harmful code
              </li>
              <li>
                Attempt to gain unauthorized access to our systems or interfere
                with the proper working of our services
              </li>
              <li>
                Use automated systems (bots, scrapers, etc.) to access our
                services without permission
              </li>
              <li>
                Resell or redistribute our services without our written consent
              </li>
              <li>
                Use our services for any commercial purpose that competes with
                or harms our business
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Intellectual Property Rights</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              All content, features, and functionality of our services,
              including but not limited to text, graphics, logos, icons,
              images, audio clips, and software, are the exclusive property of
              {SITE_CONFIG.name} or its licensors and are
              protected by copyright, trademark, and other intellectual property
              laws.
            </p>
            <p>
              You may not reproduce, distribute, modify, create derivative works
              of, publicly display, publicly perform, republish, download, store,
              or transmit any of the material on our website without our prior
              written consent.
            </p>
            <p>
              Files and content you upload remain your property. However, by
              uploading content, you grant us a limited license to use, store,
              and process your content solely for the purpose of providing our
              services to you.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, {SITE_CONFIG.name.toUpperCase()} &
              PARAPHRASER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
              PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR
              ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
            <p>
              Our services are provided "as is" and "as available" without
              warranties of any kind, either express or implied. We do not
              guarantee that:
            </p>
            <ul>
              <li>Our services will be uninterrupted or error-free</li>
              <li>
                The results obtained from using our services will be accurate or
                reliable
              </li>
              <li>
                Any errors in our services will be corrected
              </li>
            </ul>
            <p>
              We are not responsible for any loss or damage that may result
              from your use of our services or reliance on the results produced
              by our services.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Indemnification</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              You agree to indemnify, defend, and hold harmless {SITE_CONFIG.name}, its officers, directors, employees,
              agents, and affiliates from any claims, liabilities, damages,
              losses, costs, or expenses (including reasonable attorneys' fees)
              arising out of or relating to:
            </p>
            <ul>
              <li>Your use of our services</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Your violation of any applicable laws or regulations</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Termination</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We reserve the right to terminate or suspend your access to our
              services immediately, without prior notice or liability, for any
              reason, including but not limited to:
            </p>
            <ul>
              <li>Your breach of these Terms</li>
              <li>Your violation of any applicable law or regulation</li>
              <li>Your use of our services in an illegal or harmful manner</li>
              <li>Extended periods of inactivity</li>
            </ul>
            <p>
              Upon termination, your right to use our services will immediately
              cease. We may delete your account and all associated data.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We reserve the right to modify these Terms at any time. We will
              notify you of any changes by posting the new Terms on this page
              and updating the "Last updated" date. Your continued use of our
              services after any changes indicates your acceptance of the
              updated Terms.
            </p>
            <p>
              It is your responsibility to review these Terms periodically for
              any changes. If you do not agree to the modified Terms, you must
              stop using our services.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the jurisdiction in which {SITE_CONFIG.name} operates, without regard to its conflict of law
              provisions.
            </p>
            <p>
              Any disputes arising out of or relating to these Terms or our
              services shall be subject to the exclusive jurisdiction of the
              courts in that jurisdiction.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <ul>
              <li>Email: legal@nextfile-converter.com</li>
              <li>Website: /contact</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

