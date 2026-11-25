import { cn } from "@/lib/cn";

interface MarqueeProps {
  items: readonly string[];
  className?: string;
  tone?: "light" | "dark";
}

/**
 * Announcement strip. The visual track is hidden from assistive technology and
 * the same messages are exposed once in a static screen-reader paragraph.
 */
export function Marquee({ items, className, tone = "dark" }: MarqueeProps) {
  const separator = (
    <span
      aria-hidden="true"
      className={cn(
        "mx-6 inline-block size-1 shrink-0 rounded-full align-middle",
        tone === "dark" ? "bg-gold" : "bg-gold-deep",
      )}
    />
  );

  return (
    <div className={cn("marquee", className)}>
      <p className="sr-only">{items.join(". ")}</p>
      <div className="marquee-track" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((item) => (
              <span key={`${copy}-${item}`} className="flex items-center">
                <span className="whitespace-nowrap">{item}</span>
                {separator}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
