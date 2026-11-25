"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { cn } from "@/lib/cn";

interface ParallaxMediaProps {
  src: string;
  alt: string;
  className?: string;
  position?: string;
  sizes?: string;
  /** Loads the image immediately. Use only above the fold. */
  eager?: boolean;
}

/**
 * A restrained scroll parallax. The media layer is oversized so the transform
 * never exposes an edge, and the effect is skipped entirely for visitors who
 * prefer reduced motion. ScrollTrigger is loaded only when needed.
 */
export function ParallaxMedia({
  src,
  alt,
  className,
  position = "center",
  sizes = "(max-width: 1024px) 100vw, 58vw",
  eager = false,
}: ParallaxMediaProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const layer = layerRef.current;
    if (!frame || !layer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const tween = gsap.fromTo(
        layer,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );

      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className={cn("relative overflow-hidden bg-sand", className)}
    >
      <div ref={layerRef} className="absolute inset-x-0 -top-[6%] h-[112%]">
        <Image
          src={src}
          alt={alt}
          fill
          loading={eager ? "eager" : "lazy"}
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition: position }}
        />
      </div>
    </div>
  );
}
