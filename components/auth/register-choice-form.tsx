"use client";

import { useState } from "react";
import { BriefcaseBusiness, Compass, UserRound } from "lucide-react";
import { RegisterTravelerForm } from "@/components/auth/register-traveler-form";
import { RegisterPartnerForm } from "@/components/auth/register-partner-form";
import {
  RegisterGuideForm,
  type GuideFieldErrors,
  type GuideFormData,
} from "@/components/auth/register-guide-form";

type RegisterStep = "choice" | "traveler" | "partner" | "guide";

export type RegisterTravelerFormValues = {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export type RegisterPartnerFormValues = {
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

export type RegisterGuideFormValues = GuideFormData;

export type TravelerFieldErrors = {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
};

export type PartnerFieldErrors = {
  username?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  ownerName?: string;
  businessType?: string;
  address?: string;
  password?: string;
  confirmPassword?: string;
};

type RegisterChoiceFormProps = {
  onSwitchToLogin: () => void;
  onSelectTraveler?: () => void;
  onSelectPartner?: () => void;
  onSelectGuide?: () => void;
  onSubmitTraveler?: (formData: RegisterTravelerFormValues) => void;
  onSubmitPartner?: (formData: RegisterPartnerFormValues) => void;
  onSubmitGuide?: (formData: RegisterGuideFormValues) => void;
  isSubmittingTraveler?: boolean;
  isSubmittingPartner?: boolean;
  isSubmittingGuide?: boolean;
  travelerFieldErrors?: TravelerFieldErrors;
  partnerFieldErrors?: PartnerFieldErrors;
  guideFieldErrors?: GuideFieldErrors;
};

export function RegisterChoiceForm({
  onSwitchToLogin,
  onSelectTraveler,
  onSelectPartner,
  onSelectGuide,
  onSubmitTraveler,
  onSubmitPartner,
  onSubmitGuide,
  isSubmittingTraveler = false,
  isSubmittingPartner = false,
  isSubmittingGuide = false,
  travelerFieldErrors = {},
  partnerFieldErrors = {},
  guideFieldErrors = {},
}: RegisterChoiceFormProps) {
  const [step, setStep] = useState<RegisterStep>("choice");

  const roleOptions = [
    {
      id: "traveler" as const,
      title: "Wisatawan",
      description: "Pesan paket wisata dan kelola perjalanan.",
      icon: UserRound,
      onSelect: onSelectTraveler,
    },
    {
      id: "partner" as const,
      title: "Mitra",
      description: "Kelola usaha wisata, akomodasi, kuliner, atau UMKM.",
      icon: BriefcaseBusiness,
      onSelect: onSelectPartner,
    },
    {
      id: "guide" as const,
      title: "Guide lokal",
      description: "Daftar sebagai pemandu wisata Desa Manud Jaya.",
      icon: Compass,
      onSelect: onSelectGuide,
    },
  ];

  const openStep = (nextStep: Exclude<RegisterStep, "choice">) => {
    const selectedRole = roleOptions.find((option) => option.id === nextStep);

    selectedRole?.onSelect?.();
    setStep(nextStep);
  };

  if (step === "traveler") {
    return (
      <RegisterTravelerForm
        onBack={() => setStep("choice")}
        onSwitchToLogin={onSwitchToLogin}
        onSubmit={onSubmitTraveler}
        isSubmitting={isSubmittingTraveler}
        fieldErrors={travelerFieldErrors}
      />
    );
  }

  if (step === "partner") {
    return (
      <RegisterPartnerForm
        onBack={() => setStep("choice")}
        onSwitchToLogin={onSwitchToLogin}
        onSubmit={onSubmitPartner}
        isSubmitting={isSubmittingPartner}
        fieldErrors={partnerFieldErrors}
      />
    );
  }

  if (step === "guide") {
    return (
      <RegisterGuideForm
        onBack={() => setStep("choice")}
        onSwitchToLogin={onSwitchToLogin}
        onSubmit={onSubmitGuide}
        isSubmitting={isSubmittingGuide}
        fieldErrors={guideFieldErrors}
      />
    );
  }

  return (
    <div className="w-full">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
        Buat akun baru
      </p>
      <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground md:text-4xl">
        Pilih peran Anda
      </h2>
      <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
        Satu tempat untuk wisatawan, mitra wisata, dan guide lokal Manud Jaya.
      </p>

      <div className="mt-8 grid gap-3">
        {roleOptions.map((option) => {
          const Icon = option.icon;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => openStep(option.id)}
              className="group flex items-start gap-4 rounded-lg border border-border bg-white p-4 text-left transition hover:border-primary/50 hover:bg-primary/5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-base font-semibold text-foreground">
                  {option.title}
                </span>
                <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                  {option.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
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
