import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { DestinationsSection } from "@/components/destinations-section";
import { PackagesSection } from "@/components/packages-section";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <DestinationsSection />
        <PackagesSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
