import Header from "@/components/layout/header";
import Hero from "@/components/sections/hero";
import Features from "@/components/sections/features";
import Portfolio from "@/components/sections/portfolio";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Portfolio />
      </main>
    </div>
  );
}
