import Link from "next/link";

const navLinks = [
  { href: "/#essays", label: "Esai" },
  { href: "/#reading", label: "Bacaan" },
  { href: "/pustaka", label: "Pustaka" },
  { href: "/admin", label: "Admin" },
  { href: "/#about", label: "Tentang" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-[860px] mx-auto flex h-14 items-center justify-between px-6">
        <Link href="/" className="font-display font-semibold text-sm tracking-tight text-white">
          Andra Ngelantur
        </Link>
        <nav className="flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.7rem] font-medium tracking-widest uppercase text-muted-foreground transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
