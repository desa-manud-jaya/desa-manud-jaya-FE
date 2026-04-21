"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Eye, EyeOff, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";

export type GuideFormData = {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  cv: File | null;
  password: string;
  confirmPassword: string;
};

export type GuideFieldErrors = Partial<Record<keyof GuideFormData, string>>;

type RegisterGuideFormProps = {
  onBack: () => void;
  onSwitchToLogin: () => void;
  onSubmit?: (formData: GuideFormData) => void;
  isSubmitting?: boolean;
  fieldErrors?: GuideFieldErrors;
};

const inputClassName =
  "h-12 w-full rounded-lg border bg-white px-4 text-sm outline-none transition focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60";

const allowedCvTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const allowedCvExtensions = [".pdf", ".doc", ".docx"];
const maxCvSize = 5 * 1024 * 1024;

function isAllowedCv(file: File) {
  const fileName = file.name.toLowerCase();
  const hasAllowedExtension = allowedCvExtensions.some(
    (extension) => fileName.endsWith(extension),
  );

  return allowedCvTypes.includes(file.type) || hasAllowedExtension;
}

function validateGuideForm(data: GuideFormData) {
  const errors: GuideFieldErrors = {};
  const phoneDigits = data.phone.replace(/\D/g, "");

  if (!data.username.trim()) errors.username = "Username wajib diisi.";
  if (!data.fullName.trim()) errors.fullName = "Nama lengkap wajib diisi.";
  if (!data.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Format email tidak valid.";
  }
  if (!data.phone.trim()) {
    errors.phone = "Nomor telepon wajib diisi.";
  } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    errors.phone = "Nomor telepon tidak valid.";
  }
  if (!data.licenseNumber.trim()) {
    errors.licenseNumber = "Nomor lisensi wajib diisi.";
  }
  if (!data.cv) {
    errors.cv = "CV guide wajib diunggah.";
  } else if (!isAllowedCv(data.cv)) {
    errors.cv = "CV guide harus berupa PDF, DOC, atau DOCX.";
  } else if (data.cv.size > maxCvSize) {
    errors.cv = "Ukuran CV maksimal 5 MB.";
  }
  if (!data.password) {
    errors.password = "Password wajib diisi.";
  } else if (data.password.length < 8) {
    errors.password = "Password minimal 8 karakter.";
  }
  if (!data.confirmPassword) {
    errors.confirmPassword = "Konfirmasi password wajib diisi.";
  } else if (data.confirmPassword !== data.password) {
    errors.confirmPassword = "Konfirmasi password tidak sama.";
  }

  return errors;
}

