"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export type PartnerFormData = {
  username: string;
  businessName: string;
  ownerName: string;
  businessType: string;
  address: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export type PartnerFieldErrors = Partial<Record<keyof PartnerFormData, string>>;

type RegisterPartnerFormProps = {
  onBack: () => void;
  onSwitchToLogin: () => void;
  onSubmit?: (formData: PartnerFormData) => void;
  isSubmitting?: boolean;
  fieldErrors?: PartnerFieldErrors;
};

export function RegisterPartnerForm({
  onBack,
  onSwitchToLogin,
  onSubmit,
  isSubmitting = false,
  fieldErrors = {},
}: RegisterPartnerFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<PartnerFieldErrors>({});
  const [dismissedServerErrors, setDismissedServerErrors] = useState<
    Partial<Record<keyof PartnerFormData, boolean>>
  >({});

  useEffect(() => {
    setDismissedServerErrors({});
  }, [fieldErrors]);

  const validateForm = (data: PartnerFormData) => {
    const newErrors: PartnerFieldErrors = {};

    if (!data.username.trim()) newErrors.username = "Username wajib diisi";
    if (!data.businessName.trim()) {
      newErrors.businessName = "Nama usaha wajib diisi";
    }
    if (!data.ownerName.trim()) {
      newErrors.ownerName = "Nama pemilik wajib diisi";
    }
    if (!data.businessType.trim()) {
      newErrors.businessType = "Jenis usaha wajib dipilih";
    }
    if (!data.address.trim()) {
      newErrors.address = "Alamat usaha wajib diisi";
    }
    if (!data.email.trim()) newErrors.email = "Email wajib diisi";
    if (!data.phone.trim()) newErrors.phone = "Nomor telepon wajib diisi";
    if (!data.password.trim()) newErrors.password = "Password wajib diisi";
    if (!data.confirmPassword.trim()) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    }

    if (
      data.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())
    ) {
      newErrors.email = "Format email tidak valid";
    }

    if (
      data.password.trim() &&
      data.confirmPassword.trim() &&
      data.password !== data.confirmPassword
    ) {
      newErrors.confirmPassword = "Konfirmasi password tidak sama";
    }

    return newErrors;
  };

  const getFieldError = (fieldName: keyof PartnerFormData) => {
    if (errors[fieldName]) return errors[fieldName];
    if (dismissedServerErrors[fieldName]) return undefined;
    return fieldErrors[fieldName];
  };

  const mergedErrors = useMemo(
    () =>
      ({
        username: getFieldError("username"),
        businessName: getFieldError("businessName"),
        ownerName: getFieldError("ownerName"),
        businessType: getFieldError("businessType"),
        address: getFieldError("address"),
        email: getFieldError("email"),
        phone: getFieldError("phone"),
        password: getFieldError("password"),
        confirmPassword: getFieldError("confirmPassword"),
      }) satisfies PartnerFieldErrors,
    [errors, fieldErrors, dismissedServerErrors]
  );

  const clearFieldError = (fieldName: keyof PartnerFormData) => {
    setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    setDismissedServerErrors((prev) => ({ ...prev, [fieldName]: true }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const values: PartnerFormData = {
      username: String(formData.get("username") ?? "").trim(),
      businessName: String(formData.get("businessName") ?? "").trim(),
      ownerName: String(formData.get("ownerName") ?? "").trim(),
      businessType: String(formData.get("businessType") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    };

    const validationErrors = validateForm(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSubmit?.(values);
  };

  const getInputClassName = (fieldName: keyof PartnerFormData) =>
    `h-12 w-full rounded-xl border bg-white px-4 outline-none transition focus:ring-2 focus:ring-primary/30 ${
      mergedErrors[fieldName] ? "border-red-500" : "border-border"
    }`;

  return (
    <div className="w-full">
      <h2 className="text-4xl font-semibold leading-tight text-foreground md:text-5xl">
        Daftar sebagai
        <br />
        Mitra
      </h2>

      <p className="mt-4 text-muted-foreground">
        Bergabunglah dengan kami untuk menawarkan pengalaman wisata terbaik di
        Desa Manud Jaya.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-4">
        <div>
          <input
            name="username"
            type="text"
            placeholder="Username"
            className={getInputClassName("username")}
            onChange={() => clearFieldError("username")}
          />
          {mergedErrors.username && (
            <p className="mt-1 text-sm text-red-500">{mergedErrors.username}</p>
          )}
        </div>

        <div>
          <input
            name="businessName"
            type="text"
            placeholder="Nama Usaha"
            className={getInputClassName("businessName")}
            onChange={() => clearFieldError("businessName")}
          />
          {mergedErrors.businessName && (
            <p className="mt-1 text-sm text-red-500">
              {mergedErrors.businessName}
            </p>
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
          {mergedErrors.ownerName && (
            <p className="mt-1 text-sm text-red-500">
              {mergedErrors.ownerName}
            </p>
          )}
        </div>

        <div>
          <select
            name="businessType"
            className={getInputClassName("businessType")}
            defaultValue=""
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
          {mergedErrors.businessType && (
            <p className="mt-1 text-sm text-red-500">
              {mergedErrors.businessType}
            </p>
          )}
        </div>

        <div>
          <input
            name="address"
            type="text"
            placeholder="Alamat Usaha"
            className={getInputClassName("address")}
            onChange={() => clearFieldError("address")}
          />
          {mergedErrors.address && (
            <p className="mt-1 text-sm text-red-500">{mergedErrors.address}</p>
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
          {mergedErrors.email && (
            <p className="mt-1 text-sm text-red-500">{mergedErrors.email}</p>
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
          {mergedErrors.phone && (
            <p className="mt-1 text-sm text-red-500">{mergedErrors.phone}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`${getInputClassName("password")} pr-12`}
              onChange={() => clearFieldError("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {mergedErrors.password && (
            <p className="mt-1 text-sm text-red-500">{mergedErrors.password}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Konfirmasi Password"
              className={`${getInputClassName("confirmPassword")} pr-12`}
              onChange={() => clearFieldError("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
          {mergedErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {mergedErrors.confirmPassword}
            </p>
          )}
        </div>

        <Button type="submit" className="h-12 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Mendaftarkan..." : "Daftar"}
        </Button>

        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full rounded-2xl border border-stone-300 bg-white px-5 py-4 text-base font-medium text-foreground transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Kembali
        </button>
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
    </div>
  );
}