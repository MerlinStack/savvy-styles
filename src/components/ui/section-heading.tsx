import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: { href: string; label: string };
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  tone = "light",
  align = "left",
  className,
}: SectionHeadingProps) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p
            className={cn(
              "eyebrow",
              dark ? "text-gold-light" : "text-gold-deep",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            "text-section-title mt-4",
            dark ? "text-paper" : "text-ink",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-4 max-w-xl text-sm leading-relaxed",
              dark ? "text-paper/65" : "text-ink/65",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className={cn(
            "link-underline eyebrow shrink-0 pb-1",
            dark ? "text-paper" : "text-ink",
          )}
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
