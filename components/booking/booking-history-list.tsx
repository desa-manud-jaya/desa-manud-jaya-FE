"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Package2,
  ReceiptText,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatRupiah } from "@/lib/data";
import {
  getCurrentUser,
  getUserBookingHistoryApi,
  type LoggedInUser,
} from "@/lib/services/booking-service";
import { getApprovedPackages } from "@/lib/services/package-service";
import type { BookingStatus, UserBookingHistoryApiItem } from "@/lib/types/booking";

function formatBookingDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatTripDate(value?: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function formatNullableDate(value?: string | null) {
  if (!value) return "-";

  return formatBookingDate(value);
}

function deriveDisplayStatus(booking: UserBookingHistoryApiItem): BookingStatus {
  const hasPaymentProof = Boolean(
    booking.paymentProofUrl || booking.paymentUploadedAt,
  );

  if (
    hasPaymentProof &&
    (booking.status === "pending" || booking.status === "waiting_for_payment")
  ) {
    return "paid_pending_review";
  }

  return booking.status;
}

function getStatusLabel(status: BookingStatus) {
  switch (status) {
    case "waiting_for_payment":
      return "Menunggu Pembayaran";
    case "paid_pending_review":
      return "Dibayar - Menunggu Review";
    case "approved":
      return "Pembayaran Tervalidasi";
    case "rejected":
      return "Pembayaran Ditolak";
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

function getStatusVariant(status: BookingStatus) {
  switch (status) {
    case "waiting_for_payment":
      return "secondary" as const;
    case "paid_pending_review":
      return "default" as const;
    case "approved":
      return "default" as const;
    case "rejected":
      return "destructive" as const;
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

function getGuideName(booking: UserBookingHistoryApiItem) {
  return (
    booking.guide?.fullName ||
    booking.guide?.name ||
    booking.guide?.guideProfile?.fullName ||
    booking.guide?.username ||
    booking.guide?.user?.username ||
    null
  );
}

function getGuidePhone(booking: UserBookingHistoryApiItem) {
  return booking.guide?.phone || booking.guide?.guideProfile?.phone || null;
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-4">
      <p className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

function getCardClassName(status: BookingStatus) {
  if (status === "approved") {
    return "overflow-hidden border-emerald-300 bg-emerald-50/70 shadow-sm shadow-emerald-100";
  }

  if (status === "rejected") {
    return "overflow-hidden border-red-300 bg-red-50/70 shadow-sm shadow-red-100";
  }

  if (status === "waiting_for_payment") {
    return "overflow-hidden border-amber-200 bg-amber-50/45";
  }

  return "overflow-hidden";
}

function getInfoBoxClassName(status: BookingStatus) {
  if (status === "approved") {
    return "rounded-xl border border-emerald-200 bg-white/80 p-4";
  }

  if (status === "rejected") {
    return "rounded-xl border border-red-200 bg-white/80 p-4";
  }

  if (status === "waiting_for_payment") {
    return "rounded-xl border border-amber-100 bg-white/75 p-4";
  }

  return "rounded-xl bg-secondary/40 p-4";
}

function getStatusBadgeClassName(status: BookingStatus) {
  if (status === "approved") {
    return "border-transparent bg-emerald-600 text-white";
  }

  if (status === "rejected") {
    return "border-transparent bg-red-600 text-white";
  }

  if (status === "paid_pending_review") {
    return "border-transparent bg-amber-600 text-white";
  }

  return undefined;
}

const dialogScrollClassName =
  "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/35 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/35";

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
        const displayStatus = deriveDisplayStatus(booking);
        const isPendingAdminReview = displayStatus === "paid_pending_review";
        const isApproved = displayStatus === "approved";
        const isRejected = displayStatus === "rejected";
        const infoBoxClassName = getInfoBoxClassName(displayStatus);
        const guideName = getGuideName(booking);
        const guidePhone = getGuidePhone(booking);

        return (
          <Card key={booking.id} className={getCardClassName(displayStatus)}>
            <CardHeader className="gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                  {isApproved && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  )}
                  {isRejected && (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span>{packageTitle}</span>
                </CardTitle>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <ReceiptText
                    className={`h-4 w-4 ${
                      isApproved
                        ? "text-emerald-600"
                        : isRejected
                          ? "text-red-600"
                          : "text-primary"
                    }`}
                  />
                  ID booking:{" "}
                  <span className="font-medium text-foreground">
                    {shortenId(booking.id)}
                  </span>
                </p>
                {isApproved && (
                  <p className="mt-2 max-w-2xl text-sm font-medium text-emerald-700">
                    Pembayaran telah tervalidasi dan diterima oleh admin.
                  </p>
                )}
                {isRejected && (
                  <p className="mt-2 max-w-2xl text-sm font-medium text-red-700">
                    Pembayaran ditolak oleh admin. Periksa catatan admin untuk
                    tindak lanjut.
                  </p>
                )}
              </div>

              <Badge
                variant={getStatusVariant(displayStatus)}
                className={getStatusBadgeClassName(displayStatus)}
              >
                {getStatusLabel(displayStatus)}
              </Badge>
            </CardHeader>

            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className={infoBoxClassName}>
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Package2
                    className={`h-4 w-4 ${
                      isApproved
                        ? "text-emerald-600"
                        : isRejected
                          ? "text-red-600"
                          : "text-primary"
                    }`}
                  />
                  Detail booking
                </p>
                <p className="text-sm text-muted-foreground">
                  Jumlah peserta: {booking.quantity} orang
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Package ID: {shortenId(booking.packageId)}
                </p>
              </div>

              <div className={infoBoxClassName}>
                <p className="mb-2 text-sm font-medium text-foreground">
                  Jumlah pembayaran
                </p>
                <p
                  className={`text-lg font-bold ${
                    isApproved
                      ? "text-emerald-700"
                      : isRejected
                        ? "text-red-700"
                        : "text-primary"
                  }`}
                >
                  {formatRupiah(booking.amount)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Status: {getStatusLabel(displayStatus)}
                </p>
              </div>

              <div className={infoBoxClassName}>
                <p className="mb-2 text-sm font-medium text-foreground">
                  Detail pembayaran
                </p>
                <p className="text-sm text-muted-foreground">
                  Bukti transfer diunggah:{" "}
                  {formatNullableDate(booking.paymentUploadedAt)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Verifikasi admin:{" "}
                  {isApproved
                    ? "Tervalidasi"
                    : isRejected
                      ? "Ditolak"
                    : booking.reviewedAt
                      ? "Sudah dicek"
                      : "Menunggu pengecekan"}
                </p>
                {booking.reviewNote && (
                  <p
                    className={`mt-1 text-xs ${
                      isRejected
                        ? "font-medium text-red-700"
                        : "text-muted-foreground"
                    }`}
                  >
                    {isRejected ? "Alasan penolakan" : "Catatan admin"}:{" "}
                    {booking.reviewNote}
                  </p>
                )}
              </div>
            </CardContent>

            <div className="flex flex-wrap gap-3 border-t border-border px-6 py-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Lihat Detail Paket</Button>
                </DialogTrigger>
                <DialogContent
                  className={`max-h-[90vh] overflow-y-auto sm:max-w-3xl ${dialogScrollClassName}`}
                >
                  <DialogHeader>
                    <DialogTitle>{packageTitle}</DialogTitle>
                    <DialogDescription>
                      Detail lengkap paket dan pembayaran booking Anda.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 md:grid-cols-2">
                    <DetailItem label="ID booking" value={booking.id} />
                    <DetailItem
                      label="Status"
                      value={
                        <Badge
                          variant={getStatusVariant(displayStatus)}
                          className={getStatusBadgeClassName(displayStatus)}
                        >
                          {getStatusLabel(displayStatus)}
                        </Badge>
                      }
                    />
                    <DetailItem
                      label="Paket"
                      value={
                        <div>
                          <p>{packageTitle}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Package ID: {booking.packageId}
                          </p>
                        </div>
                      }
                    />
                    <DetailItem
                      label="Jumlah peserta"
                      value={`${booking.quantity} orang`}
                    />
                    <DetailItem
                      label="Tanggal perjalanan"
                      value={formatTripDate(booking.tripDate)}
                    />
                    <DetailItem
                      label="Dibuat pada"
                      value={formatBookingDate(booking.createdAt)}
                    />
                    <DetailItem
                      label="Guide lokal"
                      value={
                        <div>
                          <p>{guideName || "Belum ditentukan"}</p>
                          {booking.guideId && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Guide ID: {booking.guideId}
                            </p>
                          )}
                          {guidePhone && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Telepon: {guidePhone}
                            </p>
                          )}
                        </div>
                      }
                    />
                    <DetailItem
                      label="Mitra / Bisnis"
                      value={
                        <div>
                          <p>{booking.business?.name || "-"}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {booking.business?.address || "-"}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Business ID: {booking.businessId}
                          </p>
                        </div>
                      }
                    />
                    <DetailItem
                      label="Total pembayaran"
                      value={
                        <span
                          className={
                            isApproved
                              ? "text-emerald-700"
                              : isRejected
                                ? "text-red-700"
                                : "text-primary"
                          }
                        >
                          {formatRupiah(booking.amount)}
                        </span>
                      }
                    />
                    <DetailItem
                      label="Bukti transfer"
                      value={
                        booking.paymentProofUrl ? (
                          <a
                            href={booking.paymentProofUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary underline"
                          >
                            Lihat bukti pembayaran
                          </a>
                        ) : (
                          "-"
                        )
                      }
                    />
                    <DetailItem
                      label="Tanggal upload bukti"
                      value={formatNullableDate(booking.paymentUploadedAt)}
                    />
                    <DetailItem
                      label="Verifikasi admin"
                      value={
                        isApproved
                          ? "Tervalidasi"
                          : isRejected
                            ? "Ditolak"
                            : booking.reviewedAt
                              ? "Sudah dicek"
                              : "Menunggu pengecekan"
                      }
                    />
                    <DetailItem
                      label={isRejected ? "Alasan penolakan" : "Catatan admin"}
                      value={booking.reviewNote || "-"}
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 border-t border-border pt-4">
                    <Button variant="outline" asChild>
                      <Link href={`/paket/${booking.packageId}`}>
                        Buka Halaman Paket
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/pemesanan/${booking.packageId}`}>
                        Booking Lagi
                      </Link>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {displayStatus === "waiting_for_payment" ? (
                <Button variant="outline" asChild>
                  <Link href={`/pembayaran/${booking.id}`}>Bayar Sekarang</Link>
                </Button>
              ) : isPendingAdminReview ? (
                <Button type="button" variant="outline" disabled>
                  Menunggu Pengecekan Admin
                </Button>
              ) : isRejected ? (
                <Button variant="destructive" asChild>
                  <Link href={`/pemesanan/${booking.packageId}`}>
                    Booking Ulang
                  </Link>
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
