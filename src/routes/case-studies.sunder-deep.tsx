import { createFileRoute } from "@tanstack/react-router";
import { BackToCaseStudies } from "@/components/BackToCaseStudies";

export const Route = createFileRoute("/case-studies/sunder-deep")({
  head: () => ({
    meta: [
      {
        title:
          "Sunder Deep Group of Institutions — Digital Education Ecosystem | Hello Media",
      },
      {
        name: "description",
        content:
          "How Hello Media modernized Sunder Deep Group of Institutions through branding, admission marketing, automation, and digital transformation.",
      },
      {
        property: "og:title",
        content:
          "Transforming Sunder Deep Group of Institutions into a Modern Digital Education Ecosystem",
      },
      {
        property: "og:description",
        content:
          "Branding, admission marketing, automation, and digital transformation for one of North India's leading educational groups.",
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
            Education
          </span>
        </div>

        <h1 className="mt-6 font-hero text-4xl md:text-5xl font-semibold leading-[1.1] tracking-tight">
          Transforming Sunder Deep Group of Institutions into a{" "}
          <span className="text-gradient-gold">Modern Digital Education Ecosystem</span>
        </h1>

        <p className="mt-6 text-lg text-white/70 leading-relaxed font-light">
          How Hello Media modernized one of North India's leading educational groups through
          branding, admission marketing, automation, and digital transformation.
        </p>

        <div className="prose-article mt-14 space-y-12 text-[17px] leading-[1.8] text-white/75 font-light">
          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">Overview</h2>
            <p className="mt-4">
              Sunder Deep Group of Institutions partnered with Hello Media to modernize its marketing ecosystem and create a unified growth strategy for admissions. By combining branding, traditional and digital lead generation, automation, and performance marketing, we built a scalable system designed to strengthen institutional visibility and improve student acquisition.
            </p>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              Challenge
            </h2>
            <p className="mt-4">
              As the institution expanded across multiple academic disciplines, maintaining consistent communication and an efficient admission process became increasingly complex. The objective was to strengthen the institution's brand, improve enquiry generation, modernize admission workflows, and build a measurable marketing ecosystem capable of supporting long-term growth.
            </p>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              Strategy
            </h2>
            <p className="mt-4">
              We designed an integrated growth strategy that unified institutional branding, admission marketing, traditional and digital lead generation, CRM implementation, automation, and performance marketing. Every initiative was aligned to create a seamless experience for prospective students while improving operational efficiency and campaign performance.
            </p>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              Implementation
            </h2>
            <p className="mt-4">
              Hello Media executed end-to-end admission marketing initiatives, including performance advertising, creative communication, admission collateral, CRM implementation, automation, lead nurturing, and continuous campaign optimization. Together, these initiatives created a connected marketing ecosystem that supported every stage of the student acquisition journey.
            </p>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              Results
            </h2>
            <p className="mt-4">
              The partnership strengthened the institution's market presence by improving brand consistency, increasing qualified admission enquiries, streamlining lead management through automation, and enhancing overall campaign performance. More importantly, it established a scalable marketing ecosystem capable of supporting sustainable institutional growth.
            </p>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              Services Delivered
            </h2>
            <p className="mt-4">
              The engagement included brand strategy, admission marketing, traditional and digital lead generation, performance marketing across Meta and Google, prospectus and brochure design, print collateral, CRM integration, WhatsApp and email automation, lead nurturing, campaign optimization, and ongoing marketing support, all delivered as part of one integrated growth ecosystem.
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
