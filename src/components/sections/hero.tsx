import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Twitter, Target, Phone, Linkedin, Gem, Palette } from "lucide-react";

const socialIcons = [
  { icon: Twitter, ariaLabel: "Twitter" },
  { icon: Target, ariaLabel: "Target" },
  { icon: Phone, ariaLabel: "Phone" },
];

const skillIcons = [
  { icon: Linkedin, ariaLabel: "LinkedIn" },
  { icon: Gem, ariaLabel: "Gem" },
  { icon: Palette, ariaLabel: "Palette" },
];

export default function Hero() {
  const profileImage = PlaceHolderImages.find(
    (img) => img.id === "jone-lee-portrait"
  );

  return (
    <section id="home" className="container mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
        <div className="lg:col-span-3 space-y-6">
          <p className="font-semibold text-sm text-muted-foreground tracking-[3px] uppercase">
            WELCOME TO MY WORLD
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Hi, I’m <span className="text-primary">Jone Lee</span> a{" "}
            <br className="hidden sm:block"/>
            <strong>Professional Coder.</strong>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-md">
            I use animation as a third dimension by which to simplify
            experiences and kudging their reach and every interaction, I'm not
            adding motion just to spruce things up, that, doing it in ways that.
          </p>
          <div className="flex flex-col sm:flex-row gap-12 pt-4">
            <div>
              <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-4">
                Find with me
              </h3>
              <div className="flex gap-4">
                {socialIcons.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="icon"
                    aria-label={item.ariaLabel}
                    className="w-14 h-14 rounded-lg shadow-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    <item.icon className="w-6 h-6" />
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-4">
                Best skill on
              </h3>
              <div className="flex gap-4">
                {skillIcons.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="icon"
                    aria-label={item.ariaLabel}
                    className="w-14 h-14 rounded-lg shadow-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    <item.icon className="w-6 h-6" />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 flex justify-center lg:justify-end">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-xl blur-md"></div>
            {profileImage && (
              <Image
                src={profileImage.imageUrl}
                alt={profileImage.description}
                width={400}
                height={400}
                data-ai-hint={profileImage.imageHint}
                className="relative object-cover rounded-xl shadow-lg border-4 border-card"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
