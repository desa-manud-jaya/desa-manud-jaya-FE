"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, Clock3, Package2, ReceiptText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/data";
import { getBookingsByUserId, getCurrentUser, type LoggedInUser } from "@/lib/services/booking-service";
import type { TravelerBooking } from "@/lib/types/booking";

function formatBookingDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatTravelDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
  }).format(new Date(value));
}

function getStatusLabel(status: TravelerBooking["status"]) {
  switch (status) {
    case "confirmed":
      return "Terkonfirmasi";
    case "completed":
      return "Selesai";
    case "cancelled":
      return "Dibatalkan";
    case "pending":
    default:
      return "Menunggu Konfirmasi";
  }
}

function getStatusVariant(status: TravelerBooking["status"]) {
  switch (status) {
    case "confirmed":
      return "default" as const;
    case "completed":
      return "secondary" as const;
    case "cancelled":
      return "destructive" as const;
    case "pending":
    default:
      return "outline" as const;
  }
}

export function BookingHistoryList() {
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null);
  const [bookings, setBookings] = useState<TravelerBooking[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    if (!user) {
      setBookings([]);
      return;
    }

    setBookings(getBookingsByUserId(user.id));
  }, []);

  if (!currentUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Login untuk melihat riwayat booking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Silakan masuk sebagai wisatawan untuk melihat daftar booking yang pernah Anda buat.
          </p>
          <Button asChild>
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (currentUser.role !== "traveler") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Riwayat booking hanya untuk traveler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Akun yang sedang aktif bukan akun traveler. Silakan gunakan akun wisatawan untuk melihat riwayat pemesanan.
          </p>
          <Button variant="outline" asChild>
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-foreground">Belum ada booking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Anda belum melakukan pemesanan paket wisata. Silakan pilih paket yang tersedia untuk memulai perjalanan Anda.
          </p>
          <Button asChild>
            <Link href="/#paket">Lihat Paket Wisata</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <Card key={booking.id} className="overflow-hidden">
          <CardHeader className="gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle className="text-xl text-foreground">{booking.packageTitle}</CardTitle>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <ReceiptText className="h-4 w-4 text-primary" />
                Kode booking: <span className="font-medium text-foreground">{booking.bookingCode}</span>
              </p>
            </div>

            <Badge variant={getStatusVariant(booking.status)}>
              {getStatusLabel(booking.status)}
            </Badge>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl bg-secondary/40 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <CalendarDays className="h-4 w-4 text-primary" />
                Tanggal keberangkatan
              </p>
              <p className="text-sm text-muted-foreground">{formatTravelDate(booking.travelDate)}</p>
            </div>

            <div className="rounded-xl bg-secondary/40 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Package2 className="h-4 w-4 text-primary" />
                Detail peserta
              </p>
              <p className="text-sm text-muted-foreground">{booking.participantCount} orang</p>
              <p className="mt-1 text-sm text-muted-foreground">Kontak: {booking.contactName}</p>
            </div>

            <div className="rounded-xl bg-secondary/40 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Clock3 className="h-4 w-4 text-primary" />
                Dibuat pada
              </p>
              <p className="text-sm text-muted-foreground">{formatBookingDate(booking.createdAt)}</p>
            </div>

            <div className="rounded-xl bg-secondary/40 p-4">
              <p className="mb-2 text-sm font-medium text-foreground">Total pembayaran</p>
              <p className="text-lg font-bold text-primary">{formatRupiah(booking.totalPrice)}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatRupiah(booking.pricePerPerson)} × {booking.participantCount} peserta
              </p>
            </div>
          </CardContent>

          <div className="flex flex-wrap gap-3 border-t border-border px-6 py-4">
            <Button asChild>
              <Link href={`/paket/${booking.packageId}`}>Lihat Detail Paket</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/pemesanan/${booking.packageId}`}>Booking Lagi</Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
