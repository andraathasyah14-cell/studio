import { principles } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="flex items-center gap-4 mb-16">
        <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground whitespace-nowrap">Tentang</span>
        <div className="h-px w-full bg-border" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            Saya bukan orang yang selalu benar. Saya hanya mencoba berpikir dengan jujur — menunjukkan dari mana opini itu berasal, bagaimana ia terbentuk, dan kapan ia layak dipertanyakan ulang.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Website ini adalah dokumentasi proses berpikir, bukan presentasi kesimpulan final. Setiap tulisan datang dengan jejak sumber, asumsi yang digunakan, dan indikator seberapa yakin saya dengan argumen yang saya buat.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Jika Anda menemukan argumen yang lebih baik, saya ingin membacanya.
          </p>
        </div>
        
        <div className="space-y-10">
          {principles.map((p, i) => (
            <div key={i} className="pl-6 border-l border-muted">
              <span className="font-display text-[0.6rem] text-muted-foreground tracking-widest uppercase mb-2 block">
                {p.num}
              </span>
              <p className="font-serif italic text-muted-foreground leading-relaxed">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}