import { Button } from "@/components/ui/button";
import { TreePine, Mail } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-24">
      {/* Decorative shapes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-primary-foreground" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary-foreground" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <TreePine className="mx-auto mb-6 h-12 w-12 text-primary-foreground/80" />
        <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
          Siap Menjelajahi Desa Manud Jaya?
        </h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-primary-foreground/80">
          Bergabunglah dalam perjalanan wisata berkelanjutan. Setiap kunjungan
          Anda berkontribusi pada ekonomi desa dan pelestarian lingkungan.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            variant="secondary"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            asChild
          >
            <a href="#paket">Pesan Paket Wisata</a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
            asChild
          >
            <a href="#kontak">
              <Mail className="mr-2 h-5 w-5" />
              Hubungi Kami
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
