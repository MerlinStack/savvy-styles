import { cn } from "@/lib/cn";

export function AvailabilityBadge({
  label,
  tone = "light",
}: {
  label: string;
  tone?: "light" | "dark";
}) {
  const isPreorder = label === "Pre-order";
  const isSoldOut = label === "Sold out";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 text-[0.55rem] font-medium uppercase tracking-[0.18em]",
        tone === "dark"
          ? "bg-paper/10 text-paper/75"
          : isPreorder
            ? "bg-ink text-gold-light"
            : isSoldOut
              ? "bg-sand text-ink/55"
              : "bg-sand text-ink/70",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1 rounded-full",
          isSoldOut ? "bg-stone" : isPreorder ? "bg-gold-light" : "bg-gold-deep",
        )}
      />
      {label}
    </span>
  );
}
