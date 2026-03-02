import { Leaf, Users, TrendingUp, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Wisata Eco-Friendly",
    description:
      "Setiap destinasi dan paket wisata dikurasi berdasarkan prinsip keberlanjutan lingkungan dengan indikator eco-label.",
  },
  {
    icon: Users,
    title: "Pemberdayaan Masyarakat",
    description:
      "Platform ini mendukung pelaku usaha lokal seperti homestay, pemandu wisata, dan UMKM desa untuk berkembang secara digital.",
  },
  {
    icon: TrendingUp,
    title: "Ekonomi Desa Terukur",
    description:
      "Setiap transaksi tercatat digital untuk membantu mengukur dampak ekonomi dan pertumbuhan pendapatan desa.",
  },
  {
    icon: ShieldCheck,
    title: "Konservasi Berkelanjutan",
    description:
      "Sistem kuota kunjungan dan donasi konservasi otomatis di setiap paket wisata untuk menjaga kelestarian alam.",
  },
];

export function AboutSection() {
  return (
    <section
      id="tentang"
      className="bg-background py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Tentang Kami
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Transformasi Digital Wisata Desa Berkelanjutan
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            LSM Cipta Bumi Sentosa Abadi berkomitmen memberdayakan masyarakat
            Desa Manud Jaya melalui teknologi informasi sebagai pendorong
            pembangunan ekonomi yang berkelanjutan dan ramah lingkungan.
          </p>
        </div>

        {/* Features grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
