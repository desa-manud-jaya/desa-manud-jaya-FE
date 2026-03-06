import Image from "next/image";
import GreenLeaf from "../public/greenleaf.svg";
import { Button } from "@/components/ui/button";
import { Leaf, MapPin, TreePine } from "lucide-react";

export function HeroSection() {
  return (
    <section id="beranda" className="relative min-h-screen flex items-center">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.jpg"
          alt="Pemandangan Desa Manud Jaya"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-foreground/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 md:py-40">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-sm font-medium text-primary-foreground backdrop-blur-sm">
            <Leaf className="h-4 w-4" />
            <span>Wisata Berkelanjutan</span>
          </div>
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-primary-foreground md:text-6xl lg:text-7xl">
            Jelajahi Keindahan Desa Manud Jaya
          </h1>
          <p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-primary-foreground/80">
            Platform wisata berkelanjutan yang menghubungkan Anda dengan
            destinasi alam, budaya, dan akomodasi ramah lingkungan di jantung
            desa yang asri.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button size="lg" asChild>
              <a href="#paket">
                {/* <TreePine className="mr-2 h-5 w-5" /> */}
                Lihat Paket Wisata
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20 hover:text-primary-foreground"
              asChild
            >
              <a href="#destinasi">
                {/* <MapPin className="mr-2 h-5 w-5" /> */}
                Gabung Kemitraan Kami
              </a>
            </Button>
          </div>
          <div className="mt-6 inline-flex items-center gap-3">
            <Image
              src={GreenLeaf}
              width={22}
              height={22}
              alt="green leaf"
              className="shrink-0"
            />
            <p className="text-base font-medium leading-none text-primary-foreground/80 drop-shadow-sm">
              Certified Eco-Friendly Experiences
            </p>
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap gap-8">
            {[
              { value: "8+", label: "Destinasi Wisata" },
              { value: "6", label: "Paket Eco-Tour" },
              { value: "100%", label: "Ramah Lingkungan" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-primary-foreground/70">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
