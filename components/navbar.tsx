"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  UserCircle2,
  Settings,
  UserCog,
  KeyRound,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logodesa from "../public/logomanudjaya.svg";
import type { AuthMode } from "@/components/landing-page";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "#beranda", label: "Home" },
  { href: "#tentang", label: "About Us" },
  { href: "#destinasi", label: "Destination" },
  { href: "#paket", label: "Tour Package" },
  { href: "#kontak", label: "Contact" },
];

export type TravelerSession = {
  name: string;
  email: string;
  role: "traveler";
  roleLabel: string;
};

type NavbarProps = {
  authMode?: AuthMode;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
  onCloseAuth?: () => void;
  currentUser?: TravelerSession | null;
  onLogoutClick?: () => void;
};

export function Navbar({
  authMode = null,
  onOpenLogin,
  onOpenRegister,
  onCloseAuth,
  currentUser,
  onLogoutClick,
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

  const isLoggedInTraveler = currentUser?.role === "traveler";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
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

        {!isLoggedInTraveler ? (
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
        ) : (
          <div className="hidden items-center gap-3 md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-full px-2 py-1 transition hover:bg-muted">
                  <UserCircle2 className="h-12 w-12 text-sky-600" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-primary">
                      {currentUser.name}
                    </p>
                    <p className="text-sm text-primary/80">
                      {currentUser.roleLabel}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-primary/70" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 rounded-2xl p-2"
              >
                <DropdownMenuItem className="rounded-xl">
                  <UserCog className="mr-3 h-4 w-4 text-sky-500" />
                  Manage Account
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl">
                  <KeyRound className="mr-3 h-4 w-4 text-pink-500" />
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-xl text-red-500 focus:text-red-500"
                  onClick={onLogoutClick}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              type="button"
              className="rounded-full p-2 text-primary transition hover:bg-muted"
              aria-label="Settings"
            >
              <Settings className="h-6 w-6" />
            </button>
          </div>
        )}

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

            {!isLoggedInTraveler ? (
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
            ) : (
              <li className="space-y-2 pt-2">
                <div className="rounded-xl border border-border p-3">
                  <p className="font-semibold text-primary">{currentUser.name}</p>
                  <p className="text-sm text-primary/80">
                    {currentUser.roleLabel}
                  </p>
                </div>

                <Button variant="outline" className="w-full justify-start">
                  <UserCog className="mr-2 h-4 w-4" />
                  Manage Account
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <KeyRound className="mr-2 h-4 w-4" />
                  Change Password
                </Button>

                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={onLogoutClick}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}