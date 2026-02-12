import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ConsultantsSection from '@/components/ConsultantsSection';
import ServicesSection from '@/components/ServicesSection';
import MarketplaceSection from '@/components/MarketplaceSection';
import PointsSection from '@/components/PointsSection';
import ContactSection from '@/components/ContactSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <HeroSection />
        <ConsultantsSection />
        <ServicesSection />
        <MarketplaceSection />
        <PointsSection />
        <ContactSection />
      </main>
    </div>
  );
}
