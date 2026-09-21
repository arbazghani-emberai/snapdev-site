import Hero from "@/components/Hero";
import Engineers from "@/components/Engineers";
import ProblemSection from "@/components/ProblemSection";
import WhyItHappensSection from "@/components/WhyItHappensSection";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FinalCta from "@/components/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <Engineers />
      <ProblemSection />
      <WhyItHappensSection />
      <HowItWorks />
      <Testimonials />
      <FinalCta />
    </>
  );
}
