"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, CheckCircle2, LockKeyhole, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatRupiah } from "@/lib/data";
import {
  createBookingApi,
  getCurrentUser,
  type LoggedInUser,
} from "@/lib/services/booking-service";

type BookingFormProps = {
  packageItem: {
    id: string;
    title: string;
    duration: string;
    price: number;
    image: string;
    businessId: string | null;
  };
};

type BookingFormValues = {
  contactName: string;
  contactPhone: string;
  travelDate: string;
  participantCount: number;
  notes: string;
};

type BookingFormErrors = Partial<Record<keyof BookingFormValues, string>>;

function getMinTravelDate() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function validateBookingForm(values: BookingFormValues): BookingFormErrors {
  const errors: BookingFormErrors = {};

  if (!values.contactName.trim()) {
    errors.contactName = "Nama kontak wajib diisi.";
  }

  const phoneDigits = values.contactPhone.replace(/\D/g, "");
  if (!values.contactPhone.trim()) {
    errors.contactPhone = "Nomor telepon wajib diisi.";
  } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    errors.contactPhone = "Nomor telepon tidak valid.";
  }

  if (!values.travelDate) {
    errors.travelDate = "Tanggal keberangkatan wajib dipilih.";
  }

  if (
    !Number.isFinite(values.participantCount) ||
    values.participantCount < 1
  ) {
    errors.participantCount = "Jumlah peserta minimal 1 orang.";
  }

  return errors;
}

export function BookingForm({ packageItem }: BookingFormProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<BookingFormValues>({
    contactName: "",
    contactPhone: "",
    travelDate: "",
    participantCount: 1,
    notes: "",
  });
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [successState, setSuccessState] = useState<{
    bookingCode: string;
    totalPrice: number;
  } | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setFormValues((prev) => ({
      ...prev,
      contactName: user?.name || user?.username || "",
    }));
    setIsReady(true);
  }, []);

  const totalPrice = useMemo(
    () =>
      packageItem.price * Math.max(1, Number(formValues.participantCount) || 1),
    [packageItem.price, formValues.participantCount],
  );

  const isTraveler = currentUser?.role === "traveler";

  const updateField = <K extends keyof BookingFormValues>(
    field: K,
    value: BookingFormValues[K],
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const sanitizedValues: BookingFormValues = {
      ...formValues,
      contactName: formValues.contactName.trim(),
      contactPhone: formValues.contactPhone.trim(),
      notes: formValues.notes.trim(),
      participantCount: Number(formValues.participantCount) || 0,
    };

    const nextErrors = validateBookingForm(sanitizedValues);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    if (!currentUser || !isTraveler) {
      setErrors({
        notes: "Silakan login sebagai wisatawan untuk melakukan booking.",
      });
      return;
    }
    if (!packageItem.businessId) {
      setErrors({
        notes: "Business ID paket tidak ditemukan. Silakan coba lagi.",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        businessId: packageItem.businessId,
        packageId: packageItem.id,
        tripDate: sanitizedValues.travelDate,
        quantity: sanitizedValues.participantCount,
      };

      console.log("BOOKING API PAYLOAD:", payload);
      console.log("BOOKING CURRENT USER:", currentUser);
      console.log("BOOKING TOKEN:", currentUser.token);

      const response = await createBookingApi(payload, currentUser.token);

      setSuccessState({
        bookingCode: response.bookingCode ?? response.id ?? "",
        totalPrice,
      });
    } catch (error) {
      setErrors({
        notes:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat membuat booking.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReady) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-muted-foreground">
          Menyiapkan form booking...
        </CardContent>
      </Card>
    );
  }

  if (!currentUser) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <LockKeyhole className="h-5 w-5 text-primary" />
            Login untuk melakukan booking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Anda harus masuk sebagai wisatawan terlebih dahulu untuk memesan
            paket ini.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/">Kembali ke Beranda</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/paket/${packageItem.id}`}>Lihat Detail Paket</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isTraveler) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-foreground">
            Booking hanya untuk wisatawan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Akun yang sedang aktif bukan akun wisatawan. Silakan masuk
            menggunakan akun traveler untuk melakukan pemesanan.
          </p>
          <Button variant="outline" asChild>
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (successState) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
            Booking berhasil dibuat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-emerald-700/90">
            Booking Anda untuk paket <strong>{packageItem.title}</strong>{" "}
            berhasil disimpan.
          </p>
          <div className="rounded-xl border border-emerald-200 bg-white p-4 text-sm text-foreground">
            <p>
              <strong>Kode booking:</strong> {successState.bookingCode}
            </p>
            <p>
              <strong>Total pembayaran:</strong>{" "}
              {formatRupiah(successState.totalPrice)}
            </p>
            <p>
              <strong>Status:</strong> Menunggu Konfirmasi
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => router.push("/riwayat-pemesanan")}>
              Lihat Riwayat Booking
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/paket/${packageItem.id}`}>
                Kembali ke Detail Paket
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Form Booking Wisata</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Nama kontak
                </label>
                <Input
                  value={formValues.contactName}
                  onChange={(event) =>
                    updateField("contactName", event.target.value)
                  }
                  placeholder="Masukkan nama kontak"
                />
                {errors.contactName && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.contactName}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Nomor telepon
                </label>
                <Input
                  value={formValues.contactPhone}
                  onChange={(event) =>
                    updateField("contactPhone", event.target.value)
                  }
                  placeholder="08xxxxxxxxxx"
                />
                {errors.contactPhone && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.contactPhone}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Tanggal keberangkatan
                </label>
                <Input
                  type="date"
                  min={getMinTravelDate()}
                  value={formValues.travelDate}
                  onChange={(event) =>
                    updateField("travelDate", event.target.value)
                  }
                />
                {errors.travelDate && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.travelDate}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Jumlah peserta
                </label>
                <Input
                  type="number"
                  min={1}
                  value={formValues.participantCount}
                  onChange={(event) =>
                    updateField("participantCount", Number(event.target.value))
                  }
                />
                {errors.participantCount && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.participantCount}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Catatan tambahan
              </label>
              <Textarea
                value={formValues.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                placeholder="Contoh: kebutuhan makanan, permintaan khusus, atau catatan lainnya"
                rows={5}
              />
              {errors.notes && (
                <p className="mt-2 text-sm text-red-500">{errors.notes}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan booking..." : "Konfirmasi Booking"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={`/paket/${packageItem.id}`}>Batal</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="h-fit border-primary/20">
        <CardHeader>
          <CardTitle className="text-foreground">Ringkasan Booking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Paket</p>
            <p className="font-semibold text-foreground">{packageItem.title}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 text-primary" />
            {packageItem.duration}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            {Math.max(1, Number(formValues.participantCount) || 1)} peserta
          </div>

          <Separator />

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Harga per orang</span>
            <span className="font-medium text-foreground">
              {formatRupiah(packageItem.price)}
            </span>
          </div>

          <div className="flex items-center justify-between text-base">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-bold text-primary">
              {formatRupiah(totalPrice)}
            </span>
          </div>

          <div className="rounded-xl bg-primary/5 p-4 text-xs leading-relaxed text-muted-foreground">
            Setelah booking dibuat, status awal akan menjadi{" "}
            <strong>Menunggu Konfirmasi</strong>. Admin dapat menghubungi Anda
            untuk tindak lanjut pembayaran atau konfirmasi perjalanan.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
