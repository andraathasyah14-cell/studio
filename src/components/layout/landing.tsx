'use client';

import { Button } from "@/components/ui/button";

interface LandingProps {
  onEnter: () => void;
}

export default function Landing({ onEnter }: LandingProps) {
  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-8 transition-all duration-700">
      <div className="max-w-[560px] w-full flex flex-col gap-10">
        <div className="space-y-2">
          <span className="block font-display text-xs text-muted-foreground tracking-[0.15em] uppercase">
            Personal Knowledge Publication
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tighter leading-[0.9] text-white">
            ANDRA<br />NGELANTUR
          </h1>
        </div>

        <p className="font-serif text-lg italic text-muted-foreground border-l border-muted pl-5 leading-relaxed">
          Opini yang dibangun dari data, literatur, dan penalaran yang terbuka untuk diperdebatkan.
        </p>

        <div className="space-y-3 p-6 border border-border bg-white/5 backdrop-blur-sm text-sm text-muted-foreground leading-relaxed">
          <p>Apa yang Anda baca di sini <strong className="text-foreground font-medium">bukan fakta absolut.</strong></p>
          <p>Setiap tulisan merupakan interpretasi pribadi terhadap data, penelitian, dan buku. Saya mencoba menunjukkan sumber yang dapat ditelusuri dan menjelaskan bagaimana saya sampai pada suatu kesimpulan.</p>
          <p>Anda tidak harus setuju. Jika ada argumen yang lebih kuat, opini ini juga bisa berubah.</p>
        </div>

        <Button 
          onClick={onEnter}
          variant="outline" 
          className="self-start px-8 py-6 rounded-none border-muted font-display tracking-widest uppercase hover:bg-white hover:text-black transition-colors"
        >
          Mulai Membaca
        </Button>
      </div>
    </div>
  );
}