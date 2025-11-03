import { SITE_CONFIG, CONVERTERS } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmbedCode } from "@/components/seo/EmbedCode";
import { AttributionBadge } from "@/components/seo/AttributionBadge";

export const dynamic = "force-static";

export default function AttributionPage() {
  const homepageUrl = SITE_CONFIG.url;
  const featuredConverter = CONVERTERS?.[0]?.href || "/converters";
  const converterUrl = `${SITE_CONFIG.url}${featuredConverter}?utm_source=embed&utm_medium=badge&utm_campaign=attribution`;

  const badgeHtml = `<a href="${homepageUrl}" title="${SITE_CONFIG.name}">Powered by ${SITE_CONFIG.name}</a>`;

  const buttonHtml = `<a href="${converterUrl}" target="_blank">Convert files with ${SITE_CONFIG.name}</a>`;

  const jsonLdAttribution = `{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "${SITE_CONFIG.name}",
  "url": "${homepageUrl}",
  "creator": {
    "@type": "Organization",
    "name": "${SITE_CONFIG.name}",
    "url": "${homepageUrl}"
  }
}`;

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Attribution & Embeds</h1>
      <p className="text-muted-foreground max-w-2xl">
        Help your readers discover fast, secure file conversion. Use these snippets to add a
        small attribution or a call-to-action button. These include a backlink to {SITE_CONFIG.name}.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attribution badge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AttributionBadge />
            <EmbedCode label="HTML" code={badgeHtml} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Call-to-action button</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <a
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              href={converterUrl}
              target="_blank"
              rel="noopener"
            >
              Convert files with {SITE_CONFIG.name}
            </a>
            <EmbedCode label="HTML" code={buttonHtml} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Structured data (optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you cite us in a post, you can optionally include this JSON-LD alongside your link.
            </p>
            <EmbedCode label="JSON-LD" code={jsonLdAttribution} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


