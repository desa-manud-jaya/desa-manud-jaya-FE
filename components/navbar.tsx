"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Leaf, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logodesa from "../public/logomanudjaya.svg";

const navLinks = [
  { href: "#beranda", label: "Beranda" },
  { href: "#tentang", label: "Tentang" },
  { href: "#destinasi", label: "Destinasi" },
  { href: "#paket", label: "Paket Wisata" },
  { href: "#kontak", label: "Kontak" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
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

        {/* Desktop */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-primary font-medium transition-colors hover:text-primary/30"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Masuk
          </a>
          <span className="select-none text-muted-foreground/60">||</span>

          <Button
            size="lg"
            variant="outline"
            className="bg-primary-foreground/10 border-primary hover:bg-primary-foreground/20"
            asChild
          >
            <a
              href="/register"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Daftar
            </a>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background px-6 pb-6 md:hidden">
          <ul className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block text-sm text-primary font-medium transition-colors hover:text-primary/30"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Button asChild className="w-full">
                <a href="/login" onClick={() => setOpen(false)}>
                  Masuk
                </a>
              </Button>
              <div className="my-2 border-t border-border" />
              <Button
                asChild
                variant="outline"
                className="w-full bg-primary-foreground/10 border-primary hover:bg-primary-foreground/20"
              >
                <a href="/register" onClick={() => setOpen(false)}>
                  Daftar
                </a>
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
