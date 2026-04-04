"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Clock3, Package2, ReceiptText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/data";
import {
  getCurrentUser,
  getUserBookingHistoryApi,
  type LoggedInUser,
} from "@/lib/services/booking-service";
import { getApprovedPackages } from "@/lib/services/package-service";
import type { UserBookingHistoryApiItem } from "@/lib/types/booking";

function formatBookingDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusLabel(status: UserBookingHistoryApiItem["status"]) {
  switch (status) {
    case "waiting_for_payment":
      return "Menunggu Pembayaran";
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

function getStatusVariant(status: UserBookingHistoryApiItem["status"]) {
  switch (status) {
    case "waiting_for_payment":
      return "secondary" as const;
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

function shortenId(value: string) {
  return value.length > 8 ? `${value.slice(0, 8)}...` : value;
}

export function BookingHistoryList() {
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null);
  const [bookings, setBookings] = useState<UserBookingHistoryApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [packageTitleMap, setPackageTitleMap] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    if (!user) {
      setLoading(false);
      return;
    }

    if (user.role !== "traveler") {
      setLoading(false);
      return;
    }

    const loadBookingHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const [historyResponse, approvedPackages] = await Promise.all([
          getUserBookingHistoryApi(user.id, user.token, 0, 10),
          getApprovedPackages(),
        ]);

        setBookings(historyResponse.items ?? []);

        const titleMap = approvedPackages.reduce<Record<string, string>>(
          (acc, pkg) => {
            acc[pkg.id] = pkg.name;
            return acc;
          },
          {},
        );

        setPackageTitleMap(titleMap);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Gagal memuat riwayat booking.",
        );
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    loadBookingHistory();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-muted-foreground">
          Memuat riwayat booking...
        </CardContent>
      </Card>
    );
  }

  if (!currentUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">
            Login untuk melihat riwayat booking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Silakan masuk sebagai wisatawan untuk melihat daftar booking yang
            pernah Anda buat.
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
          <CardTitle className="text-foreground">
            Riwayat booking hanya untuk traveler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Akun yang sedang aktif bukan akun traveler. Silakan gunakan akun
            wisatawan untuk melihat riwayat pemesanan.
          </p>
          <Button variant="outline" asChild>
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">
            Gagal memuat riwayat booking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{error}</p>
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
            Anda belum melakukan pemesanan paket wisata. Silakan pilih paket
            yang tersedia untuk memulai perjalanan Anda.
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
      {bookings.map((booking) => {
        const packageTitle =
          packageTitleMap[booking.packageId] ||
          `Paket ${shortenId(booking.packageId)}`;

        return (
          <Card key={booking.id} className="overflow-hidden">
            <CardHeader className="gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle className="text-xl text-foreground">
                  {packageTitle}
                </CardTitle>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <ReceiptText className="h-4 w-4 text-primary" />
                  ID booking:{" "}
                  <span className="font-medium text-foreground">
                    {shortenId(booking.id)}
                  </span>
                </p>
              </div>

              <Badge variant={getStatusVariant(booking.status)}>
                {getStatusLabel(booking.status)}
              </Badge>
            </CardHeader>

            <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl bg-secondary/40 p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Package2 className="h-4 w-4 text-primary" />
                  Detail booking
                </p>
                <p className="text-sm text-muted-foreground">
                  Jumlah peserta: {booking.quantity} orang
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Package ID: {shortenId(booking.packageId)}
                </p>
              </div>

              <div className="rounded-xl bg-secondary/40 p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Building2 className="h-4 w-4 text-primary" />
                  Mitra / Bisnis
                </p>
                <p className="text-sm text-muted-foreground">
                  {booking.business?.name || "-"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {booking.business?.address || "-"}
                </p>
              </div>

              <div className="rounded-xl bg-secondary/40 p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Clock3 className="h-4 w-4 text-primary" />
                  Dibuat pada
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatBookingDate(booking.createdAt)}
                </p>
              </div>

              <div className="rounded-xl bg-secondary/40 p-4">
                <p className="mb-2 text-sm font-medium text-foreground">
                  Total pembayaran
                </p>
                <p className="text-lg font-bold text-primary">
                  {formatRupiah(booking.amount)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Status: {getStatusLabel(booking.status)}
                </p>
              </div>
            </CardContent>

            <div className="flex flex-wrap gap-3 border-t border-border px-6 py-4">
              <Button asChild>
                <Link href={`/paket/${booking.packageId}`}>
                  Lihat Detail Paket
                </Link>
              </Button>

              {booking.status === "waiting_for_payment" ? (
                <Button type="button" variant="outline" onClick={() => {}} disabled>
                  Bayar Sekarang
                </Button>
              ) : (
                <Button variant="outline" asChild>
                  <Link href={`/pemesanan/${booking.packageId}`}>
                    Booking Lagi
                  </Link>
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
