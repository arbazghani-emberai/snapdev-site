import Hero from "@/components/Hero";
import Engineers from "@/components/Engineers";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import GuaranteeSection from "@/components/GuaranteeSection";
import PricingComparisonSection from "@/components/PricingComparisonSection";
import FAQSection from "@/components/FAQSection";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Engineers />
      <GuaranteeSection />
      <Testimonials />
      <PricingComparisonSection />
      <FAQSection />
    </>
  );
}