export function RegisterGuideForm({
  onBack,
  onSwitchToLogin,
  onSubmit,
  isSubmitting = false,
  fieldErrors = {},
}: RegisterGuideFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [errors, setErrors] = useState<GuideFieldErrors>({});
  const [dismissedServerErrors, setDismissedServerErrors] = useState<
    Partial<Record<keyof GuideFormData, boolean>>
  >({});

  useEffect(() => {
    setDismissedServerErrors({});
  }, [fieldErrors]);

  const getFieldError = (fieldName: keyof GuideFormData) => {
    if (errors[fieldName]) return errors[fieldName];
    if (dismissedServerErrors[fieldName]) return undefined;
    return fieldErrors[fieldName];
  };

  const mergedErrors = useMemo(
    () =>
      ({
        username: getFieldError("username"),
        fullName: getFieldError("fullName"),
        email: getFieldError("email"),
        phone: getFieldError("phone"),
        licenseNumber: getFieldError("licenseNumber"),
        cv: getFieldError("cv"),
        password: getFieldError("password"),
        confirmPassword: getFieldError("confirmPassword"),
      }) satisfies GuideFieldErrors,
    [errors, fieldErrors, dismissedServerErrors],
  );

  const clearFieldError = (fieldName: keyof GuideFormData) => {
    setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    setDismissedServerErrors((prev) => ({ ...prev, [fieldName]: true }));
  };

  const getInputClassName = (fieldName: keyof GuideFormData) =>
    `${inputClassName} ${
      mergedErrors[fieldName]
        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
        : "border-border focus:border-primary"
    }`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const cv = formData.get("cv");
    const values: GuideFormData = {
      username: String(formData.get("username") ?? "").trim(),
      fullName: String(formData.get("fullName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      licenseNumber: String(formData.get("licenseNumber") ?? "").trim(),
      cv:
        cv instanceof File && cv.size > 0
          ? cv
          : null,
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    };

    const nextErrors = validateGuideForm(values);

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
          Guide lokal
        </p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground md:text-4xl">
          Daftar sebagai pemandu wisata
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Akun guide akan masuk status pending untuk verifikasi admin.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <input
            name="username"
            type="text"
            placeholder="Username"
            disabled={isSubmitting}
            className={getInputClassName("username")}
            onChange={() => clearFieldError("username")}
          />
          {mergedErrors.username && (
            <p className="mt-1 text-sm text-red-500">{mergedErrors.username}</p>
          )}
        </div>

        <div>
          <input
            name="fullName"
            type="text"
            placeholder="Nama lengkap"
            disabled={isSubmitting}
            className={getInputClassName("fullName")}
            onChange={() => clearFieldError("fullName")}
          />
          {mergedErrors.fullName && (
            <p className="mt-1 text-sm text-red-500">{mergedErrors.fullName}</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              disabled={isSubmitting}
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
              placeholder="Nomor telepon"
              disabled={isSubmitting}
              className={getInputClassName("phone")}
              onChange={() => clearFieldError("phone")}
            />
            {mergedErrors.phone && (
              <p className="mt-1 text-sm text-red-500">{mergedErrors.phone}</p>
            )}
          </div>
        </div>

        <div>
          <input
            name="licenseNumber"
            type="text"
            placeholder="Nomor lisensi guide"
            disabled={isSubmitting}
            className={getInputClassName("licenseNumber")}
            onChange={() => clearFieldError("licenseNumber")}
          />
          {mergedErrors.licenseNumber && (
            <p className="mt-1 text-sm text-red-500">
              {mergedErrors.licenseNumber}
            </p>
          )}
        </div>

        <div>
          <label
            className={`flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-lg border bg-white px-4 py-3 text-sm outline-none transition focus-within:ring-2 focus-within:ring-primary/25 ${
              mergedErrors.cv
                ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-200"
                : "border-border focus-within:border-primary"
            } ${
              isSubmitting
                ? "cursor-not-allowed opacity-60"
                : "hover:border-primary/60"
            }`}
          >
            <FileText className="h-5 w-5 shrink-0 text-primary" />
            <span className="min-w-0 flex-1 truncate text-muted-foreground">
              {selectedFileName || "Unggah CV guide"}
            </span>
            <span className="shrink-0 rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground">
              Pilih file
            </span>
            <input
              name="cv"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              disabled={isSubmitting}
              className="sr-only"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0] ?? null;
                setSelectedFileName(file?.name ?? "");
                clearFieldError("cv");
              }}
            />
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            Format PDF, DOC, atau DOCX. Maksimal 5 MB.
          </p>
          {mergedErrors.cv && (
            <p className="mt-1 text-sm text-red-500">
              {mergedErrors.cv}
            </p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                disabled={isSubmitting}
                className={`${getInputClassName("password")} pr-12`}
                onChange={() => clearFieldError("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isSubmitting}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
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
              <p className="mt-1 text-sm text-red-500">
                {mergedErrors.password}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Konfirmasi password"
                disabled={isSubmitting}
                className={`${getInputClassName("confirmPassword")} pr-12`}
                onChange={() => clearFieldError("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                disabled={isSubmitting}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
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
        </div>

        <div className="grid gap-3 pt-2 md:grid-cols-[1fr_auto]">
          <Button type="submit" className="h-12 rounded-lg" disabled={isSubmitting}>
            {isSubmitting ? "Mendaftarkan..." : "Daftar Guide"}
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
