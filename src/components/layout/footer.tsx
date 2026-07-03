
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
          ANDRA NGELANTUR · Personal Knowledge Publication
        </p>
        <div className="flex items-center gap-4">
          <Link href="/audit" className="text-[0.55rem] uppercase tracking-widest text-muted-foreground hover:text-white border-b border-transparent hover:border-white transition-all">
            Audit Log Publik
          </Link>
          <span className="text-border">|</span>
          <span className="text-[0.55rem] uppercase tracking-widest text-muted-foreground italic">
            v1.2 Stable
          </span>
        </div>
      </div>
      <p className="text-[0.65rem] tracking-tight text-muted-foreground italic">
        Tidak netral. Tidak asal bicara. Semua bisa diuji.
      </p>
    </footer>
  );
}
