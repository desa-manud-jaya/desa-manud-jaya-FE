import { Leaf, MapPin, Phone, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const footerLinks = {
  destinasi: [
    { label: "Bukit Panorama Lestari", href: "/destinasi/bukit-panorama-lestari" },
    { label: "Air Terjun Tirta Manud", href: "/destinasi/air-terjun-tirta-manud" },
    { label: "Kampung Sawah Organik", href: "/destinasi/kampung-sawah-organik" },
    { label: "Desa Adat Manud", href: "/destinasi/desa-adat-manud" },
  ],
  paket: [
    { label: "Sunrise Eco Escape", href: "/paket/sunrise-eco-escape" },
    { label: "Adventure Sehari", href: "/paket/adventure-sehari" },
    { label: "Eco Living Experience", href: "/paket/eco-living-experience" },
    { label: "Family Green Getaway", href: "/paket/family-green-getaway" },
  ],
};

export function Footer() {
  return (
    <footer id="kontak" className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Desa Manud Jaya</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-background/70">
              Platform Wisata Berkelanjutan oleh LSM Cipta Bumi Sentosa Abadi.
              Menghubungkan wisatawan dengan destinasi ramah lingkungan.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-background/70">
                <MapPin className="h-4 w-4 shrink-0" />
                Desa Manud Jaya, Indonesia
              </div>
              <div className="flex items-center gap-2 text-sm text-background/70">
                <Phone className="h-4 w-4 shrink-0" />
                +62 812 3456 7890
              </div>
              <div className="flex items-center gap-2 text-sm text-background/70">
                <Mail className="h-4 w-4 shrink-0" />
                info@desamanudjaya.id
              </div>
            </div>
          </div>

          {/* Destinasi */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-background/50">
              Destinasi
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {footerLinks.destinasi.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Paket */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-background/50">
              Paket Wisata
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {footerLinks.paket.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-background/50">
              Universitas Indonesia
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-background/70">
              Proyek ini dikembangkan oleh mahasiswa Magister Teknologi Informasi,
              Fakultas Ilmu Komputer, Universitas Indonesia.
            </p>
            <p className="mt-3 text-xs text-background/50">Februari 2026</p>
          </div>
        </div>

        <Separator className="my-10 bg-background/10" />

        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <p className="text-xs text-background/50">
            &copy; 2026 Desa Manud Jaya. Platform Wisata Berkelanjutan. Hak Cipta
            Dilindungi.
          </p>
          <p className="text-xs text-background/50">
            Dikembangkan oleh Tim MTI Universitas Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
