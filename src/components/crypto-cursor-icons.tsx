"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/** Compact Ethereum mark (cursor + particles). */
export function IconEth({ className }: { className?: string }) {
  return (
    <svg className={cn(className)} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
    </svg>
  );
}

/** Bitcoin-style mark: orange disk + ₿ */
export function IconBtc({ className }: { className?: string }) {
  return (
    <svg className={cn(className)} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#F7931A" />
      <text
        x="12"
        y="16.2"
        textAnchor="middle"
        fill="white"
        fontSize="13"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        ₿
      </text>
    </svg>
  );
}

/** Solana-inspired tilted bars (gradient). */
export function IconSol({ className }: { className?: string }) {
  const gradId = useId().replace(/:/g, "");
  return (
    <svg className={cn(className)} viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9945FF" />
          <stop offset="100%" stopColor="#14F195" />
        </linearGradient>
      </defs>
      <g transform="translate(12 12) rotate(-11) translate(-12 -12)">
        <rect x="3" y="6" width="18" height="2.8" rx="1" fill={`url(#${gradId})`} />
        <rect x="3" y="10.6" width="18" height="2.8" rx="1" fill="#14F195" opacity={0.95} />
        <rect x="3" y="15.2" width="18" height="2.8" rx="1" fill="#9945FF" opacity={0.9} />
      </g>
    </svg>
  );
}

export type CryptoKind = "eth" | "btc" | "sol";

export function CryptoIcon({ kind, className }: { kind: CryptoKind; className?: string }) {
  switch (kind) {
    case "btc":
      return <IconBtc className={className} />;
    case "sol":
      return <IconSol className={className} />;
    default:
      return <IconEth className={cn("text-primary", className)} />;
  }
}
