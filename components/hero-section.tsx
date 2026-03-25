"use client";

import { useState } from "react";
import Image from "next/image";
import GreenLeaf from "../public/greenleaf.svg";
import { Button } from "@/components/ui/button";
import { Leaf, X } from "lucide-react";
import type { AuthMode } from "@/components/landing-page";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterChoiceForm } from "@/components/auth/register-choice-form";
import {
  registerTraveler,
  registerPartner,
  login,
} from "@/lib/services/auth-service";
import { mapBusinessTypeToApi } from "@/lib/mappers/business-type";

type HeroSectionProps = {
  authMode: AuthMode;
  onCloseAuth: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLoginSubmit: (user: {
    id: string;
    token: string;
    username: string;
    backendRole: string;
    name: string;
    email: string;
    role: "traveler" | "partner" | "admin";
    roleLabel: string;
  }) => void;
};

type TravelerRegisterValues = {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type PartnerRegisterValues = {
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

type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

export function HeroSection({
  authMode,
  onCloseAuth,
  onOpenLogin,
  onOpenRegister,
  onLoginSubmit,
}: HeroSectionProps) {
  const isAuthOpen = authMode !== null;

  const [isSubmittingTraveler, setIsSubmittingTraveler] = useState(false);
  const [isSubmittingPartner, setIsSubmittingPartner] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  const handleRegisterTraveler = async (values: TravelerRegisterValues) => {
    setFeedback(null);

    if (values.password !== values.confirmPassword) {
      setFeedback({
        type: "error",
        message: "Password dan konfirmasi password tidak sama.",
      });
      return;
    }

    try {
      setIsSubmittingTraveler(true);

      const payload = {
        username: values.username.trim(),
        email: values.email.trim(),
        password: values.password,
      };
      console.log("REGISTER TRAVELER PAYLOAD:", payload);

      const response = await registerTraveler(payload);

      console.log("REGISTER TRAVELER RESPONSE:", response);

      setFeedback({
        type: "success",
        message:
          "Registrasi wisatawan berhasil. Silakan login menggunakan akun Anda.",
      });

      onOpenLogin();
    } catch (error) {
      console.error("REGISTER TRAVELER ERROR:", error);

      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat registrasi wisatawan.",
      });
    } finally {
      setIsSubmittingTraveler(false);
    }
  };

  const handleRegisterPartner = async (values: PartnerRegisterValues) => {
    setFeedback(null);

    if (values.password !== values.confirmPassword) {
      setFeedback({
        type: "error",
        message: "Password dan konfirmasi password tidak sama.",
      });
      return;
    }

    try {
      setIsSubmittingPartner(true);

      const payload = {
        username: values.username.trim(),
        email: values.email.trim(),
        password: values.password,
        jenisUsaha: mapBusinessTypeToApi(values.businessType),
        namaUsaha: values.businessName.trim(),
        namaOwner: values.ownerName.trim(),
        description: "",
        ktpNumber: "",
        phone: values.phone.trim(),
        address: values.address.trim(),
      };

      console.log("REGISTER PARTNER PAYLOAD:", payload);

      const response = await registerPartner(payload);

      console.log("REGISTER PARTNER RESPONSE:", response);

      setFeedback({
        type: "success",
        message:
          "Registrasi mitra berhasil dikirim. Silakan tunggu proses verifikasi dari admin.",
      });

      onOpenLogin();
    } catch (error) {
      console.error("REGISTER PARTNER ERROR:", error);

      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat registrasi mitra.",
      });
    } finally {
      setIsSubmittingPartner(false);
    }
  };

  function mapBackendRoleToFrontendRole(
    backendRole: string,
  ): "traveler" | "partner" | "admin" {
    switch (backendRole) {
      case "ADMIN":
        return "admin";
      case "VENDOR":
        return "partner";
      case "USER":
      default:
        return "traveler";
    }
  }

  function getRoleLabel(role: "traveler" | "partner" | "admin") {
    switch (role) {
      case "admin":
        return "Admin";
      case "partner":
        return "Partner";
      case "traveler":
      default:
        return "Traveler";
    }
  }

  const handleLoginSubmit = async (values: {
    username: string;
    password: string;
    role: "traveler" | "partner" | "admin";
  }) => {
    setFeedback(null);

    try {
      setIsSubmittingLogin(true);

      const payload = {
        username: values.username.trim(),
        password: values.password,
      };

      console.log("LOGIN PAYLOAD:", payload);

      const response = await login(payload);

      console.log("LOGIN RESPONSE:", response);

      const frontendRole = mapBackendRoleToFrontendRole(response.role);

      const loggedInUser = {
        id: response.id,
        token: response.token,
        username: response.username,
        backendRole: response.role,
        name: response.username,
        email: "",
        role: frontendRole,
        roleLabel: getRoleLabel(frontendRole),
      };

      setFeedback({
        type: "success",
        message: "Login berhasil.",
      });

      onLoginSubmit(loggedInUser);
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat login.",
      });
    } finally {
      setIsSubmittingLogin(false);
    }
  };

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
              onClick={() => {
                setFeedback(null);
                onCloseAuth();
              }}
              className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Tutup
            </button>

            {feedback && (
              <div
                className={[
                  "mb-6 rounded-xl border px-4 py-3 text-sm",
                  feedback.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700",
                ].join(" ")}
              >
                {feedback.message}
              </div>
            )}

            {authMode === "register" ? (
              <RegisterChoiceForm
                onSwitchToLogin={() => {
                  setFeedback(null);
                  onOpenLogin();
                }}
                onSelectTraveler={() => {
                  setFeedback(null);
                  console.log("pilih traveler");
                }}
                onSelectPartner={() => {
                  setFeedback(null);
                  console.log("pilih partner");
                }}
                onSubmitTraveler={handleRegisterTraveler}
                onSubmitPartner={handleRegisterPartner}
                isSubmittingTraveler={isSubmittingTraveler}
                isSubmittingPartner={isSubmittingPartner}
              />
            ) : authMode === "login" ? (
              <LoginForm
                onSwitchToRegister={() => {
                  setFeedback(null);
                  onOpenRegister();
                }}
                onSubmit={handleLoginSubmit}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
