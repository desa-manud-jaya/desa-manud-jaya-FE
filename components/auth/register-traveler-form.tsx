"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { validateTravelerForm } from "@/components/auth/validator";

export type RegisterTravelerFormValues = {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export type TravelerFormErrors = Partial<
  Record<keyof RegisterTravelerFormValues, string>
>;

type RegisterTravelerFormProps = {
  onBack: () => void;
  onSwitchToLogin: () => void;
  onSubmit?: (formData: RegisterTravelerFormValues) => void;
  isSubmitting?: boolean;
  fieldErrors?: TravelerFormErrors;
};

const inputClassName =
  "h-12 w-full rounded-lg border bg-white px-4 text-sm text-foreground placeholder:text-muted-foreground/80 outline-none transition focus:ring-2 focus:ring-primary/25";

export function RegisterTravelerForm({
  onBack,
  onSwitchToLogin,
  onSubmit,
  isSubmitting = false,
  fieldErrors = {},
}: RegisterTravelerFormProps) {
  const [errors, setErrors] = useState<TravelerFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dismissedServerErrors, setDismissedServerErrors] = useState<
    Partial<Record<keyof RegisterTravelerFormValues, boolean>>
  >({});

  useEffect(() => {
    setDismissedServerErrors({});
  }, [fieldErrors]);

  const getFieldError = (field: keyof RegisterTravelerFormValues) => {
    if (errors[field]) return errors[field];
    if (dismissedServerErrors[field]) return undefined;
    return fieldErrors[field];
  };

  const mergedErrors = useMemo(
    () =>
      ({
        username: getFieldError("username"),
        fullName: getFieldError("fullName"),
        email: getFieldError("email"),
        phone: getFieldError("phone"),
        password: getFieldError("password"),
        confirmPassword: getFieldError("confirmPassword"),
      }) satisfies TravelerFormErrors,
    [errors, fieldErrors, dismissedServerErrors]
  );

  const getInputClassName = (field: keyof RegisterTravelerFormValues) =>
    `${inputClassName} ${
      mergedErrors[field]
        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
        : "border-stone-300 focus:border-primary"
    }`;

  const clearFieldError = (field: keyof RegisterTravelerFormValues) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setDismissedServerErrors((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const values: RegisterTravelerFormValues = {
      username: String(formData.get("username") ?? "").trim(),
      fullName: String(formData.get("fullName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    };

    const nextErrors = validateTravelerForm(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onSubmit?.(values);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
          Wisatawan
        </p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground md:text-4xl">
          Buat akun perjalanan
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Temukan paket wisata, simpan booking, dan ikuti perjalanan Anda di
          Desa Manud Jaya.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <input
            name="username"
            type="text"
            placeholder="Username"
            className={getInputClassName("username")}
            onChange={() => clearFieldError("username")}
          />
          {mergedErrors.username && (
            <p className="mt-2 text-sm text-red-500">{mergedErrors.username}</p>
          )}
        </div>

        <div>
          <input
            name="fullName"
            type="text"
            placeholder="Nama Lengkap"
            className={getInputClassName("fullName")}
            onChange={() => clearFieldError("fullName")}
          />
          {mergedErrors.fullName && (
            <p className="mt-2 text-sm text-red-500">{mergedErrors.fullName}</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              className={getInputClassName("email")}
              onChange={() => clearFieldError("email")}
            />
            {mergedErrors.email && (
              <p className="mt-2 text-sm text-red-500">{mergedErrors.email}</p>
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
              <p className="mt-2 text-sm text-red-500">{mergedErrors.phone}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
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
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground transition hover:text-foreground"
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
              <p className="mt-2 text-sm text-red-500">
                {mergedErrors.password}
              </p>
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
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground transition hover:text-foreground"
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
              <p className="mt-2 text-sm text-red-500">
                {mergedErrors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-3 pt-2 md:grid-cols-[1fr_auto]">
          <Button
            type="submit"
            className="h-12 rounded-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Mendaftarkan..." : "Daftar Wisatawan"}
          </Button>

          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="rounded-lg border border-border bg-white px-5 py-3 text-sm font-medium text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            Pilih role lain
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
