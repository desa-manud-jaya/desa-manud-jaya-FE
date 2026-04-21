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
  registerGuide,
  registerTraveler,
  registerPartner,
  login,
} from "@/lib/services/auth-service";
import { mapBusinessTypeToApi } from "@/lib/mappers/business-type";
import { ApiError } from "@/lib/api";

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
    role: "traveler" | "partner" | "guide" | "admin";
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

type GuideRegisterValues = {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  cv: File | null;
  password: string;
  confirmPassword: string;
};

type TravelerFieldErrors = Partial<Record<keyof TravelerRegisterValues, string>>;
type PartnerFieldErrors = Partial<Record<keyof PartnerRegisterValues, string>>;
type GuideFieldErrors = Partial<Record<keyof GuideRegisterValues, string>>;

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
  const [isSubmittingGuide, setIsSubmittingGuide] = useState(false);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const [travelerFieldErrors, setTravelerFieldErrors] =
    useState<TravelerFieldErrors>({});
  const [partnerFieldErrors, setPartnerFieldErrors] =
    useState<PartnerFieldErrors>({});
  const [guideFieldErrors, setGuideFieldErrors] = useState<GuideFieldErrors>(
    {},
  );

  const resetRegisterErrors = () => {
    setTravelerFieldErrors({});
    setPartnerFieldErrors({});
    setGuideFieldErrors({});
  };

  const resetFeedbackAndErrors = () => {
    setFeedback(null);
    resetRegisterErrors();
  };

  function mapBackendRoleToFrontendRole(
    backendRole: string
  ): "traveler" | "partner" | "guide" | "admin" {
    switch (backendRole) {
      case "ADMIN":
        return "admin";
      case "VENDOR":
        return "partner";
      case "GUIDE":
        return "guide";
      case "USER":
      default:
        return "traveler";
    }
  }

  function getRoleLabel(role: "traveler" | "partner" | "guide" | "admin") {
    switch (role) {
      case "admin":
        return "Admin";
      case "partner":
        return "Partner";
      case "guide":
        return "Guide";
      case "traveler":
      default:
        return "Traveler";
    }
  }

  const handleRegisterTraveler = async (values: TravelerRegisterValues) => {
    setFeedback(null);
    setTravelerFieldErrors({});

    if (values.password !== values.confirmPassword) {
      setTravelerFieldErrors({
        confirmPassword: "Password dan konfirmasi password tidak sama.",
      });
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

      setTravelerFieldErrors({});
      setFeedback({
        type: "success",
        message:
          "Registrasi wisatawan berhasil. Silakan login menggunakan akun Anda.",
      });

      onOpenLogin();
    } catch (error) {
      console.error("REGISTER TRAVELER ERROR:", error);

      if (error instanceof ApiError) {
        const lowerMessage = error.message.toLowerCase();

        if (error.status === 409) {
          if (lowerMessage.includes("username")) {
            const message =
              "Username sudah terdaftar. Coba gunakan username lain.";
            setTravelerFieldErrors({ username: message });
            setFeedback({
              type: "error",
              message,
            });
            return;
          }

          if (lowerMessage.includes("email")) {
            const message = "Email sudah terdaftar. Coba gunakan email lain.";
            setTravelerFieldErrors({ email: message });
            setFeedback({
              type: "error",
              message,
            });
            return;
          }

          setFeedback({
            type: "error",
            message: "Data wisatawan sudah terdaftar.",
          });
          return;
        }

        setFeedback({
          type: "error",
          message: error.message,
        });
        return;
      }

      setFeedback({
        type: "error",
        message: "Terjadi kesalahan saat registrasi wisatawan.",
      });
    } finally {
      setIsSubmittingTraveler(false);
    }
  };

  const handleRegisterPartner = async (values: PartnerRegisterValues) => {
    setFeedback(null);
    setPartnerFieldErrors({});

    if (values.password !== values.confirmPassword) {
      setPartnerFieldErrors({
        confirmPassword: "Password dan konfirmasi password tidak sama.",
      });
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

      setPartnerFieldErrors({});
      setFeedback({
        type: "success",
        message:
          "Registrasi partner berhasil. Silakan login menggunakan akun Anda.",
      });

      onOpenLogin();
    } catch (error) {
      console.error("REGISTER PARTNER ERROR:", error);

      if (error instanceof ApiError) {
        const lowerMessage = error.message.toLowerCase();

        if (error.status === 409) {
          if (lowerMessage.includes("username")) {
            const message =
              "Username sudah terdaftar. Coba gunakan username lain.";
            setPartnerFieldErrors({ username: message });
            setFeedback({
              type: "error",
              message,
            });
            return;
          }

          if (lowerMessage.includes("email")) {
            const message = "Email sudah terdaftar. Coba gunakan email lain.";
            setPartnerFieldErrors({ email: message });
            setFeedback({
              type: "error",
              message,
            });
            return;
          }

          if (lowerMessage.includes("phone")) {
            const message = "Nomor telepon sudah terdaftar.";
            setPartnerFieldErrors({ phone: message });
            setFeedback({
              type: "error",
              message,
            });
            return;
          }

          setFeedback({
            type: "error",
            message: "Data partner sudah terdaftar.",
          });
          return;
        }

        setFeedback({
          type: "error",
          message: error.message,
        });
        return;
      }

      setFeedback({
        type: "error",
        message: "Terjadi kesalahan saat registrasi partner.",
      });
    } finally {
      setIsSubmittingPartner(false);
    }
  };

  const handleRegisterGuide = async (values: GuideRegisterValues) => {
    setFeedback(null);
    setGuideFieldErrors({});

    if (values.password !== values.confirmPassword) {
      setGuideFieldErrors({
        confirmPassword: "Password dan konfirmasi password tidak sama.",
      });
      setFeedback({
        type: "error",
        message: "Password dan konfirmasi password tidak sama.",
      });
      return;
    }

    try {
      setIsSubmittingGuide(true);

      const payload = {
        username: values.username.trim(),
        email: values.email.trim(),
        password: values.password,
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        licenseNumber: values.licenseNumber.trim(),
        cv: values.cv,
      };

      if (!payload.cv) {
        const message = "CV guide wajib diunggah.";
        setGuideFieldErrors({ cv: message });
        setFeedback({ type: "error", message });
        return;
      }

      console.log("REGISTER GUIDE PAYLOAD:", {
        ...payload,
        cv: payload.cv.name,
      });

      const response = await registerGuide({
        ...payload,
        cv: payload.cv,
      });

      console.log("REGISTER GUIDE RESPONSE:", response);

      setGuideFieldErrors({});
      setFeedback({
        type: "success",
        message:
          "Registrasi guide berhasil. Akun Anda menunggu verifikasi admin.",
      });

      onOpenLogin();
    } catch (error) {
      console.error("REGISTER GUIDE ERROR:", error);

      if (error instanceof ApiError) {
        const lowerMessage = error.message.toLowerCase();

        if (error.status === 409) {
          if (lowerMessage.includes("username")) {
            const message =
              "Username sudah terdaftar. Coba gunakan username lain.";
            setGuideFieldErrors({ username: message });
            setFeedback({ type: "error", message });
            return;
          }

          if (lowerMessage.includes("email")) {
            const message = "Email sudah terdaftar. Coba gunakan email lain.";
            setGuideFieldErrors({ email: message });
            setFeedback({ type: "error", message });
            return;
          }

          if (lowerMessage.includes("phone")) {
            const message = "Nomor telepon sudah terdaftar.";
            setGuideFieldErrors({ phone: message });
            setFeedback({ type: "error", message });
            return;
          }

          if (
            lowerMessage.includes("license") ||
            lowerMessage.includes("document") ||
            lowerMessage.includes("file")
          ) {
            const message = "Dokumen lisensi tidak valid atau sudah terdaftar.";
            setGuideFieldErrors({ cv: message });
            setFeedback({ type: "error", message });
            return;
          }

          setFeedback({
            type: "error",
            message: "Data guide sudah terdaftar.",
          });
          return;
        }

        setFeedback({
          type: "error",
          message: error.message,
        });
        return;
      }

      setFeedback({
        type: "error",
        message: "Terjadi kesalahan saat registrasi guide.",
      });
    } finally {
      setIsSubmittingGuide(false);
    }
  };

  const handleLoginSubmit = async (values: {
    username: string;
    password: string;
    role: "traveler" | "partner" | "guide" | "admin";
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
                onClick={() => {
                  resetFeedbackAndErrors();
                  onOpenRegister();
                }}
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
                resetFeedbackAndErrors();
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
                  resetFeedbackAndErrors();
                  onOpenLogin();
                }}
                onSelectTraveler={() => {
                  resetFeedbackAndErrors();
                  console.log("pilih traveler");
                }}
                onSelectPartner={() => {
                  resetFeedbackAndErrors();
                  console.log("pilih partner");
                }}
                onSelectGuide={() => {
                  resetFeedbackAndErrors();
                  console.log("pilih guide");
                }}
                onSubmitTraveler={handleRegisterTraveler}
                onSubmitPartner={handleRegisterPartner}
                onSubmitGuide={handleRegisterGuide}
                isSubmittingTraveler={isSubmittingTraveler}
                isSubmittingPartner={isSubmittingPartner}
                isSubmittingGuide={isSubmittingGuide}
                travelerFieldErrors={travelerFieldErrors}
                partnerFieldErrors={partnerFieldErrors}
                guideFieldErrors={guideFieldErrors}
              />
            ) : authMode === "login" ? (
              <LoginForm
                onSwitchToRegister={() => {
                  resetFeedbackAndErrors();
                  onOpenRegister();
                }}
                onSubmit={handleLoginSubmit}
                isSubmitting={isSubmittingLogin}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
