"use client";

import { Button } from "@/components/ui/button";

type LoginRole = "traveler" | "partner" | "admin";

type LoginFormProps = {
  onSwitchToRegister: () => void;
  onSubmit?: (formData: {
    email: string;
    password: string;
    role: LoginRole;
  }) => void;
};

export function LoginForm({ onSwitchToRegister, onSubmit }: LoginFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const role = String(formData.get("role") ?? "traveler") as LoginRole;

    onSubmit?.({ email, password, role });
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
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="h-12 w-full rounded-xl border border-border bg-white px-4 outline-none focus:ring-2 focus:ring-primary/30"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="h-12 w-full rounded-xl border border-border bg-white px-4 outline-none focus:ring-2 focus:ring-primary/30"
        />

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
