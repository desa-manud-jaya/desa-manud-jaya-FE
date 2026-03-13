"use client";
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { DestinationsSection } from "@/components/destinations-section";
import { PackagesSection } from "@/components/packages-section";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export type AuthMode = "login" | "register" | null;

export function LandingPage() {
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  return (
    <>
      <Navbar
        authMode={authMode}
        onOpenLogin={() => setAuthMode("login")}
        onOpenRegister={() => setAuthMode("register")}
        onCloseAuth={() => setAuthMode(null)}
      />
      <main>
        <HeroSection
        authMode={authMode}
        onCloseAuth={() => setAuthMode(null)}
        onSwitchMode={(mode) => setAuthMode(mode)}
      />
        <AboutSection />
        <DestinationsSection />
        <PackagesSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}