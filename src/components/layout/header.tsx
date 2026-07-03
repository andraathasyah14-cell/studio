import Link from "next/link";
import { Search } from "lucide-react";
import { useState } from "react";
import { SearchDialog } from "@/components/search-dialog";

const navLinks = [
  { href: "/#essays", label: "Esai" },
  { href: "/#reading", label: "Bacaan" },
  { href: "/pustaka", label: "Pustaka" },
  { href: "/#about", label: "Tentang" },
];

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-[860px] mx-auto flex h-14 items-center justify-between px-6">
        <Link href="/" className="font-display font-semibold text-sm tracking-tight text-white hover:opacity-70 transition-opacity">
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
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="text-muted-foreground hover:text-white transition-colors"
            title="Cari"
          >
            <Search className="w-4 h-4" />
          </button>
        </nav>
      </div>
      <SearchDialog isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  );
}
