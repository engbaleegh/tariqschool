import Link from "next/link";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  href?: string;
  className?: string;
};

export default function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  href,
  className,
}: StatCardProps) {
  const changeColors = {
    positive: "text-emerald-600 bg-emerald-50",
    negative: "text-red-600 bg-red-50",
    neutral: "text-slate-600 bg-slate-100",
  };

  const content = (
    <>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
          {change && (
            <span
              className={cn(
                "mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium",
                changeColors[changeType]
              )}
            >
              {change}
            </span>
          )}
        </div>
        {icon && (
          <div className="admin-stat-icon flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            {icon}
          </div>
        )}
      </div>
    </>
  );

  const classes = cn(
    "admin-stat-card rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300",
    href && "hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
