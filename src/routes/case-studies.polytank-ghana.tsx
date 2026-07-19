import { createFileRoute } from "@tanstack/react-router";
import { BackToCaseStudies } from "@/components/BackToCaseStudies";

export const Route = createFileRoute("/case-studies/polytank-ghana")({
  head: () => ({
    meta: [
      {
        title:
          "PolyTank Ghana — Brand Presence Across Digital & Offline Channels | Hello Media",
      },
      {
        name: "description",
        content:
          "How Hello Media strengthened PolyTank Ghana's brand presence across product divisions, dealer networks, exhibitions, and international markets.",
      },
      {
        property: "og:title",
        content:
          "Strengthening PolyTank Ghana's Brand Presence Across Digital & Offline Channels",
      },
      {
        property: "og:description",
        content:
          "An integrated brand communication system for a manufacturing leader expanding across domestic and international markets.",
      },
      { property: "og:type", content: "article" },
    ],
  }),
  component: CaseStudyPage,
});

function CaseStudyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <article className="mx-auto max-w-4xl px-6 pt-32 pb-32 md:pt-40 md:pb-40">
        <BackToCaseStudies />

        <div className="mt-10 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-widest text-white/60">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-white/80">
            Manufacturing
          </span>
        </div>

        <h1 className="mt-6 font-hero text-4xl md:text-5xl font-semibold leading-[1.1] tracking-tight">
          Strengthening{" "}
          <span className="text-gradient-gold">PolyTank Ghana's</span> Brand Presence Across{" "}
          Digital & Offline Channels
        </h1>

        <p className="mt-6 text-lg text-white/70 leading-relaxed font-light">
          How Hello Media strengthened PolyTank Ghana's brand presence across product divisions, dealer networks, exhibitions, and international markets.
        </p>

        <div className="prose-article mt-14 space-y-12 text-[17px] leading-[1.8] text-white/75 font-light">
          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">Overview</h2>
            <p className="mt-4">
              PolyTank Ghana partnered with Hello Media to build a unified brand communication system across multiple product divisions, dealer networks, exhibitions, and international markets. By combining corporate branding, product communication, dealer marketing, and marketing collateral, we created a consistent brand ecosystem designed to support growth across every touchpoint.
            </p>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              Challenge
            </h2>
            <p className="mt-4">
              As the company expanded across products and markets, maintaining consistent communication became increasingly important. The business required a stronger brand system that could improve product communication, support dealers, and deliver a seamless customer experience across digital and offline channels.
            </p>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              Strategy
            </h2>
            <p className="mt-4">
              We developed an integrated brand communication strategy that unified corporate branding, product communication, dealer marketing, exhibition branding, and marketing collateral into one cohesive brand ecosystem that could scale with the business.
            </p>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              Implementation
            </h2>
            <p className="mt-4">
              Hello Media delivered a complete range of branding and communication assets, including product catalogues, brochures, corporate presentations, exhibition branding, and marketing collateral. Every initiative was designed to strengthen brand consistency while improving visibility across digital and offline channels.
            </p>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              Results
            </h2>
            <p className="mt-4">
              The partnership created a stronger and more consistent brand presence, improved dealer communication, enhanced product presentation, and reinforced PolyTank Ghana's visibility across domestic and international markets, providing a scalable foundation for future growth.
            </p>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              Services
            </h2>
            <p className="mt-4">
              The engagement included brand strategy, corporate branding, product communication, dealer marketing, exhibition branding, catalogue and brochure design, corporate presentations, print collateral, marketing creatives, and ongoing brand support, all delivered as part of one integrated brand ecosystem.
            </p>
          </section>
        </div>

        <div className="mt-16 border-t border-white/[0.06] pt-10">
          <BackToCaseStudies />
        </div>
      </article>
    </main>
  );
}
