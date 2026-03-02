import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Leaf, MapPin, ArrowRight } from "lucide-react";
import { destinations } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Semua Destinasi - Desa Manud Jaya",
  description: "Jelajahi semua destinasi wisata eco-friendly di Desa Manud Jaya.",
};

export default function DestinationsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="bg-primary py-20">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h1 className="text-balance text-3xl font-bold text-primary-foreground md:text-5xl">
              Semua Destinasi Wisata
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-primary-foreground/80">
              8 destinasi unggulan dengan prinsip wisata berkelanjutan dan ramah
              lingkungan.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs font-medium text-primary">
                    <MapPin className="h-3 w-3" />
                    {dest.type} &mdash; {dest.subtitle}
                  </div>
                  <h2 className="mt-2 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {dest.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {dest.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                    Selengkapnya
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
