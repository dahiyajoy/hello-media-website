import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/insights/7-growth-mistakes")({
  head: () => ({
    meta: [
      {
        title:
          "The 7 Growth Mistakes That Keep Businesses Stuck | Hello Media",
      },
      {
        name: "description",
        content:
          "Learn the seven strategic mistakes that silently prevent businesses from scaling, and how to avoid them before they limit your growth.",
      },
      {
        property: "og:title",
        content: "The 7 Growth Mistakes That Keep Businesses Stuck",
      },
      {
        property: "og:description",
        content:
          "Learn the seven strategic mistakes that silently prevent businesses from scaling, and how to avoid them before they limit your growth.",
      },
      { property: "og:type", content: "article" },
    ],
  }),
  component: ArticlePage,
});

function ArticlePage() {
  const mistakes = [
    {
      title: "Trying to sell to everyone",
      body: [
        "When everyone is your customer, no one feels like your customer.",
        "Specialization creates trust.",
      ],
    },
    {
      title: "Competing on price",
        body: [
          "Lower prices create lower margins.",
          "Great brands compete on value, not discounts.",
        ],
    },
    {
      title: "Confusing activity with progress",
      body: [
        "Posting daily isn't growth.",
        "Running ads isn't growth.",
        "Real growth is measured in revenue, qualified leads, retention, and customer lifetime value.",
      ],
    },
    {
      title: "Ignoring positioning",
      body: [
        "If customers can't explain why you're different, they'll choose whoever is cheaper.",
        "Strong positioning is one of the biggest competitive advantages.",
      ],
    },
    {
      title: "No growth system",
        body: [
          "Many businesses rely on referrals.",
          "Referrals are valuable, but unpredictable.",
          "Sustainable businesses build systems that generate demand consistently.",
        ],
    },
    {
      title: "Marketing without data",
        body: [
          "Opinions don't scale.",
          "Data does.",
          "The best businesses make decisions using customer behavior, not assumptions.",
        ],
    },
    {
      title: "Waiting too long to innovate",
      body: [
        "Markets change.",
        "Technology changes.",
        "Customer expectations change.",
        "Businesses that adapt early almost always outperform businesses that react late.",
      ],
    },
  ];

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
            Growth Guide
          </span>
          <span>8 min read</span>
        </div>

        <h1 className="mt-6 font-hero text-4xl md:text-5xl font-semibold leading-[1.1] tracking-tight">
          The 7 Growth Mistakes That{" "}
          <span className="text-gradient-gold">Keep Businesses Stuck</span>
        </h1>

        <div className="prose-article mt-14 space-y-10 text-[17px] leading-[1.8] text-white/75 font-light">
          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              Introduction
            </h2>
            <p className="mt-4">Every founder wants growth.</p>
            <p className="mt-4">
              Yet thousands of businesses hit the same ceiling year after year.
            </p>
            <p className="mt-4">Not because they lack ambition.</p>
            <p className="mt-4">
              But because they repeat the same strategic mistakes.
            </p>
            <p className="mt-4 text-white font-normal">
              Here are the seven most common ones.
            </p>
          </section>

          {mistakes.map((m, i) => (
            <section key={m.title}>
              <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
                {i + 1}. {m.title}
              </h2>
              {m.body.map((line, j) => (
                <p key={j} className="mt-4">
                  {line}
                </p>
              ))}
            </section>
          ))}

          <section>
            <h2 className="font-hero text-2xl font-semibold text-white tracking-tight">
              Final Thought
            </h2>
            <p className="mt-4">Growth isn't one big breakthrough.</p>
            <p className="mt-4">
              It's the result of making better strategic decisions consistently.
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
