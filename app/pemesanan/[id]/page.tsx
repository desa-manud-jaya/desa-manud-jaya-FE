import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { BookingForm } from "@/components/booking/booking-form";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { getPackageDetailById } from "@/lib/services/package-service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const pkg = await getPackageDetailById(id);

  if (!pkg) {
    return {
      title: "Booking Tidak Ditemukan - Desa Manud Jaya",
    };
  }

  return {
    title: `Booking ${pkg.title} - Desa Manud Jaya`,
    description: `Form booking untuk paket wisata ${pkg.title} di Desa Manud Jaya.`,
  };
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pkg = await getPackageDetailById(id);

  if (!pkg) {
    notFound();
  }

  return (
    <>
      <Navbar hideAuthSection={true} />
      <main className="pt-20">
        <div className="bg-primary py-16">
          <div className="mx-auto max-w-7xl px-6">
            <Button
              variant="ghost"
              size="sm"
              className="mb-5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              asChild
            >
              <Link href={`/paket/${pkg.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Detail Paket
              </Link>
            </Button>

            <h1 className="text-balance text-3xl font-bold text-primary-foreground md:text-5xl">
              Booking Paket Wisata
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Lengkapi data pemesanan Anda untuk paket{" "}
              <strong>{pkg.title}</strong>.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-16">
          <BookingForm
            packageItem={{
              id: pkg.id,
              title: pkg.title,
              duration: pkg.duration,
              price: pkg.price,
              image: pkg.image,
              businessId: pkg.businessId,
            }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
