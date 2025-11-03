import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

interface AttributionBadgeProps {
  className?: string;
}

export function AttributionBadge({ className }: AttributionBadgeProps) {
  return (
    <Link
      href={SITE_CONFIG.url}
      className={`inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs hover:bg-accent ${className || ""}`}
      aria-label={`Powered by ${SITE_CONFIG.name}`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z" />
      </svg>
      <span>Powered by {SITE_CONFIG.name}</span>
    </Link>
  );
}


