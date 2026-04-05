import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Leaf,
  ArrowLeft,
  Clock,
  CheckCircle2,
  CalendarDays,
  Users,
} from "lucide-react";

import { formatRupiah } from "@/lib/data";
import {
  getApprovedPackageById,
  getApprovedPackageList,
  getPackageDetailById,
  mapApiPackageToDetailItem,
} from "@/lib/services/package-service";
import { useAppSelector } from "@/lib/redux/hooks";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const apiPkg = await getApprovedPackageById(id);
  if (!apiPkg) {
    return { title: "Paket Tidak Ditemukan" };
  }

  const mapped = mapApiPackageToDetailItem(apiPkg);

  return {
    title: `${mapped.title} - Desa Manud Jaya`,
    description: `Paket wisata ${mapped.title} - ${mapped.duration} dengan harga ${formatRupiah(mapped.price)} per orang.`,
  };
}


export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const pkg = await getPackageDetailById(id);

  if (!pkg) {
    notFound();
  }
  const packageList = await getApprovedPackageList();
  const otherPackages = packageList.filter((p) => p.id !== id).slice(0, 3);
 

  return (
    <>
      <Navbar hideAuthSection={true} />
      <main className="pt-20">
        <div className="relative h-[80vh] min-h-[400px]">
          <Image
            src={pkg.image}
            alt={pkg.title}
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
                className="mb-6 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link href="/#paket">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Paket Wisata
                </Link>
              </Button>

              <div className="mb-3 flex flex-wrap items-center gap-3">
                <Badge
                  variant="secondary"
                  className="border-0 bg-primary-foreground/20 text-primary-foreground"
                >
                  <Clock className="mr-1 h-3 w-3" />
                  {pkg.duration}
                </Badge>

                {pkg.eco && (
                  <Badge className="gap-1 bg-primary-foreground text-primary">
                    <Leaf className="h-3 w-3" />
                    Eco-Friendly
                  </Badge>
                )}
              </div>

              <h1 className="text-balance text-3xl font-bold text-primary-foreground md:text-5xl">
                {pkg.title}
              </h1>

              <p className="mt-3 text-3xl font-bold text-primary-foreground/90">
                {formatRupiah(pkg.price)}
                <span className="text-base font-normal text-primary-foreground/70">
                  {" "}
                  / orang
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
                <CalendarDays className="h-6 w-6 text-primary" />
                Itinerary
              </h2>

              <div className="mt-6 flex flex-col gap-4">
                {pkg.itinerarySections.map((section, sectionIndex) => (
                  <div key={`${section.title ?? "section"}-${sectionIndex}`}>
                    {section.title && (
                      <h3 className="mb-4 text-lg font-semibold text-foreground">
                        {section.title}
                      </h3>
                    )}

                    <div className="flex flex-col gap-4">
                      {section.items.map((item, itemIndex) => (
                        <div
                          key={`${sectionIndex}-${itemIndex}-${item}`}
                          className="flex items-start gap-4 rounded-xl border border-border bg-card p-5"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                            {itemIndex + 1}
                          </div>
                          <p className="text-sm leading-relaxed text-foreground">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>

                    {sectionIndex < pkg.itinerarySections.length - 1 && (
                      <Separator className="my-6" />
                    )}
                  </div>
                ))}
              </div>

              <Separator className="my-10" />

              <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                Yang Termasuk
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {pkg.includes.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 flex flex-col gap-6">
                <Card className="border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">
                      Pesan Paket Ini
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Harga
                      </span>
                      <span className="text-lg font-bold text-foreground">
                        {formatRupiah(pkg.price)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Durasi
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {pkg.duration}
                      </span>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-3">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">
                        Jumlah peserta akan dikonfirmasi saat pemesanan
                      </span>
                    </div>

                    <Button className="w-full" size="lg" asChild>
                      <Link href={`/pemesanan/${pkg.id}`}>Pesan Sekarang</Link>
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      Konfirmasi manual via WhatsApp
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base text-foreground">
                      Paket Lainnya
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-3">
                    {otherPackages.map((p) => (
                      <Link
                        key={p.id}
                        href={`/paket/${p.id}`}
                        className="group flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-secondary"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                            {p.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {p.duration}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">
                            {formatRupiah(p.price)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            / orang
                          </p>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold text-foreground">
                      Wisata Bertanggung Jawab
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Setiap paket wisata menyertakan donasi konservasi yang
                    digunakan untuk menjaga kelestarian alam dan mendukung
                    ekonomi masyarakat desa.
                  </p>
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
