import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="sticky top-0 z-30">
        <SiteHeader />
      </div>
      <main className="mx-auto w-full max-w-[1500px] px-4 pb-6 md:px-8">{children}</main>
      <SiteFooter />
    </>
  );
}
