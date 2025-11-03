"use client";

import { useState } from "react";
import { SITE_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface EmbedCodeProps {
  label?: string;
  code: string;
}

export function EmbedCode({ label = "Embed code", code }: EmbedCodeProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (_error) {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{label}</div>
      <Textarea
        value={code}
        readOnly
        className="font-mono text-sm min-h-[140px]"
        aria-label={label}
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Includes an attribution link to {SITE_CONFIG.name}</span>
        <Button size="sm" onClick={handleCopy}>
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  );
}


