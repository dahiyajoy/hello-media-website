import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/insights/ai-wont-replace-great-marketing")({
  head: () => ({
    meta: [
      {
        title:
          "AI Won't Replace Great Marketing: It Will Replace Slow Businesses | Hello Media",
      },
      {
        name: "description",
        content:
          "AI isn't replacing marketers. It's replacing slow execution. Discover how businesses use AI to accelerate research, content, automation, decision-making, and growth while keeping strategy at the center.",
      },
      {
        property: "og:title",
        content:
          "AI Won't Replace Great Marketing: It Will Replace Slow Businesses",
      },
      {
        property: "og:description",
        content:
          "AI isn't replacing marketers. It's replacing slow execution. Discover how businesses use AI to accelerate research, content, automation, decision-making, and growth while keeping strategy at the center.",
      },
      { property: "og:type", content: "article" },
    ],
  }),
  component: ArticlePage,
});

function ArticlePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <article className="mx-auto max-w-3xl px-6 pt-32 pb-32 md:pt-40 md:pb-40">
        <a
          href="/#insights"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Insights
        </a>

        <div className="mt-10 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-widest text-white/60">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-white/80">
            AI Insights
          </span>
          <span>10 min read</span>
        </div>

        <h1 className="mt-6 font-hero text-4xl md:text-5xl font-semibold leading-[1.1] tracking-tight">
          AI Won't Replace Great Marketing.{" "}
          <span className="text-gradient-gold">It Will Replace Slow Businesses</span>
        </h1>

        <div className="prose-article mt-14 space-y-10 text-[17px] leading-[1.8] text-white/75 font-light">
          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              Introduction
            </h2>
            <p className="mt-4">AI isn't coming.</p>
            <p className="mt-4">It's already here.</p>
            <p className="mt-4">
              The businesses winning today aren't replacing people with AI.
            </p>
            <p className="mt-4">
              They're giving talented people better tools.
            </p>
            <p className="mt-4 text-white font-normal">The result?</p>
            <ul className="mt-4 space-y-2 list-none">
              <li>Faster execution.</li>
              <li>Better decisions.</li>
              <li>Lower costs.</li>
              <li>Higher profitability.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              Where AI Creates the Biggest Advantage
            </h2>
            <p className="mt-4">
              AI is transforming every stage of business growth.
            </p>
            <ul className="mt-4 space-y-2 list-none">
              <li>Research</li>
              <li>Customer insights</li>
              <li>Content creation</li>
              <li>Advertising</li>
              <li>Sales</li>
              <li>Automation</li>
              <li>Analytics</li>
              <li>Decision-making</li>
            </ul>
            <p className="mt-4">
              Businesses using AI strategically move significantly faster than
              those relying entirely on manual processes.
            </p>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              AI Is Not the Strategy
            </h2>
            <p className="mt-4">
              Many companies make the mistake of asking,
            </p>
            <p className="mt-4 text-white font-normal">
              "What AI tool should we use?"
            </p>
            <p className="mt-4">The better question is,</p>
            <p className="mt-4 text-white font-normal">
              "What business problem are we trying to solve?"
            </p>
            <p className="mt-4">
              AI only creates value when it supports a clear business strategy.
            </p>
            <p className="mt-4">
              Technology without direction simply creates more noise.
            </p>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              The Businesses That Will Win
            </h2>
            <p className="mt-4">
              Future market leaders combine three things exceptionally well:
            </p>
            <ul className="mt-4 space-y-2 list-none">
              <li>Human creativity</li>
              <li>Business strategy</li>
              <li>AI-powered execution</li>
            </ul>
            <p className="mt-4">
              This combination allows businesses to deliver better customer
              experiences, make smarter decisions, and scale more efficiently.
            </p>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              What We Believe at Hello Media
            </h2>
            <p className="mt-4">
              At Hello Media, we don't use AI to replace thinking.
            </p>
            <p className="mt-4">We use AI to accelerate strategy.</p>
            <p className="mt-4">
              Technology should never replace human insight.
            </p>
            <p className="mt-4">It should amplify it.</p>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              Final Takeaway
            </h2>
            <p className="mt-4">Businesses won't lose because AI exists.</p>
            <p className="mt-4">
              They'll lose because competitors use AI to make faster, smarter,
              and better business decisions.
            </p>
            <p className="mt-4">
              The future belongs to businesses that combine strategy,
              creativity, and intelligent systems, not those that rely on
              yesterday's way of working.
            </p>
          </section>
        </div>

        <div className="mt-16 border-t border-white/[0.06] pt-10">
          <a
            href="/#insights"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Insights
          </a>
        </div>
      </article>
    </main>
  );
}
