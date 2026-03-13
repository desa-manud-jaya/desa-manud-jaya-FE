"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logodesa from "../public/logomanudjaya.svg";
import type { AuthMode } from "@/components/landing-page";

const navLinks = [
  { href: "#beranda", label: "Beranda" },
  { href: "#tentang", label: "Tentang" },
  { href: "#destinasi", label: "Destinasi" },
  { href: "#paket", label: "Paket Wisata" },
  { href: "#kontak", label: "Kontak" },
];

type NavbarProps = {
  authMode?: AuthMode;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
  onCloseAuth?: () => void;
};

export function Navbar({
  authMode = null,
  onOpenLogin,
  onOpenRegister,
  onCloseAuth,
}: NavbarProps) {
  const [open, setOpen] = useState(false);

  const handleNavClick = () => {
    setOpen(false);
    onCloseAuth?.();
  };

  const handleLoginClick = () => {
    setOpen(false);

    if (!onOpenLogin) return;

    if (authMode === "login") {
      onCloseAuth?.();
    } else {
      onOpenLogin();
    }
  };

  const handleRegisterClick = () => {
    setOpen(false);

    if (!onOpenRegister) return;

    if (authMode === "register") {
      onCloseAuth?.();
    } else {
      onOpenRegister();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-3 py-1">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logodesa}
            alt="Logo Desa Manud Jaya"
            width={120}
            height={120}
          />
          <span className="text-lg font-bold tracking-tight text-foreground">
            Desa Manud Jaya
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={`/${link.href}`}
                onClick={handleNavClick}
                className="text-sm font-medium text-primary transition-colors hover:text-primary/30"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            onClick={handleLoginClick}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Masuk
          </button>

          <span className="select-none text-muted-foreground/60">||</span>

          <Button
            size="lg"
            variant="outline"
            className="border-primary bg-primary-foreground/10 hover:bg-primary-foreground/20"
            onClick={handleRegisterClick}
          >
            <span className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Daftar
            </span>
          </Button>
        </div>

        <button
          className="text-foreground md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-6 pb-6 md:hidden">
          <ul className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={`/${link.href}`}
                  className="block text-sm font-medium text-primary transition-colors hover:text-primary/30"
                  onClick={handleNavClick}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <li>
              <Button className="w-full" onClick={handleLoginClick}>
                Masuk
              </Button>

              <div className="my-2 border-t border-border" />

              <Button
                variant="outline"
                className="w-full border-primary bg-primary-foreground/10 hover:bg-primary-foreground/20"
                onClick={handleRegisterClick}
              >
                Daftar
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}