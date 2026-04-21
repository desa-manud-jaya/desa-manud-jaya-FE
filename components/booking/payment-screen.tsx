"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Copy,
  CreditCard,
  ReceiptText,
  Upload,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatRupiah } from "@/lib/data";
import {
  getCurrentUser,
  getUserBookingHistoryApi,
  uploadPaymentProofApi,
  type LoggedInUser,
} from "@/lib/services/booking-service";
import type { UserBookingHistoryApiItem } from "@/lib/types/booking";

const BANK_ACCOUNT_NAME = "LSM INDONESIA";
const BANK_NAME = "BRI";
const BANK_ACCOUNT_NUMBER = "392051746283015";

type PaymentScreenProps = {
  bookingId: string;
};

type PaymentProofForm = {
  file: File | null;
  senderName: string;
  transferAmount: string;
};

function shortenId(value: string) {
  return value.length > 10 ? `${value.slice(0, 10)}...` : value;
}

export function PaymentScreen({ bookingId }: PaymentScreenProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null);
  const [booking, setBooking] = useState<UserBookingHistoryApiItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [formValues, setFormValues] = useState<PaymentProofForm>({
    file: null,
    senderName: "",
    transferAmount: "",
  });

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    if (!user) {
      setIsLoading(false);
      return;
    }

    if (user.role !== "traveler") {
      setIsLoading(false);
      return;
    }

    const loadBooking = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getUserBookingHistoryApi(user.id, user.token, 0, 50);
        const selectedBooking =
          response.items?.find((item) => item.id === bookingId) ?? null;

        if (!selectedBooking) {
          setError("Booking tidak ditemukan pada akun ini.");
        }

        setBooking(selectedBooking);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Gagal memuat data pembayaran.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadBooking();
  }, [bookingId]);

  const normalizedTransferAmount = useMemo(
    () => Number(formValues.transferAmount.replace(/\D/g, "")),
    [formValues.transferAmount],
  );

  const handleCopyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(BANK_ACCOUNT_NUMBER);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const handleSubmitProof = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentUser || !booking) return;

    if (!formValues.file) {
      setFormError("Foto bukti transfer wajib diunggah.");
      return;
    }

    if (!formValues.senderName.trim()) {
      setFormError("Nama pengirim wajib diisi.");
      return;
    }

    if (!Number.isFinite(normalizedTransferAmount) || normalizedTransferAmount < 1) {
      setFormError("Nominal transfer wajib diisi dengan benar.");
      return;
    }

    if (normalizedTransferAmount !== booking.amount) {
      setFormError(
        `Nominal transfer harus sama dengan total pembayaran, yaitu ${formatRupiah(
          booking.amount,
        )}.`,
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);

      await uploadPaymentProofApi(
        booking.id,
        { file: formValues.file },
        currentUser.token,
      );

      router.push("/riwayat-pemesanan");
      router.refresh();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Gagal mengirim bukti transfer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-muted-foreground">
          Memuat detail pembayaran...
        </CardContent>
      </Card>
    );
  }

  if (!currentUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Login untuk pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Silakan masuk sebagai wisatawan untuk melanjutkan pembayaran booking.
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
            Pembayaran hanya untuk wisatawan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Akun yang sedang aktif bukan akun traveler.
          </p>
          <Button variant="outline" asChild>
            <Link href="/riwayat-pemesanan">Kembali ke Riwayat Booking</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (error || !booking) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">
            Pembayaran tidak tersedia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {error || "Booking tidak ditemukan."}
          </p>
          <Button variant="outline" asChild>
            <Link href="/riwayat-pemesanan">Kembali ke Riwayat Booking</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const hasUploadedPaymentProof = Boolean(
    booking.paymentProofUrl || booking.paymentUploadedAt,
  );

  return (
    <>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/riwayat-pemesanan">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Riwayat Booking
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-primary/20">
          <CardHeader className="gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl text-foreground">
                <CreditCard className="h-6 w-6 text-primary" />
                Pembayaran Booking
              </CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                Transfer sesuai nominal, lalu kirim foto bukti transfer untuk
                pengecekan admin.
              </p>
            </div>
            <Badge variant={hasUploadedPaymentProof ? "default" : "secondary"}>
              {hasUploadedPaymentProof ? "Sudah Dibayar" : "Menunggu Pembayaran"}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-secondary/40 p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Building2 className="h-4 w-4 text-primary" />
                  Rekening Tujuan
                </p>
                <p className="text-sm text-muted-foreground">Nama pemilik</p>
                <p className="font-semibold text-foreground">{BANK_ACCOUNT_NAME}</p>
              </div>

              <div className="rounded-lg bg-secondary/40 p-4">
                <p className="mb-2 text-sm font-medium text-foreground">
                  Nomor rekening {BANK_NAME}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-lg font-bold tracking-normal text-primary">
                    {BANK_ACCOUNT_NUMBER}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyAccountNumber}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {copied ? "Tersalin" : "Salin"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
              <p className="text-sm text-muted-foreground">
                Biaya yang harus ditransfer
              </p>
              <p className="mt-2 text-3xl font-bold text-primary">
                {formatRupiah(booking.amount)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Pastikan nominal sama agar pengecekan pembayaran lebih cepat.
              </p>
            </div>

            {hasUploadedPaymentProof ? (
              <Alert>
                <CheckCircle2 />
                <AlertTitle>Bukti transfer sudah dikirim</AlertTitle>
                <AlertDescription>
                  Status booking Anda sudah dibayar dan sedang menunggu
                  pengecekan admin.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="flex flex-wrap gap-3">
                <Button type="button" onClick={() => setIsDialogOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Kirim Bukti Transfer
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/riwayat-pemesanan">Lihat Riwayat Booking</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <ReceiptText className="h-5 w-5 text-primary" />
              Ringkasan Booking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">ID booking</p>
              <p className="font-semibold text-foreground">{shortenId(booking.id)}</p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">Jumlah peserta</p>
              <p className="font-semibold text-foreground">
                {booking.quantity} orang
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Mitra / Bisnis</p>
              <p className="font-semibold text-foreground">
                {booking.business?.name || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Status saat ini</p>
              <p className="font-semibold text-foreground">
                {hasUploadedPaymentProof ? "Sudah Dibayar" : "Menunggu Pembayaran"}
              </p>
            </div>

            <Alert className="bg-secondary/40">
              <AlertCircle />
              <AlertTitle>Alur pembayaran</AlertTitle>
              <AlertDescription>
                Transfer ke rekening BRI, unggah screenshot bukti transfer,
                lalu tunggu pengecekan admin di riwayat booking.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kirim Bukti Transfer</DialogTitle>
            <DialogDescription>
              Unggah foto screenshot bukti transfer, nama pengirim, dan
              nominal yang sudah dikirim.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-5" onSubmit={handleSubmitProof}>
            <div className="space-y-2">
              <Label htmlFor="payment-proof">Foto bukti transfer</Label>
              <Input
                id="payment-proof"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    file: event.target.files?.[0] ?? null,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sender-name">Nama pengirim</Label>
              <Input
                id="sender-name"
                value={formValues.senderName}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    senderName: event.target.value,
                  }))
                }
                placeholder="Masukkan nama pengirim sesuai bukti transfer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transfer-amount">Nominal uang yang ditransfer</Label>
              <Input
                id="transfer-amount"
                inputMode="numeric"
                value={formValues.transferAmount}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    transferAmount: event.target.value.replace(/\D/g, ""),
                  }))
                }
                placeholder={`${booking.amount}`}
              />
              <p className="text-xs text-muted-foreground">
                Nominal wajib sama dengan {formatRupiah(booking.amount)}.
              </p>
            </div>

            {formError && (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Gagal mengirim bukti</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Mengirim..." : "Kirim Bukti Transfer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
