"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type PartnerFormValues,
  validatePartnerForm,
} from "@/components/auth/validator";

type RegisterPartnerFormProps = {
  onBack: () => void;
  onSwitchToLogin: () => void;
  onSubmit?: (formData: PartnerFormValues) => void;
};

type PartnerFormErrors = Partial<Record<keyof PartnerFormValues, string>>;

const inputClassName =
  "h-14 w-full rounded-2xl border bg-white px-5 pr-14 text-base text-foreground placeholder:text-muted-foreground/80 outline-none transition focus:ring-2 focus:ring-primary/20";

const selectClassName =
  "h-14 w-full rounded-2xl border bg-white px-5 text-base text-foreground outline-none transition focus:ring-2 focus:ring-primary/20";

export function RegisterPartnerForm({
  onBack,
  onSwitchToLogin,
  onSubmit,
}: RegisterPartnerFormProps) {
  const [errors, setErrors] = useState<PartnerFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getInputClassName = (field: keyof PartnerFormValues) =>
    `${
      field === "businessType" ? selectClassName : inputClassName
    } ${
      errors[field]
        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
        : "border-stone-300 focus:border-primary"
    }`;

  const clearFieldError = (field: keyof PartnerFormValues) => {
    if (!errors[field]) return;
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const values: PartnerFormValues = {
      businessName: String(formData.get("businessName") ?? ""),
      ownerName: String(formData.get("ownerName") ?? ""),
      businessType: String(formData.get("businessType") ?? ""),
      businessAddress: String(formData.get("businessAddress") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    };

    const nextErrors = validatePartnerForm(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    const payload = {
      role: "partner",
      fullName: values.ownerName,
      businessName: values.businessName,
      businessType: values.businessType,
      businessAddress: values.businessAddress,
      email: values.email,
      phone: values.phone,
      password: values.password,
    };

    console.log("REGISTER PARTNER FORM VALUES:", values);
    console.log("REGISTER PARTNER API PAYLOAD:", payload);

    onSubmit?.(values);
  };

  return (
    <div className="w-full">
      <h2 className="text-4xl font-semibold leading-tight text-foreground md:text-5xl">
        Daftar sebagai
        <br />
        Partner
      </h2>

      <p className="mt-4 max-w-lg text-lg leading-8 text-muted-foreground">
        Bergabunglah dengan kami untuk menawarkan pengalaman wisata yang tak
        terlupakan kepada para wisatawan.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-5">
        <div>
          <input
            name="businessName"
            type="text"
            placeholder="Nama Usaha"
            className={getInputClassName("businessName")}
            onChange={() => clearFieldError("businessName")}
          />
          {errors.businessName && (
            <p className="mt-2 text-sm text-red-500">{errors.businessName}</p>
          )}
        </div>

        <div>
          <input
            name="ownerName"
            type="text"
            placeholder="Nama Pemilik"
            className={getInputClassName("ownerName")}
            onChange={() => clearFieldError("ownerName")}
          />
          {errors.ownerName && (
            <p className="mt-2 text-sm text-red-500">{errors.ownerName}</p>
          )}
        </div>

        <div>
          <select
            name="businessType"
            defaultValue=""
            className={getInputClassName("businessType")}
            onChange={() => clearFieldError("businessType")}
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
          {errors.businessType && (
            <p className="mt-2 text-sm text-red-500">{errors.businessType}</p>
          )}
        </div>

        <div>
          <input
            name="businessAddress"
            type="text"
            placeholder="Alamat Usaha"
            className={getInputClassName("businessAddress")}
            onChange={() => clearFieldError("businessAddress")}
          />
          {errors.businessAddress && (
            <p className="mt-2 text-sm text-red-500">
              {errors.businessAddress}
            </p>
          )}
        </div>

        <div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            className={getInputClassName("email")}
            onChange={() => clearFieldError("email")}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            name="phone"
            type="tel"
            placeholder="Nomor Telepon"
            className={getInputClassName("phone")}
            onChange={() => clearFieldError("phone")}
          />
          {errors.phone && (
            <p className="mt-2 text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={getInputClassName("password")}
              onChange={() => clearFieldError("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex w-14 items-center justify-center text-muted-foreground transition hover:text-foreground"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Konfirmasi Password"
              className={getInputClassName("confirmPassword")}
              onChange={() => clearFieldError("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex w-14 items-center justify-center text-muted-foreground transition hover:text-foreground"
              aria-label={
                showConfirmPassword
                  ? "Sembunyikan konfirmasi password"
                  : "Tampilkan konfirmasi password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-500">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="space-y-3 pt-2">
          <Button type="submit" className="h-14 w-full rounded-2xl text-base">
            Daftar
          </Button>

          <button
            type="button"
            onClick={onBack}
            className="w-full rounded-2xl border border-stone-300 bg-white px-5 py-4 text-base font-medium text-foreground transition hover:bg-stone-50"
          >
            Kembali
          </button>
        </div>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
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
    </div>
  );
}