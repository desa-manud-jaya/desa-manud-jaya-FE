"use client";

import Image from "next/image";
import GreenLeaf from "../public/greenleaf.svg";
import { Button } from "@/components/ui/button";
import { Leaf, X } from "lucide-react";
import type { AuthMode } from "@/components/landing-page";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterChoiceForm } from "@/components/auth/register-choice-form";

type HeroSectionProps = {
  authMode: AuthMode;
  onCloseAuth: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLoginSubmit: (formData: {
    email: string;
    password: string;
    role: "traveler" | "partner" | "admin";
  }) => void;
};

export function HeroSection({
  authMode,
  onCloseAuth,
  onOpenLogin,
  onOpenRegister,
  onLoginSubmit,
}: HeroSectionProps) {
  const isAuthOpen = authMode !== null;

  return (
    <section
      id="beranda"
      className="relative flex min-h-screen items-center overflow-hidden bg-background"
    >
      <div
        className={[
          "absolute inset-y-0 right-0 z-0 transition-all duration-700 ease-in-out",
          isAuthOpen
            ? "w-full overflow-hidden md:w-1/2 md:rounded-bl-[48px]"
            : "w-full",
        ].join(" ")}
      >
        <Image
          src="/images/hero.jpg"
          alt="Pemandangan Desa Manud Jaya"
          fill
          className="object-cover"
          priority
        />
        <div
          className={[
            "absolute inset-0 transition-all duration-700",
            isAuthOpen ? "bg-foreground/35" : "bg-foreground/60",
          ].join(" ")}
        />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-32 md:py-40">
          <div
            className={[
              "max-w-2xl transition-all duration-500 ease-in-out",
              isAuthOpen
                ? "pointer-events-none translate-y-4 opacity-0"
                : "translate-y-0 opacity-100",
            ].join(" ")}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-sm font-medium text-primary-foreground backdrop-blur-sm">
              <Leaf className="h-4 w-4" />
              <span>Wisata Berkelanjutan</span>
            </div>

            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-primary-foreground md:text-6xl lg:text-7xl">
              Jelajahi Keindahan Desa Manud Jaya
            </h1>

            <p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-primary-foreground/80">
              Platform wisata berkelanjutan yang menghubungkan Anda dengan
              destinasi alam, budaya, dan akomodasi ramah lingkungan di jantung
              desa yang asri.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button size="lg" asChild>
                <a href="#paket">Lihat Paket Wisata</a>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
                onClick={onOpenRegister}
              >
                Gabung Kemitraan Kami
              </Button>
            </div>

            <div className="mt-6 inline-flex items-center gap-3">
              <Image
                src={GreenLeaf}
                width={22}
                height={22}
                alt="green leaf"
                className="shrink-0"
              />
              <p className="text-base font-medium leading-none text-primary-foreground/80 drop-shadow-sm">
                Certified Eco-Friendly Experiences
              </p>
            </div>

            <div className="mt-12 flex flex-wrap gap-8">
              {[
                { value: "8+", label: "Destinasi Wisata" },
                { value: "6", label: "Paket Eco-Tour" },
                { value: "100%", label: "Ramah Lingkungan" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-primary-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-primary-foreground/70">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className={[
          "absolute inset-y-0 left-0 z-20 overflow-hidden bg-[#f5f5f0] transition-all duration-700 ease-in-out",
          isAuthOpen
            ? "w-full translate-x-0 opacity-100 md:w-1/2"
            : "pointer-events-none -translate-x-full opacity-0 md:w-1/2",
        ].join(" ")}
      >
        <div className="hide-scrollbar h-screen overflow-y-auto px-6 pb-10 pt-28 md:px-16">
          <div className="mx-auto w-full max-w-xl">
            <button
              type="button"
              onClick={onCloseAuth}
              className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Tutup
            </button>

            {authMode === "register" ? (
              <RegisterChoiceForm
                onSwitchToLogin={onOpenLogin}
                onSelectTraveler={() => {
                  console.log("pilih traveler");
                }}
                onSelectPartner={() => {
                  console.log("pilih partner");
                }}
                onSubmitTraveler={(values) => {
                  console.log("submit traveler:", values);
                }}
                onSubmitPartner={(values) => {
                  console.log("submit partner:", values);
                }}
              />
            ) : authMode === "login" ? (
              <LoginForm
                onSwitchToRegister={onOpenRegister}
                onSubmit={onLoginSubmit}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}