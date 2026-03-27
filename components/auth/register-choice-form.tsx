"use client";

import { useState } from "react";
import { RegisterTravelerForm } from "@/components/auth/register-traveler-form";
import { RegisterPartnerForm } from "@/components/auth/register-partner-form";

type RegisterStep = "choice" | "traveler" | "partner";

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

type RegisterChoiceFormProps = {
  onSwitchToLogin: () => void;
  onSelectTraveler?: () => void;
  onSelectPartner?: () => void;
  onSubmitTraveler?: (formData: RegisterTravelerFormValues) => void;
  onSubmitPartner?: (formData: RegisterPartnerFormValues) => void;
  isSubmittingTraveler?: boolean;
  isSubmittingPartner?: boolean;
};

export function RegisterChoiceForm({
  onSwitchToLogin,
  onSelectTraveler,
  onSelectPartner,
  onSubmitTraveler,
  onSubmitPartner,
}: RegisterChoiceFormProps) {
  const [step, setStep] = useState<RegisterStep>("choice");

  if (step === "traveler") {
    return (
      <RegisterTravelerForm
        onBack={() => setStep("choice")}
        onSwitchToLogin={onSwitchToLogin}
        onSubmit={onSubmitTraveler}
      />
    );
  }

  if (step === "partner") {
    return (
      <RegisterPartnerForm
        onBack={() => setStep("choice")}
        onSwitchToLogin={onSwitchToLogin}
        onSubmit={onSubmitPartner}
      />
    );
  }

  return (
    <>
      <h2 className="text-3xl font-semibold text-foreground md:text-5xl">
        I want to register as:
      </h2>

      <div className="mt-12 space-y-8">
        <button
          type="button"
          onClick={() => {
            onSelectTraveler?.();
            setStep("traveler");
          }}
          className="w-full rounded-[28px] bg-green-800 px-8 py-5 text-center text-2xl font-medium text-white shadow-md transition hover:scale-[1.01]"
        >
          Traveler
        </button>

        <button
          type="button"
          onClick={() => {
            onSelectPartner?.();
            setStep("partner");
          }}
          className="w-full rounded-[28px] bg-[#6f7c6f] px-8 py-5 text-center text-2xl font-medium text-white shadow-md transition hover:scale-[1.01]"
        >
          Partner
        </button>
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
    </>
  );
}