"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type RegisterPartnerFormProps = {
  onBack: () => void;
  onSwitchToLogin: () => void;
  onSubmit?: (formData: {
    username: string;
    businessName: string;
    ownerName: string;
    businessType: string;
    address: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => void;
};

export function RegisterPartnerForm({
  onBack,
  onSwitchToLogin,
  onSubmit,
}: RegisterPartnerFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    onSubmit?.({
      username: String(formData.get("username") ?? ""),
      businessName: String(formData.get("businessName") ?? ""),
      ownerName: String(formData.get("ownerName") ?? ""),
      businessType: String(formData.get("businessType") ?? ""),
      address: String(formData.get("address") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="mb-6 text-sm font-medium text-primary hover:underline"
      >
        ← Kembali
      </button>

      <h2 className="text-3xl font-semibold text-foreground md:text-5xl">
        Daftar sebagai Partner
      </h2>

      <p className="mt-4 text-muted-foreground">
        Bergabunglah dengan kami untuk menawarkan pengalaman wisata terbaik di
        Desa Manud Jaya.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-4">
        <input
          name="username"
          type="text"
          placeholder="Username"
          className="h-12 w-full rounded-xl border border-border bg-white px-4 outline-none focus:ring-2 focus:ring-primary/30"
        />

        <input
          name="businessName"
          type="text"
          placeholder="Nama Usaha"
          className="h-12 w-full rounded-xl border border-border bg-white px-4 outline-none focus:ring-2 focus:ring-primary/30"
        />

        <input
          name="ownerName"
          type="text"
          placeholder="Nama Pemilik"
          className="h-12 w-full rounded-xl border border-border bg-white px-4 outline-none focus:ring-2 focus:ring-primary/30"
        />

        <select
          name="businessType"
          className="h-12 w-full rounded-xl border border-border bg-white px-4 outline-none focus:ring-2 focus:ring-primary/30"
          defaultValue=""
        >
          <option value="" disabled>
            Pilih Jenis Usaha
          </option>
          <option value="Accommodation (Homestay / Lodge)">
            Accommodation (Homestay / Lodge)
          </option>
          <option value="Tourist Attraction">Tourist Attraction</option>
          <option value="Food & Beverage / Culinary">
            Food & Beverage / Culinary
          </option>
          <option value="Local Experience / Workshop">
            Local Experience / Workshop
          </option>
          <option value="Local Product / Souvenir - UMKM">
            Local Product / Souvenir - UMKM
          </option>
        </select>

        <input
          name="address"
          type="text"
          placeholder="Alamat Usaha"
          className="h-12 w-full rounded-xl border border-border bg-white px-4 outline-none focus:ring-2 focus:ring-primary/30"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="h-12 w-full rounded-xl border border-border bg-white px-4 outline-none focus:ring-2 focus:ring-primary/30"
        />

        <input
          name="phone"
          type="tel"
          placeholder="Nomor Telepon"
          className="h-12 w-full rounded-xl border border-border bg-white px-4 outline-none focus:ring-2 focus:ring-primary/30"
        />

        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="h-12 w-full rounded-xl border border-border bg-white px-4 pr-12 outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Konfirmasi Password"
            className="h-12 w-full rounded-xl border border-border bg-white px-4 pr-12 outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        <Button type="submit" className="h-12 w-full">
          Daftar
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-medium text-primary hover:underline"
        >
          Masuk di sini
        </button>
        .
      </p>
    </>
  );
}