import Link from "next/link";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  align?: "start" | "center";
  className?: string;
  action?: { label: string; href: string };
};

export function SectionHeading({
  title,
  subtitle,
  align = "start",
  className,
  action,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-wrap items-end justify-between gap-4",
        align === "center" && "flex-col text-center",
        className
      )}
    >
      <div>
        <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-300 md:text-3xl">{title}</h2>
        <div
          className={cn(
            "mt-2 h-1 w-16 rounded-full bg-emerald-500",
            align === "center" && "mx-auto"
          )}
        />
        {subtitle && (
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">{subtitle}</p>
        )}
      </div>
      {action && (
        <Link href={action.href} className="text-sm font-semibold text-blue-800 hover:underline">
          {action.label} →
        </Link>
      )}
    </div>
  );
}
