import type { Metadata } from "next"
import { SITE_CONFIG } from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: `Privacy Policy - ${SITE_CONFIG.name}`,
  description: "Read our privacy policy to understand how we collect, use, and protect your personal information and files.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              At {SITE_CONFIG.name} ("we," "our," or "us"), we
              respect your privacy and are committed to protecting your personal
              information. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our website
              and services.
            </p>
            <p>
              By using our website and services, you agree to the collection
              and use of information in accordance with this Privacy Policy. If
              you do not agree with this Privacy Policy, please do not use our
              services.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <h3>Files You Upload</h3>
            <p>
              When you use our file conversion services, you may upload files to
              our servers. These files are temporarily stored for processing
              purposes only. We automatically delete all uploaded files within 24
              hours of processing, or immediately after you download your
              converted file.
            </p>

            <h3>Text You Submit</h3>
            <p>
              When you use our paraphrasing tool, you may submit text for
              processing. This text is sent to our AI service provider (Google
              Gemini) for processing. We do not permanently store the text you
              submit or the paraphrased results.
            </p>

            <h3>Usage Information</h3>
            <p>
              We collect information about how you use our services, including:
            </p>
            <ul>
              <li>Pages you visit on our website</li>
              <li>Features you use</li>
              <li>Time and date of your visits</li>
              <li>Device information (browser type, operating system)</li>
              <li>IP address (anonymized when possible)</li>
            </ul>

            <h3>Cookies and Tracking Technologies</h3>
            <p>
              We use cookies and similar tracking technologies to track activity
              on our website and store certain information. Cookies are files
              with a small amount of data that may include an anonymous unique
              identifier. You can instruct your browser to refuse all cookies or
              to indicate when a cookie is being sent.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>We use the information we collect for the following purposes:</p>
            <ul>
              <li>
                <strong>Service Provision:</strong> To provide, maintain, and
                improve our file conversion and paraphrasing services
              </li>
              <li>
                <strong>Processing Files:</strong> To convert your files
                between different formats
              </li>
              <li>
                <strong>Paraphrasing Text:</strong> To paraphrase your text
                using our AI-powered tools
              </li>
              <li>
                <strong>Communication:</strong> To respond to your inquiries,
                provide customer support, and send you updates about our
                services
              </li>
              <li>
                <strong>Analytics:</strong> To understand how our services are
                used and to improve user experience
              </li>
              <li>
                <strong>Security:</strong> To protect against fraud, abuse, and
                security threats
              </li>
              <li>
                <strong>Legal Compliance:</strong> To comply with applicable
                laws, regulations, and legal processes
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal information and files from unauthorized
              access, alteration, disclosure, or destruction. However, no
              method of transmission over the internet or electronic storage is
              100% secure. While we strive to use commercially acceptable means
              to protect your information, we cannot guarantee its absolute
              security.
            </p>
            <p>
              All files uploaded to our servers are automatically deleted after
              processing. We do not retain your files permanently. Text
              submitted for paraphrasing is processed by our AI service
              provider but is not stored by us after processing is complete.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We use third-party services to provide our services, including:
            </p>
            <ul>
              <li>
                <strong>Google Gemini API:</strong> For paraphrasing
                functionality. Text submitted is sent to Google's servers for
                processing. Please review Google's privacy policy for information
                about how they handle your data.
              </li>
              <li>
                <strong>Cloud Hosting:</strong> Our services are hosted on
                third-party cloud infrastructure. These providers have access to
                your information as necessary to provide their services.
              </li>
              <li>
                <strong>Analytics:</strong> We may use analytics services to
                understand how our website is used. These services may use
                cookies and similar technologies.
              </li>
            </ul>
            <p>
              We encourage you to review the privacy policies of these
              third-party services to understand how they collect, use, and
              share your information.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>Depending on your location, you may have the following rights:</p>
            <ul>
              <li>
                <strong>Right to Access:</strong> You can request information
                about the personal data we hold about you
              </li>
              <li>
                <strong>Right to Rectification:</strong> You can request
                correction of inaccurate or incomplete personal data
              </li>
              <li>
                <strong>Right to Erasure:</strong> You can request deletion of
                your personal data
              </li>
              <li>
                <strong>Right to Restrict Processing:</strong> You can request
                that we limit the processing of your personal data
              </li>
              <li>
                <strong>Right to Data Portability:</strong> You can request a
                copy of your personal data in a structured format
              </li>
              <li>
                <strong>Right to Object:</strong> You can object to the
                processing of your personal data for certain purposes
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information
              provided in the "Contact Us" section below.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              Our services are not intended for children under the age of 13. We
              do not knowingly collect personal information from children under
              13. If you are a parent or guardian and believe that your child
              has provided us with personal information, please contact us, and
              we will delete such information.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We may update our Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date. You are advised
              to review this Privacy Policy periodically for any changes.
            </p>
            <p>
              Changes to this Privacy Policy are effective when they are posted
              on this page. Your continued use of our services after any changes
              indicates your acceptance of the updated Privacy Policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              If you have any questions about this Privacy Policy or our
              privacy practices, please contact us:
            </p>
            <ul>
              <li>Email: privacy@nextfile-converter.com</li>
              <li>Website: /contact</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

