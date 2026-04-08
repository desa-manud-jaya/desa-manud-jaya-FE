import type { Metadata } from "next";

import { BookingHistoryList } from "@/components/booking/booking-history-list";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Riwayat Pemesanan - Desa Manud Jaya",
  description: "Lihat riwayat booking paket wisata Anda di Desa Manud Jaya.",
};

export default function BookingHistoryPage() {
  return (
    <>
      <Navbar hideAuthSection={true} />
      <main className="pt-20">
        <div className="bg-primary py-16">
          <div className="mx-auto max-w-7xl px-6">
            <h1 className="text-balance text-3xl font-bold text-primary-foreground md:text-5xl">
              Riwayat Booking
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Pantau semua pemesanan paket wisata yang telah Anda buat.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-16">
          <BookingHistoryList />
        </div>
      </main>
      <Footer />
    </>
  );
}
