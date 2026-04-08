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
  "h-14 w-full rounded-2xl border bg-white px-5 pr-14 text-base text-foreground placeholder:text-muted-foreground/80 outline-none transition focus:ring-2 focus:ring-primary/20";

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
      <h2 className="text-4xl font-semibold leading-tight text-foreground md:text-5xl">
        Daftar sebagai
        <br />
        Wisatawan
      </h2>

      <p className="mt-4 max-w-lg text-lg leading-8 text-muted-foreground">
        Bergabunglah dengan kami untuk menemukan pengalaman wisata yang tak
        terlupakan di Desa Manud Jaya.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-5">
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
            <p className="mt-2 text-sm text-red-500">{mergedErrors.password}</p>
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
          {mergedErrors.confirmPassword && (
            <p className="mt-2 text-sm text-red-500">
              {mergedErrors.confirmPassword}
            </p>
          )}
        </div>

        <div className="space-y-3 pt-2">
          <Button
            type="submit"
            className="h-14 w-full rounded-2xl text-base"
            disabled={isSubmitting}
          >
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