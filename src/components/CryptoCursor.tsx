"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { CryptoIcon, type CryptoKind } from "@/components/crypto-cursor-icons";

const OFF = -9999;

const KINDS: CryptoKind[] = ["eth", "btc", "sol"];

type EmitterParticle = {
  id: string;
  cx: number;
  cy: number;
  angle: number;
  dist: number;
  kind: CryptoKind;
  spin: number;
};

function spawnBurst(cx: number, cy: number): EmitterParticle[] {
  const n = 7 + Math.floor(Math.random() * 5);
  const base = performance.now();
  return Array.from({ length: n }, (_, i) => {
    const angle = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.9;
    return {
      id: `${base}-${i}`,
      cx,
      cy,
      angle,
      dist: 32 + Math.random() * 52,
      kind: KINDS[Math.floor(Math.random() * KINDS.length)]!,
      spin: (Math.random() - 0.5) * 240,
    };
  });
}

/** Input types that act as controls (not text fields). */
const CLICKABLE_INPUT_TYPES = new Set([
  "button",
  "submit",
  "reset",
  "checkbox",
  "radio",
  "file",
  "image",
  "color",
  "range",
]);

/**
 * True when the hit target is (or is inside) something typically clickable.
 * Opt in extra targets with `data-crypto-cursor-interactive`. Opt out with `data-crypto-cursor-passive`.
 */
function isClickableHit(hit: Element | null): boolean {
  let node: Element | null = hit;
  for (let depth = 0; depth < 22 && node; depth++) {
    if (!(node instanceof HTMLElement)) {
      if (node instanceof SVGAElement && node.hasAttribute("href")) return true;
      node = node.parentElement;
      continue;
    }
    if (node.hasAttribute("data-crypto-cursor-passive")) {
      node = node.parentElement;
      continue;
    }
    if (node.hasAttribute("data-crypto-cursor-interactive")) {
      return true;
    }
    if (node.hasAttribute("disabled") || node.getAttribute("aria-disabled") === "true") {
      node = node.parentElement;
      continue;
    }

    const tag = node.tagName;
    if (tag === "A" && node.hasAttribute("href")) return true;
    if (tag === "BUTTON") return true;
    if (tag === "LABEL") return true;
    if (tag === "SUMMARY") return true;
    if (tag === "SELECT") return true;
    if (tag === "TEXTAREA") return true;
    if (tag === "INPUT") {
      const inp = node as HTMLInputElement;
      if (inp.type !== "hidden" && CLICKABLE_INPUT_TYPES.has(inp.type)) return true;
    }

    const role = node.getAttribute("role");
    if (
      role === "button" ||
      role === "link" ||
      role === "tab" ||
      role === "menuitem" ||
      role === "option" ||
      role === "switch"
    ) {
      return true;
    }

    node = node.parentElement;
  }
  return false;
}

export function CryptoCursor() {
  const [active, setActive] = useState(false);
  const [showFollower, setShowFollower] = useState(false);
  const [overClickable, setOverClickable] = useState(false);
  const [particles, setParticles] = useState<EmitterParticle[]>([]);

  const mx = useMotionValue(OFF);
  const my = useMotionValue(OFF);

  const ringSpring = { stiffness: 95, damping: 22, mass: 0.48 };
  const ringX = useSpring(mx, ringSpring);
  const ringY = useSpring(my, ringSpring);

  const removeParticle = useCallback((id: string) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const onMove = useCallback(
    (e: PointerEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setShowFollower(true);
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const clickable = isClickableHit(hit);
      setOverClickable((prev) => (prev === clickable ? prev : clickable));
    },
    [mx, my],
  );

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    setActive(true);
    document.documentElement.classList.add("crypto-cursor-active");

    const onLeaveWindow = () => {
      setShowFollower(false);
      setOverClickable(false);
      mx.set(OFF);
      my.set(OFF);
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      setParticles((prev) => {
        const burst = spawnBurst(e.clientX, e.clientY);
        const merged = [...prev, ...burst];
        return merged.length > 48 ? merged.slice(-48) : merged;
      });
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);

    return () => {
      document.documentElement.classList.remove("crypto-cursor-active");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
    };
  }, [mx, my, onMove]);

  if (!active) return null;

  return (
    <>
      {showFollower ? (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[10049] flex h-0 w-0 items-center justify-center overflow-visible"
            style={{ x: ringX, y: ringY }}
          >
            <motion.div
              className="h-7 w-7 shrink-0 rounded-full border-[3px] border-primary/50 bg-transparent"
              animate={
                overClickable
                  ? {
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 0 0 1px hsl(var(--primary) / 0.22), 0 0 14px hsl(var(--primary) / 0.32)",
                      "0 0 0 1px hsl(var(--primary) / 0.4), 0 0 26px hsl(var(--primary) / 0.5), 0 0 12px hsl(var(--accent) / 0.28)",
                      "0 0 0 1px hsl(var(--primary) / 0.22), 0 0 14px hsl(var(--primary) / 0.32)",
                    ],
                  }
                  : {
                    scale: 1,
                    boxShadow: "0 0 0 1px hsl(var(--primary) / 0.14), 0 0 14px hsl(var(--primary) / 0.2)",
                  }
              }
              transition={
                overClickable
                  ? { duration: 1.45, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.25, ease: "easeOut" }
              }
            />
          </motion.div>
          <motion.div
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[10050] flex h-0 w-0 items-center justify-center overflow-visible"
            style={{ x: mx, y: my }}
          >
            <motion.div
              className="flex h-3 w-3 shrink-0 items-center justify-center text-primary drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
              animate={overClickable ? { scale: 1.14 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
            >
              <CryptoIcon kind="eth" className="h-full w-full" />
            </motion.div>
          </motion.div>
        </>
      ) : null}

      {particles.map((p) => (
        <motion.div
          key={p.id}
          aria-hidden
          className="pointer-events-none fixed z-[10051] h-3.5 w-3.5"
          style={{
            left: p.cx,
            top: p.cy,
            marginLeft: -7,
            marginTop: -7,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
          animate={{
            x: Math.cos(p.angle) * p.dist,
            y: Math.sin(p.angle) * p.dist + 16,
            opacity: 0,
            scale: 0.12,
            rotate: p.spin,
          }}
          transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => removeParticle(p.id)}
        >
          <CryptoIcon kind={p.kind} className="h-full w-full" />
        </motion.div>
      ))}
    </>
  );
}
