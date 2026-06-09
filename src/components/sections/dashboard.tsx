'use client';

export default function Dashboard() {
  const activityData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 100));
  const max = Math.max(...activityData);

  return (
    <section id="dashboard" className="py-20 px-6 border-b border-border">
      <div className="flex items-center gap-4 mb-12">
        <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground whitespace-nowrap">Aktivitas 30 Hari</span>
        <div className="h-px w-full bg-border" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-px bg-border border border-border mb-12 overflow-hidden">
        <StatCell value="7" label="Opini diterbitkan" />
        <StatCell value="18" label="Paper ditambahkan" />
        <StatCell value="2" label="Buku selesai" />
        <StatCell value="5" label="Dataset digunakan" />
        <StatCell value="3" label="Revisi tulisan" />
      </div>

      <div className="space-y-4">
        <div className="h-24 flex items-end gap-1 px-4">
          {activityData.map((v, i) => (
            <div 
              key={i} 
              className="flex-1 bg-muted group relative cursor-default"
              style={{ height: `${(v / max) * 100}%` }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-black text-[0.5rem] px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {v} events
              </div>
              <div className="w-full h-full bg-muted-foreground/10 group-hover:bg-muted-foreground/30 transition-colors" />
            </div>
          ))}
        </div>
        <p className="text-[0.6rem] text-muted-foreground tracking-widest text-center uppercase">
          Aktivitas harian · 30 hari terakhir
        </p>
      </div>
    </section>
  );
}

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-background p-6 flex flex-col justify-center text-center">
      <span className="font-display text-4xl font-bold text-white mb-1">{value}</span>
      <span className="text-[0.55rem] uppercase tracking-widest text-muted-foreground leading-tight">{label}</span>
    </div>
  );
}