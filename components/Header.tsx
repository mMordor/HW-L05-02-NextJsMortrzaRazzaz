"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";

const links = [
  { href: "/", label: "Home" },
  { href: "/favorites", label: "Favorites" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-surface/90 shadow-[0_1px_8px_rgba(38,30,26,0.04)] backdrop-blur-xl print:hidden">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-space-md px-margin">
        <Link href="/" className="flex items-center gap-space-xs font-headline-sm text-headline-sm tracking-tight transition-colors hover:text-primary">
          <Icon name="skillet" className="text-primary" />
          <span className="hidden sm:inline">Recipe Finder</span>
        </Link>
        <nav className="flex items-center gap-space-xs rounded-full bg-surface-container-low/60 p-space-xs">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-space-md py-space-xs transition-colors ${
                pathname === l.href
                  ? "bg-surface-container-high font-title-md text-title-md text-on-surface"
                  : "font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
