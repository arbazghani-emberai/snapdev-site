import Hero from "@/components/Hero";
import Engineers from "@/components/Engineers";
import ProblemSection from "@/components/ProblemSection";
import WhyItHappensSection from "@/components/WhyItHappensSection";
import LaunchOfferSection from "@/components/LaunchOfferSection";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import PricingComparisonSection from "@/components/PricingComparisonSection";
import PricingPlansSection from "@/components/PricingPlansSection";
import FinalCta from "@/components/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <Engineers />
      <ProblemSection />
      <WhyItHappensSection />
      <LaunchOfferSection />
      <HowItWorks />
      <Testimonials />
      <PricingComparisonSection />
      <PricingPlansSection />
      <FinalCta />
    </>
  );
}
