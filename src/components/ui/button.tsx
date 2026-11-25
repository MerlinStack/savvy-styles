import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export const buttonVariants = {
  primary: "bg-ink text-paper hover:bg-espresso",
  secondary:
    "border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  inverse: "bg-paper text-ink hover:bg-sand",
  ghost:
    "border border-paper/35 text-paper hover:border-paper hover:bg-paper hover:text-ink",
  quiet: "px-0 text-ink hover:text-gold-deep",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;

const base =
  "inline-flex min-h-11 items-center justify-center gap-2.5 px-6 text-[0.68rem] font-medium uppercase tracking-[0.22em] transition-colors duration-300 disabled:pointer-events-none disabled:opacity-45";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
}

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(base, buttonVariants[variant], className)}
      {...props}
    />
  );
}

interface ButtonLinkProps {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
  prefetch?: boolean;
  onClick?: ComponentProps<typeof Link>["onClick"];
  "aria-label"?: string;
  "aria-disabled"?: boolean;
  target?: string;
  rel?: string;
}

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  prefetch,
  target,
  rel,
  onClick,
  ...rest
}: ButtonLinkProps) {
  const external = href.startsWith("http");

  return (
    <Link
      href={href}
      prefetch={prefetch}
      target={target ?? (external ? "_blank" : undefined)}
      rel={rel ?? (external ? "noreferrer noopener" : undefined)}
      onClick={onClick}
      className={cn(base, buttonVariants[variant], className)}
      {...rest}
    >
      {children}
    </Link>
  );
}
