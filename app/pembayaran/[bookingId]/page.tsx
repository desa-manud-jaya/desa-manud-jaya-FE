import type { Metadata } from "next";

import { PaymentScreen } from "@/components/booking/payment-screen";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Pembayaran Booking - Desa Manud Jaya",
  description: "Transfer dan unggah bukti pembayaran booking wisata.",
};

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;

  return (
    <>
      <Navbar hideAuthSection={true} />
      <main className="pt-20">
        <div className="bg-primary py-16">
          <div className="mx-auto max-w-7xl px-6">
            <h1 className="text-balance text-3xl font-bold text-primary-foreground md:text-5xl">
              Pembayaran Booking
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Selesaikan pembayaran dan kirim bukti transfer untuk diproses admin.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-16">
          <PaymentScreen bookingId={bookingId} />
        </div>
      </main>
      <Footer />
    </>
  );
}
