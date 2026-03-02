import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Leaf,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  TreePine,
} from "lucide-react";
import { destinations } from "@/lib/data";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return destinations.map((d) => ({ id: d.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const dest = destinations.find((d) => d.id === id);
  if (!dest) return { title: "Destinasi Tidak Ditemukan" };
  return {
    title: `${dest.name} - Desa Manud Jaya`,
    description: dest.description,
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dest = destinations.find((d) => d.id === id);
  if (!dest) notFound();

  const otherDestinations = destinations
    .filter((d) => d.id !== id)
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <div className="relative h-[50vh] min-h-[400px]">
          <Image
            src={dest.image}
            alt={dest.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-foreground/50" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-10">
              <Button
                variant="ghost"
                size="sm"
                className="mb-4 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link href="/#destinasi">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Destinasi
                </Link>
              </Button>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge
                  variant="secondary"
                  className="bg-primary-foreground/20 text-primary-foreground border-0"
                >
                  <MapPin className="mr-1 h-3 w-3" />
                  {dest.type}
                </Badge>
                {dest.eco && (
                  <Badge className="gap-1 bg-primary text-primary-foreground">
                    <Leaf className="h-3 w-3" />
                    Eco-Friendly
                  </Badge>
                )}
              </div>
              <h1 className="text-balance text-3xl font-bold text-primary-foreground md:text-5xl">
                {dest.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-foreground">Tentang Destinasi</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {dest.description}
              </p>

              <Separator className="my-8" />

              {/* Eco value */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Nilai Eco-Friendly
                  </h3>
                </div>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {dest.ecoValue}
                </p>
              </div>

              <Separator className="my-8" />

              {/* Activities */}
              <h3 className="text-xl font-bold text-foreground">Aktivitas</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {dest.activities.map((activity) => (
                  <div
                    key={activity}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {activity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center gap-2">
                  <TreePine className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    Kunjungi Destinasi Ini
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Destinasi ini tersedia dalam beberapa paket wisata
                  eco-friendly kami. Pilih paket yang sesuai dengan preferensi
                  Anda.
                </p>
                <Button className="mt-6 w-full" asChild>
                  <Link href="/#paket">Lihat Paket Wisata</Link>
                </Button>

                <Separator className="my-6" />

                <h4 className="text-sm font-semibold text-foreground">
                  Destinasi Lainnya
                </h4>
                <div className="mt-3 flex flex-col gap-3">
                  {otherDestinations.map((d) => (
                    <Link
                      key={d.id}
                      href={`/destinasi/${d.id}`}
                      className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={d.image}
                          alt={d.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {d.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {d.type}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
