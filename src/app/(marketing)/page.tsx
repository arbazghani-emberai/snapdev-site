import Hero from "@/components/Hero";
import Engineers from "@/components/Engineers";
import ProblemSection from "@/components/ProblemSection";
import WhyItHappensSection from "@/components/WhyItHappensSection";
import LaunchOfferSection from "@/components/LaunchOfferSection";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import PricingComparisonSection from "@/components/PricingComparisonSection";
import FAQSection from "@/components/FAQSection";
import FinalCta from "@/components/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Engineers />
      <ProblemSection />
      <WhyItHappensSection />
      <LaunchOfferSection />
      <Testimonials />
      <PricingComparisonSection />
      <FinalCta />
      <FAQSection />
    </>
  );
}
