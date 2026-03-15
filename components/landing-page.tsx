"use client";

import { useEffect, useState } from "react";
import { Navbar, type TravelerSession } from "@/components/navbar";
import { AuthErrorModal } from "@/components/auth/auth-error-modal";
import { LogoutConfirmModal } from "@/components/auth/logout-confirm-modal";
import { HeroSection } from "./hero-section";
import { AboutSection } from "./about-section";
import { DestinationsSection } from "./destinations-section";
import { PackagesSection } from "./packages-section";
import { CtaSection } from "./cta-section";
import { Footer } from "@/components/footer";

export type AuthMode = "login" | "register" | null;

const TRAVELER_STORAGE_KEY = "manud-jaya-traveler-session";

const DUMMY_TRAVELER = {
  email: "wisatawan@gmail.com",
  password: "wisatawan123!",
  role: "traveler" as const,
  session: {
    name: "John Doe",
    email: "wisatawan@gmail.com",
    role: "traveler" as const,
    roleLabel: "Traveler",
  } satisfies TravelerSession,
};

export function LandingPage() {
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [invalidLoginOpen, setInvalidLoginOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<TravelerSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(TRAVELER_STORAGE_KEY);

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser) as TravelerSession;
        setCurrentUser(parsedUser);
      }
    } catch (error) {
      console.error("Failed to read traveler session:", error);
      localStorage.removeItem(TRAVELER_STORAGE_KEY);
    } finally {
      setIsReady(true);
    }
  }, []);

  const handleOpenLogin = () => setAuthMode("login");
  const handleOpenRegister = () => setAuthMode("register");
  const handleCloseAuth = () => setAuthMode(null);

  const handleLoginSubmit = (formData: {
    email: string;
    password: string;
    role: "traveler" | "partner" | "admin";
  }) => {
    console.log("LOGIN SUBMIT:", formData);

    const isValidTraveler =
      formData.email === DUMMY_TRAVELER.email &&
      formData.password === DUMMY_TRAVELER.password &&
      formData.role === DUMMY_TRAVELER.role;

    if (!isValidTraveler) {
      setInvalidLoginOpen(true);
      return;
    }

    setCurrentUser(DUMMY_TRAVELER.session);
    localStorage.setItem(
      TRAVELER_STORAGE_KEY,
      JSON.stringify(DUMMY_TRAVELER.session)
    );
    setAuthMode(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(TRAVELER_STORAGE_KEY);
    setLogoutOpen(false);
    setAuthMode(null);
  };

  if (!isReady) {
    return null;
  }

  return (
    <>
      <Navbar
        authMode={authMode}
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        onCloseAuth={handleCloseAuth}
        currentUser={currentUser}
        onLogoutClick={() => setLogoutOpen(true)}
      />

      <main>
        <HeroSection
          authMode={authMode}
          onCloseAuth={handleCloseAuth}
          onOpenLogin={handleOpenLogin}
          onOpenRegister={handleOpenRegister}
          onLoginSubmit={handleLoginSubmit}
        />
        <AboutSection />
        <DestinationsSection />
        <PackagesSection />
        <CtaSection />
      </main>

      <Footer />

      <AuthErrorModal
        open={invalidLoginOpen}
        onOpenChange={setInvalidLoginOpen}
      />

      <LogoutConfirmModal
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={handleLogout}
      />
    </>
  );
}