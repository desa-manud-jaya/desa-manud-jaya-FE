"use client";

import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type LoginRole = "traveler" | "partner" | "admin";

type LoginFormProps = {
  onSwitchToRegister: () => void;
  onSubmit?: (formData: {
    username: string;
    password: string;
    role: LoginRole;
  }) => void;
};

type LoginFormErrors = {
  username?: string;
  password?: string;
};

export function LoginForm({ onSwitchToRegister, onSubmit }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();
    const role = String(formData.get("role") ?? "traveler") as LoginRole;

    const newErrors: LoginFormErrors = {};

    if (!username) newErrors.username = "Username wajib diisi.";
    if (!password) newErrors.password = "Password wajib diisi.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    console.log("LOGIN FORM SUBMIT:", { username, password, role });
    onSubmit?.({ username, password, role });
  };

  return (
    <>
      <h2 className="text-3xl font-semibold text-foreground md:text-5xl">
        Masuk ke akun Anda
      </h2>

      <p className="mt-4 text-muted-foreground">
        Silakan login untuk melanjutkan perjalanan Anda.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-4">
        <div>
          <input
            name="username"
            type="text"
            placeholder="Username"
            className="h-12 w-full rounded-xl border border-border bg-white px-4 outline-none focus:ring-2 focus:ring-primary/30"
            onChange={() =>
              setErrors((prev) => ({ ...prev, username: undefined }))
            }
          />
          {errors.username && (
            <p className="mt-2 text-sm text-red-500">{errors.username}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="h-12 w-full rounded-xl border border-border bg-white px-4 pr-14 outline-none focus:ring-2 focus:ring-primary/30"
              onChange={() =>
                setErrors((prev) => ({ ...prev, password: undefined }))
              }
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
          {errors.password && (
            <p className="mt-2 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Masuk sebagai
          </label>
          <select
            name="role"
            defaultValue="traveler"
            className="h-12 w-full rounded-xl border border-border bg-white px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="traveler">Wisatawan</option>
            <option value="partner">Kemitraan</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <Button type="submit" className="h-12 w-full">
          Masuk
        </Button>

        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-sm text-primary hover:underline"
        >
          Belum punya akun? Daftar
        </button>
      </form>
    </>
  );
}
