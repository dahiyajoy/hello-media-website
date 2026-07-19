import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/insights/why-strategy-not-marketing")({
  head: () => ({
    meta: [
      {
        title:
          "Why Most Businesses Don't Have a Marketing Problem: They Have a Strategy Problem | Hello Media",
      },
      {
        name: "description",
        content:
          "Most businesses blame marketing when growth slows. In reality, the biggest bottleneck is often unclear positioning, weak differentiation, and the absence of a scalable business strategy.",
      },
      {
        property: "og:title",
        content:
          "Why Most Businesses Don't Have a Marketing Problem: They Have a Strategy Problem",
      },
      {
        property: "og:description",
        content:
          "Discover why strategy, not marketing, is the true foundation of sustainable business growth.",
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
            Strategy
          </span>
          <span>8 min read</span>
        </div>

        <h1 className="mt-6 font-hero text-4xl md:text-5xl font-semibold leading-[1.1] tracking-tight">
          Why Most Businesses Don't Have a Marketing Problem.{" "}
          <span className="text-gradient-gold">They Have a Strategy Problem</span>
        </h1>

        <div className="prose-article mt-14 space-y-10 text-[17px] leading-[1.8] text-white/75 font-light">
          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              Introduction
            </h2>
            <p className="mt-4">When growth slows, the first instinct is usually to blame marketing.</p>
            <ul className="mt-4 space-y-2 text-white/70">
              <li>"We need better ads."</li>
              <li>"We need more leads."</li>
              <li>"We need a better agency."</li>
              <li>"We need to spend more."</li>
            </ul>
            <p className="mt-6">
              But after working with hundreds of businesses, we've found something surprising:
            </p>
            <p className="mt-4 text-white font-normal">
              Most businesses don't have a marketing problem. They have a strategy problem.
            </p>
            <p className="mt-6">
              Marketing can amplify a business, but it cannot fix a business model that lacks clarity.
              Without the right positioning, the right audience, the right offer, and the right growth
              strategy, even the best campaigns eventually stop working.
            </p>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              What Strategy Actually Means
            </h2>
            <p className="mt-4">Strategy isn't a logo. It isn't social media. It isn't running Meta Ads.</p>
            <p className="mt-4">
              Strategy answers the questions that determine whether marketing succeeds or fails.
            </p>
            <ul className="mt-4 space-y-2 list-disc pl-5 text-white/70 marker:text-[hsl(var(--gold,45_90%_55%))]">
              <li>Who are we actually serving?</li>
              <li>Why should customers choose us?</li>
              <li>What problem do we solve better than everyone else?</li>
              <li>Where will our growth come from over the next three years?</li>
              <li>Which marketing channels deserve investment?</li>
            </ul>
            <p className="mt-6">Without these answers, marketing becomes guesswork.</p>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              Signs You Have a Strategy Problem
            </h2>
            <p className="mt-4">
              If your business experiences any of these, strategy, not marketing, is usually the issue.
            </p>
            <ul className="mt-4 space-y-2 list-disc pl-5 text-white/70 marker:text-[hsl(var(--gold,45_90%_55%))]">
              <li>Revenue fluctuates every month.</li>
              <li>Marketing feels inconsistent.</li>
              <li>Competitors easily copy you.</li>
              <li>Customers compare only on price.</li>
              <li>Leads don't convert.</li>
              <li>Your team doesn't know what makes your business different.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              What Successful Businesses Do Differently
            </h2>
            <p className="mt-4">
              Growing companies spend less time chasing trends and more time building systems.
            </p>
            <p className="mt-4">They focus on:</p>
            <ul className="mt-4 space-y-2 list-disc pl-5 text-white/70 marker:text-[hsl(var(--gold,45_90%_55%))]">
              <li>Clear positioning</li>
              <li>Market differentiation</li>
              <li>Customer psychology</li>
              <li>Scalable offers</li>
              <li>Repeatable acquisition systems</li>
            </ul>
            <p className="mt-6">Marketing becomes easier because strategy guides every decision.</p>
          </section>

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              Key Takeaway
            </h2>
            <p className="mt-4">Marketing creates visibility. Strategy creates value.</p>
            <p className="mt-4">
              Businesses that invest in strategy first almost always outperform businesses that simply
              spend more on advertising.
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
