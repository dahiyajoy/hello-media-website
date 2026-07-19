import { createFileRoute } from "@tanstack/react-router";
import { BackToCaseStudies } from "@/components/BackToCaseStudies";

export const Route = createFileRoute("/case-studies/masco-foods")({
  head: () => ({
    meta: [
      {
        title:
          "Masco Foods — Strengthening Brand Visibility Through Corporate Communications | Hello Media",
      },
      {
        name: "description",
        content:
          "How Hello Media helped Masco Foods, the master franchisee of KFC in Ghana, strengthen its brand through corporate communications, retail branding, CSR initiatives, and offline marketing.",
      },
      {
        property: "og:title",
        content:
          "Strengthening Brand Visibility Through Corporate Communications",
      },
      {
        property: "og:description",
        content:
          "An integrated corporate communication system for Masco Foods, master franchisee of KFC in Ghana.",
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
            Corporate Branding
          </span>
        </div>

        <h1 className="mt-6 font-hero text-4xl md:text-5xl font-semibold leading-[1.1] tracking-tight">
          Strengthening Brand Visibility Through{" "}
          <span className="text-gradient-gold">Corporate Communications</span>
        </h1>

        <p className="mt-6 text-lg text-white/70 leading-relaxed font-light">
          How Hello Media helped Masco Foods, the master franchisee of KFC in Ghana, strengthen its brand through corporate communications, retail branding, CSR initiatives, and offline marketing.
        </p>

        <div className="prose-article mt-14 space-y-12 text-[17px] leading-[1.8] text-white/75 font-light">
          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">Overview</h2>
            <p className="mt-4">
              Masco Foods, the master franchisee of KFC in Ghana, partnered with Hello Media to strengthen its corporate and consumer brand presence beyond traditional advertising. The objective was to create a consistent brand experience across retail outlets, corporate communication, CSR initiatives, employee engagement, and offline marketing while reinforcing the company's reputation across Ghana.
            </p>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">Challenge</h2>
            <p className="mt-4">
              As one of Ghana's leading food companies operating the KFC franchise, Masco Foods required a stronger and more unified brand presence across physical touchpoints. Corporate communication, retail branding, CSR initiatives, and public engagement needed to work together to strengthen trust and improve brand visibility.
            </p>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">Strategy</h2>
            <p className="mt-4">
              Hello Media developed a unified communication strategy connecting retail branding, corporate communication, CSR storytelling, experiential marketing, and employee engagement into one consistent brand ecosystem.
            </p>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">Execution</h2>
            <p className="mt-4">
              Designed and executed retail branding, restaurant launch branding, corporate communication assets, CSR campaign creatives, event branding, employee engagement materials, outdoor branding, and offline marketing initiatives across Ghana.
            </p>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">Impact</h2>
            <p className="mt-4">
              The partnership delivered stronger corporate brand visibility, a consistent offline brand experience, improved CSR communication, enhanced retail branding, better customer engagement, stronger public perception, and unified communication across every touchpoint.
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
