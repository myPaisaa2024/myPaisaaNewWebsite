import Navbar from "@/components/mypaisaa/Navbar";
import Hero from "@/components/mypaisaa/Hero";
import TrustCompliance from "@/components/mypaisaa/TrustCompliance";
import PlanComparison from "@/components/mypaisaa/PlanComparison";
import EligibilityChecker from "@/components/mypaisaa/EligibilityChecker";
import HowItWorks from "@/components/mypaisaa/HowItWorks";
import PlanCards from "@/components/mypaisaa/PlanCards";
import VacantChits from "@/components/mypaisaa/VacantChits";
import Testimonials from "@/components/mypaisaa/Testimonials";
import Faq from "@/components/mypaisaa/Faq";
import AppDownloadBand from "@/components/mypaisaa/AppDownloadBand";
import BlogTeaser from "@/components/mypaisaa/BlogTeaser";
import Footer from "@/components/mypaisaa/Footer";
import StickyMobileBar from "@/components/mypaisaa/StickyMobileBar";
import { LangProvider } from "@/lib/i18n";

export default function Home() {
  return (
    <LangProvider>
      <div className="min-h-svh bg-background font-sans text-foreground">
        <Navbar />
        <main>
          <Hero />
          <TrustCompliance />
          <PlanComparison />
          <EligibilityChecker />
          <HowItWorks />
          <PlanCards />
          <VacantChits />
          <Testimonials />
          <Faq />
          <AppDownloadBand />
          <BlogTeaser />
        </main>
        <Footer />
        <StickyMobileBar />
      </div>
    </LangProvider>
  );
}
