import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, MapPin, ArrowRight } from "lucide-react";
import { destinations } from "@/lib/data";

export function DestinationsSection() {
  return (
    <section id="destinasi" className="bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Destinasi
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Jelajahi 8 Destinasi Unggulan
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Dari puncak bukit hingga sungai yang jernih, setiap destinasi di
            Desa Manud Jaya menawarkan pengalaman autentik yang ramah
            lingkungan.
          </p>
        </div>

        {/* Destinations grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              href={`/destinasi/${dest.id}`}
              className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-xl hover:border-primary/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {dest.eco && (
                  <div className="absolute top-3 left-3">
                    <Badge className="gap-1 bg-primary text-primary-foreground">
                      <Leaf className="h-3 w-3" />
                      Eco-Friendly
                    </Badge>
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-foreground/60 to-transparent" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs font-medium text-primary">
                  <MapPin className="h-3 w-3" />
                  {dest.type}
                </div>
                <h3 className="mt-2 text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {dest.name}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                  {dest.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Selengkapnya
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/destinasi">
              Lihat Semua Destinasi
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
