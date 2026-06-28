import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type QuickLinkCardProps = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export function QuickLinkCard({ href, label, icon: Icon }: QuickLinkCardProps) {
  return (
    <Link href={href} className="home-quick-link group">
      <span className="home-quick-link-icon">
        <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" aria-hidden />
      </span>
      <span className="text-xs font-medium leading-snug sm:text-sm">{label}</span>
    </Link>
  );
}
