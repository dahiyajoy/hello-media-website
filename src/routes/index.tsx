import { createFileRoute, Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import discoverBgAsset from "@/assets/discover-bg.png.asset.json";
import researchBgAsset from "@/assets/research-bg.png.asset.json";
import strategyBgAsset from "@/assets/strategy-bg.png.asset.json";
import brandBgAsset from "@/assets/brand-bg.png.asset.json";
import growthBgAsset from "@/assets/growth-bg.png.asset.json";
import scaleBgAsset from "@/assets/scale-bg.png.asset.json";
import insightStrategyAsset from "@/assets/insight-strategy.png.asset.json";
import insightGrowthMistakesAsset from "@/assets/insight-growth-mistakes.png.asset.json";
import insightAiAsset from "@/assets/insight-ai-bw.png.asset.json";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  Plus,
  Minus,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  Check,
  Cpu,
  Sparkles,
  Stethoscope,
  Home,
  GraduationCap,
  ShoppingBag,
  Factory,
  UtensilsCrossed,
  Briefcase,
} from "lucide-react";

/**
 * On touch devices (no hover capability), activate a hover-equivalent state
 * when the element is scrolled near the middle of the viewport. Desktop is
 * unchanged — hover keeps working as before.
 */
function useTouchInViewActive<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const [tapped, setTapped] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch =
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    if (!isTouch) return;
    const el = ref.current;
    if (!el) return;
    // Activate whenever any part of the card overlaps a horizontal band
    // through the middle ~50% of the viewport. Using threshold 0 and a
    // symmetric rootMargin means large cards still trigger on mobile.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setInView(entry.isIntersecting);
      },
      { rootMargin: "-25% 0px -25% 0px", threshold: 0 },
    );
    io.observe(el);
    // Clear a tap-hold as soon as the card leaves the middle band, so
    // scroll-driven activation stays in sync across cards.
    const onScroll = () => setTapped(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  const handlers = {
    onPointerDown: () => setTapped(true),
  };
  return { ref, active: inView || tapped, handlers };
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

/* ─────────────── Reusable ─────────────── */

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  // The observed wrapper stays static; only the inner element translates.
  // Observing the translating element itself makes it cross its own trigger
  // boundary and oscillate ("vibrate") when it sits right at the margin.
  return (
    <div ref={ref} className={className}>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ duration: 0.55, delay, ease: EASE }}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="eyebrow">
      <span className="h-px w-8 bg-white/30" />
      {children}
    </span>
  );
}

/* Divider that draws itself across as it scrolls into view */
function DrawnDivider({ delay = 0 }: { delay?: number }) {
  return (
    <motion.span
      aria-hidden
      className="block h-px w-full origin-left bg-white/[0.09]"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    />
  );
}

/* Scroll-linked text highlight ,  words light up as you scroll (Sanny intro) */
function LitWord({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: string;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}
    </motion.span>
  );
}

function ScrollHighlightText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i}>
          <LitWord
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
          >
            {w}
          </LitWord>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

/* Physics marquee ,  glides, and eases to a stop on hover instead of freezing */
function SmoothMarquee({
  children,
  speed = 60,
  reverse = false,
  className,
  itemClassName,
}: {
  children: React.ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
}) {
  const x = useMotionValue(0);
  const velocity = useRef(0);
  const hovering = useRef(false);
  const inner = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const target = hovering.current ? 0 : (reverse ? speed : -speed);
    // ease current velocity toward target for a natural glide in/out
    velocity.current += (target - velocity.current) * Math.min(1, delta / 400);
    const half = inner.current ? inner.current.scrollWidth / 2 : 0;
    if (half === 0) return;
    let next = x.get() + (velocity.current * delta) / 1000;
    if (next <= -half) next += half;
    if (next > 0) next -= half;
    x.set(next);
  });

  return (
    <div
      className={`overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)] ${className ?? ""}`}
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      <motion.div ref={inner} style={{ x }} className="flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className={itemClassName}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────── Navbar ─────────────── */

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Industries", href: "#industries" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "Insights", href: "#insights" },
];

function BrandMark() {
  return (
    <a
      href="#top"
      aria-label="Hello Media — back to top"
      className="absolute left-7 top-5 z-20 sm:left-12 sm:top-[38px] lg:left-16"
    >
      <span
        className="whitespace-nowrap font-hero text-[22px] font-extrabold tracking-[-0.01em] lg:text-[34px]"
        style={{ color: "#D8E312" }}
      >
        Hello Media
      </span>
    </a>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-end px-5 pt-6 sm:px-8 sm:pt-12 lg:px-12">
      <nav
        aria-label="Primary"
        className="pointer-events-auto relative flex items-center gap-8 rounded-full py-2 pl-8 pr-2 sm:mr-6 lg:mr-16"
        style={{
          background: "rgba(255,255,255,0.11)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          fontFamily: "'Instrument Sans', 'Inter', sans-serif",
        }}
      >
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="whitespace-nowrap text-[18px] font-semibold tracking-[-0.01em] text-white transition-colors duration-300 ease-out hover:text-[#D8E312]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="relative grid h-7 w-7 place-items-center text-white lg:hidden"
        >
          <motion.span
            className="absolute block h-[2px] w-[22px] rounded-full bg-current"
            animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -6.5 }}
            transition={{ duration: 0.32, ease: EASE }}
          />
          <motion.span
            className="absolute block h-[2px] w-[22px] rounded-full bg-current"
            animate={open ? { opacity: 0, scaleX: 0.3 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.22, ease: EASE }}
          />
          <motion.span
            className="absolute block h-[2px] w-[22px] rounded-full bg-current"
            animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 6.5 }}
            transition={{ duration: 0.32, ease: EASE }}
          />
        </button>

        <a
          href="#contact"
          className="whitespace-nowrap rounded-full bg-white px-6 py-3.5 text-[18px] font-semibold text-[#050505] transition-[background-color,scale] duration-300 ease-out hover:bg-[#D8E312] hover:scale-[1.04]"
        >
          Contact
        </a>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-[calc(100%+12px)] flex w-[220px] flex-col gap-2.5 rounded-2xl p-3.5 lg:hidden"
              style={{ background: "rgba(17,18,20,0.95)" }}
            >
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-[15px] font-semibold text-white/95 hover:text-white"
                >
                  {l.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

/* ─────────────── Hero ─────────────── */

const HERO_STATS = [
  { value: 300, suffix: "%", label: "Avg revenue growth" },
  { value: 95, suffix: "%", label: "Client retention" },
  { value: 20, suffix: "+", label: "Years scaling brands" },
];

function HeroStat({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });
  const v = useCounter(value, inView, 1500, delay);
  return (
    <div ref={ref}>
      <div className="font-hero text-[clamp(38px,3.4vw,54px)] font-black leading-none tracking-[-0.03em] tabular-nums text-white">
        {Math.round(v)}
        {suffix}
      </div>
      <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
        {label}
      </div>
    </div>
  );
}

function HeroResultsRail() {
  return (
    <div className="pointer-events-none absolute right-[clamp(40px,5vw,120px)] top-1/2 z-[2] hidden -translate-y-1/2 flex-col items-end gap-8 text-right xl:flex">
      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
        Proven results
      </div>
      {HERO_STATS.map((s, i) => (
        <div key={s.label} className="flex flex-col items-end">
          {i > 0 && <span className="mb-8 h-px w-[132px] bg-white/12" />}
          <HeroStat {...s} delay={220 + i * 160} />
        </div>
      ))}
    </div>
  );
}

function TrustBadge() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });
  const v = useCounter(500, inView, 1500, 300);
  return (
    <span
      ref={ref}
      className="max-w-[178px] text-[13px] font-medium leading-[1.2] text-white/85 sm:text-[14px]"
    >
      Trusted by{" "}
      <span className="font-hero font-bold tabular-nums text-white">
        {Math.round(v)}+
      </span>{" "}
      businesses worldwide
    </span>
  );
}

function Hero() {
  return (
    <div id="top" className="px-0 pt-6">
      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col items-center sm:w-[calc(100%-32px)] sm:max-w-[1880px]">
      <BrandMark />
      <section
        className="relative z-[4] flex w-full min-h-[80svh] flex-col items-center justify-between overflow-hidden rounded-[32px] px-5 pb-5 pt-10 sm:h-auto sm:min-h-[min(760px,calc(100svh-160px))] sm:justify-start sm:px-3 sm:pb-[clamp(48px,7vh,80px)] sm:pt-7 md:px-8 xl:px-[110px]"
        style={{
          background:
            "linear-gradient(180deg, #111214 0%, #111214 50%, #a4abad 100%)",
        }}
      >
        <div className="relative z-[2] flex w-full flex-1 flex-col items-start justify-between text-left sm:mt-[clamp(104px,19vh,230px)] sm:justify-start sm:px-[clamp(20px,4vw,80px)]">
          <div className="mt-14 flex flex-col items-start justify-start sm:mt-0">
            <Reveal className="w-full">
              <h1
                className="text-shine whitespace-pre-line font-hero font-black sm:hidden"
                style={{
                  fontSize: "clamp(64px, 19vw, 110px)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.08,
                  maxWidth: 891,
                }}
              >
                {"We Build\nBrands\nThat\nScale."}
              </h1>
              <h1
                className="text-shine hidden whitespace-pre-line font-hero font-black sm:block"
                style={{
                  fontSize: "clamp(40px, 10vw, 120px)",
                  letterSpacing: "-0.04em",
                  lineHeight: 0.94,
                  maxWidth: 891,
                }}
              >
                {"We Build\nBrands That\nScale."}
              </h1>
            </Reveal>
          </div>

          <div className="mt-0 flex w-full flex-col items-start gap-8 sm:mt-[clamp(24px,4vh,56px)] sm:gap-[40px]">
            <Reveal delay={0.1} className="w-full">
              <p className="max-w-[560px] text-[15px] sm:text-[17px] leading-[1.4] text-white/[0.72]">
                Building future-ready businesses through strategic consulting,
                branding, AI marketing, and go-to-market execution.
              </p>
            </Reveal>

            <Reveal delay={0.18} className="w-full">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-5 sm:gap-[28px]">
                <motion.a
                  href="#contact"
                  className="rounded-[8px] px-[22px] py-[15px] sm:px-[26px] sm:py-[17px] font-hero text-[15px] sm:text-[16px] font-extrabold text-[#0B0C0E]"
                  style={{ background: "#D8E312" }}
                  whileHover={{ scale: 1.02, filter: "brightness(1.03)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                >
                  Book a strategy session
                </motion.a>

                <a
                  href="#services"
                  className="font-hero text-[15px] sm:text-[16px] font-extrabold text-white transition-opacity duration-200 hover:opacity-70"
                >
                  Our services
                </a>

                <div className="flex items-center gap-[14px] sm:ml-1 sm:gap-[18px]">
                  <TrustBadge />

                  <motion.a
                    href="#case-studies"
                    aria-label="Jump to case studies"
                    className="grid h-[44px] w-[44px] sm:h-[52px] sm:w-[52px] shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm"
                    whileHover={{ scale: 1.06, backgroundColor: "rgba(255,255,255,0.18)" }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <ArrowDown className="h-6 w-6 sm:h-7 sm:w-7" />
                  </motion.a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <HeroResultsRail />
      </section>

      {/* Stacked-sheet effect: on phones the inset per layer is exaggerated
          (90/80/70%) so the steps stay visible at narrow widths. */}
      <div
        aria-hidden
        className="relative z-[3] w-[90%] sm:w-[96%]"
        style={{
          height: 10,
          background: "#34363b",
          borderRadius: "0 0 18px 18px",
          boxShadow: "0 7px 18px rgba(0,0,0,0.45)",
        }}
      />
      <div
        aria-hidden
        className="relative z-[2] w-[80%] sm:w-[92%]"
        style={{
          height: 9,
          background: "#25272b",
          borderRadius: "0 0 16px 16px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
        }}
      />
      <div
        aria-hidden
        className="relative z-[1] w-[70%] sm:w-[88%]"
        style={{
          height: 8,
          background: "#141518",
          borderRadius: "0 0 14px 14px",
          boxShadow: "0 10px 24px rgba(0,0,0,0.55)",
        }}
      />
      </div>
    </div>
  );
}

/* ─────────────── Trust / logos marquee ─────────────── */

function Trust() {
  const clients = [
    "Marvel Group India",
    "Kohler India",
    "Budweiser",
    "Real Vista",
    "Essentia Bhiwadi",
    "Digiworld",
    "Astral Pipes",
    "Volvo",
    "General Motors",
    "Toyota",
    "Grow More",
    "Lite Joy",
    "Orris Group",
    "Pearl Infrastructure",
    "Max Healthcare",
    "Mahagun",
    "Hero Motors",
    "AMR",
    "SPA Group",
    "Foodpanda",
    "Kotak Mahindra Bank",
    "ICICI Bank",
    "Samsung",
    "Capital Infratech",
    "Dukes India",
    "Manav Rachna University",
    "Sunder Deep Educational Institutions",
    "Poly Products Ghana Ltd.",
    "Poly Tanks Ghana Ltd.",
    "Poly Sacks Ghana Ltd.",
    "Poly Kraft Ghana Ltd.",
    "Saara (Hong Kong) Ltd.",
    "Sonnex Packaging & Plastic Industries",
    "Somochem Limited",
    "Somotex",
    "Electromart",
    "South West Estates",
    "Sara Capital",
    "Masco Foods Limited (KFC Franchise Rights, Ghana)",
  ];

  return (
    <section className="py-10 sm:py-14 lg:py-18">
      <div className="container-luxe">
        <Reveal>
          <p className="text-center text-sm font-light tracking-wide text-white/45">
            Trusted by Industry Leaders
          </p>
        </Reveal>

        <div className="mt-8 sm:mt-10">
          <SmoothMarquee
            speed={100}
            itemClassName="flex items-center gap-10 sm:gap-16 md:gap-20 pr-10 sm:pr-16 md:pr-20"
          >
            {clients.map((client, i) => (
              <span
                key={i}
                className="font-display text-lg sm:text-2xl md:text-[2.5rem] font-extrabold tracking-[0.02em] uppercase text-white/35 hover:text-white transition-colors duration-300 whitespace-nowrap"
              >
                {client}
              </span>
            ))}
          </SmoothMarquee>
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 text-center text-sm font-light tracking-wide text-white/45">
            Helping businesses across Healthcare, SaaS, AI, Real Estate, Education, D2C & Professional Services
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────── Section wrapper ─────────────── */

function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  center,
  introWide,
  className,
  contentClassName,
  compact,
}: {
  id?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  children: React.ReactNode;
  center?: boolean;
  introWide?: boolean;
  className?: string;
  contentClassName?: string;
  compact?: boolean;
}) {
  return (
    <section id={id} className={cn("py-10 sm:py-14 lg:py-20 relative", className)}>
      <div className="container-luxe">
        {(eyebrow || title || intro) && (
          <div>
            {(eyebrow || title) && (
              <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
                {eyebrow && (
                  <Reveal>
                    <Eyebrow>{eyebrow}</Eyebrow>
                  </Reveal>
                )}
                {title && (
                  <Reveal delay={0.08}>
                    <h2 className={cn("font-hero font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-[-0.03em]", compact ? "mt-3" : "mt-5")}>
                      {title}
                    </h2>
                  </Reveal>
                )}
              </div>
            )}
            {intro && (
              <Reveal delay={0.16}>
                <div className={cn(`text-lg font-light text-muted-foreground leading-relaxed ${introWide ? "max-w-[52rem]" : "max-w-3xl"} ${center ? "mx-auto text-center" : ""}`, compact ? "mt-3" : "mt-6")}>
                  {intro}
                </div>
              </Reveal>
            )}
          </div>
        )}
        <div className={eyebrow || title ? cn(compact ? "mt-6" : "mt-10", contentClassName) : contentClassName}>{children}</div>
      </div>
    </section>
  );
}

/* ─────────────── About + Philosophy ─────────────── */

function About() {
  const pillars = [
    {
      title: "Strategy First",
      body: "Every engagement begins with strategic business thinking, before campaigns, content, or creative execution.",
    },
    {
      title: "Outcome-Oriented",
      body: "We measure success by business outcomes: revenue growth, qualified leads, market share, and long-term enterprise value.",
    },
    {
      title: "AI-Native",
      body: "We integrate AI across strategy, marketing, automation, and decision-making to help businesses scale faster and smarter.",
    },
  ];
  return (
    <Section
      id="about"
      eyebrow="Who We Are"
      introWide
      className="pb-6 sm:pb-8 lg:pb-10"
      title={
        <>
          We Build{" "}
          <span className="text-gradient-gold">Businesses.</span>{" "}
          Not Just Brands.
        </>
      }
      intro={
        <>
          We help ambitious businesses grow through strategy, branding, AI marketing, and go-to-market expertise, creating measurable business outcomes and sustainable long-term growth.
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {pillars.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.09} className="h-full">
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.05] bg-[#18191b] p-7 pb-7 sm:p-10 sm:pb-8 transition-colors duration-300 hover:border-transparent hover:bg-white"
            >
              <span
                aria-hidden
                className="absolute -top-6 right-2 sm:-top-8 select-none font-hero font-black text-[7rem] sm:text-[9.5rem] leading-none text-white/[0.04] transition-colors duration-300 group-hover:text-black/[0.06]"
              >
                {i + 1}
              </span>
              <h3 className="relative font-hero text-[1.5rem] sm:text-[1.75rem] font-semibold tracking-tight transition-colors duration-300 group-hover:text-[#0a0a0a]">
                {c.title}
              </h3>
              <p className="relative mt-4 sm:mt-5 text-base sm:text-[1.05rem] text-muted-foreground font-light leading-relaxed transition-colors duration-300 group-hover:text-[#33352f]">
                {c.body}
              </p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Philosophy() {
  return (
    <section className={cn("py-10 sm:py-14 lg:py-20 relative", "pt-6 sm:pt-8 lg:pt-10")}>
      <div className="container-luxe max-w-5xl">
        <Reveal>
          <Eyebrow>Our Philosophy</Eyebrow>
        </Reveal>
        <ScrollHighlightText
          className="mt-8 sm:mt-10 font-hero text-[1.6rem] sm:text-4xl lg:text-[3.4rem] font-bold leading-[1.2] sm:leading-[1.15] tracking-[-0.02em] text-white"
          text="“Marketing without strategy is noise.” We believe every successful business starts with a clear strategy, a differentiated brand, and a scalable growth engine."
        />
      </div>
    </section>
  );
}

/* ─────────────── Process ─────────────── */

const processSteps = [
  { title: "Discover", sub: "Business understanding" },
  { title: "Research", sub: "Market insights" },
  { title: "Strategy", sub: "Growth roadmap" },
  { title: "Brand", sub: "Positioning & identity" },
  { title: "Growth", sub: "Marketing execution" },
  { title: "Scale", sub: "Automation & expansion" },
];

function Process() {
  return (
    <Section
      id="process"
      eyebrow="Our Process"
      title={
        <>
          A six-step system for{" "}
          <span className="text-gradient-gold">market leadership.</span>
        </>
      }
      intro="Every engagement follows a disciplined path, from insight to compounding growth."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {processSteps.map((s, i) => {
          const bgUrl =
            i === 0
              ? discoverBgAsset.url
              : i === 1
                ? researchBgAsset.url
                : i === 2
                  ? strategyBgAsset.url
                  : i === 3
                    ? brandBgAsset.url
                    : i === 4
                      ? growthBgAsset.url
                      : i === 5
                        ? scaleBgAsset.url
                        : undefined;
          return (
            <Reveal key={s.title} delay={(i % 3) * 0.07} className="h-full">
              <ProcessCard step={s} index={i} bgUrl={bgUrl} />
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

function ProcessCard({
  step,
  index,
  bgUrl,
}: {
  step: { title: string; sub: string };
  index: number;
  bgUrl?: string;
}) {
  const { ref, active, handlers } = useTouchInViewActive<HTMLDivElement>();
  return (
    <div
      ref={ref}
      {...handlers}
      data-active={active ? "true" : undefined}
      className="group h-full cursor-default"
    >
      <div className="relative h-full overflow-hidden rounded-[1.75rem] border border-white/[0.05] bg-[#18191b] transition-all duration-300 ease-out group-hover:-translate-y-2 group-data-[active=true]:-translate-y-2 group-hover:border-[#D8E312]/40 group-hover:shadow-[0_20px_60px_-15px_rgba(216,227,18,0.18)] group-data-[active=true]:border-[#D8E312]/40 group-data-[active=true]:shadow-[0_20px_60px_-15px_rgba(216,227,18,0.18)]">
        {bgUrl && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 ease-out group-hover:scale-105 group-data-[active=true]:scale-105"
              style={{ backgroundImage: `url(${bgUrl})` }}
            />
            <div className="absolute inset-0 bg-black/55 transition-colors duration-300 ease-out group-hover:bg-black/65 group-data-[active=true]:bg-black/65" />
          </>
        )}
        <div className="relative z-10 p-6 sm:p-8">
          <span className="inline-flex items-center rounded-full border border-white/15 px-4 py-1.5 text-[13px] font-medium text-white/70 transition-colors duration-300 group-hover:border-[#D8E312]/50 group-hover:text-[#D8E312] group-data-[active=true]:border-[#D8E312]/50 group-data-[active=true]:text-[#D8E312]">
            Step {index + 1}
          </span>
          <h3 className="mt-6 font-hero text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            {step.title}
          </h3>
          <p className="mt-2 font-light text-white/60">{step.sub}</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Services ─────────────── */

const services = [
  { title: "Brand Strategy", body: "Position your business as the category leader customers naturally choose." },
  { title: "Marketing Consulting", body: "Executive counsel that turns marketing from cost center into growth engine." },
  { title: "Go-To-Market Strategy", body: "Launch and expand with clarity, audience, offer, channels, and unit economics." },
  { title: "Fractional CMO", body: "Senior marketing leadership without the enterprise overhead." },
  { title: "AI Marketing", body: "AI-native systems that compound insight, personalization, and creative velocity." },
  { title: "Performance Marketing", body: "Revenue-first campaigns engineered for predictable, profitable scale." },
  { title: "SEO", body: "Own the queries your ideal customers use to decide who they trust." },
  { title: "Website Design", body: "Digital flagships that convert intent into pipeline and enterprise value." },
  { title: "Lead Generation", body: "Full-funnel systems that fill your pipeline with the right conversations." },
  { title: "Growth Consulting", body: "Diagnose growth ceilings and rebuild the engine to break through them." },
  { title: "Marketing Automation", body: "Operating infrastructure that scales revenue without scaling headcount." },
  { title: "Personal Branding", body: "Position founders and executives as the most credible voice in the room." },
];

function Services() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <Section
      id="services"
      eyebrow="Services"
      title={
        <>
          Consulting built for{" "}
          <span className="text-gradient-gold">business outcomes.</span>
        </>
      }
      intro="Twelve integrated capabilities, one strategic partner accountable for growth."
    >
      <div onMouseLeave={() => setHovered(null)}>
        {services.map((s, i) => (
          <div
            key={s.title}
            className="relative"
            onMouseEnter={() => setHovered(i)}
          >
            {hovered === i && (
              <motion.div
                layoutId="service-hover"
                className="absolute -inset-x-4 inset-y-1 rounded-2xl bg-white/[0.05]"
                transition={{ type: "spring", stiffness: 400, damping: 36 }}
              />
            )}
            <DrawnDivider delay={Math.min(i, 5) * 0.05} />
            <Reveal delay={Math.min(i, 5) * 0.04}>
              <div className="relative grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 gap-y-1 py-6 sm:grid-cols-[4rem_1.1fr_1.5fr_auto] sm:items-center cursor-pointer">
                <span className="font-light text-base text-white/35 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-hero text-xl sm:text-2xl font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="col-span-3 col-start-1 pl-[2.5rem] text-sm text-muted-foreground font-light leading-relaxed sm:col-span-1 sm:col-start-3 sm:pl-0">
                  {s.body}
                </p>
                <ArrowUpRight
                  className={`hidden h-5 w-5 shrink-0 justify-self-end transition-all duration-300 sm:block ${
                    hovered === i
                      ? "text-white -translate-y-0.5 translate-x-0.5"
                      : "text-white/25"
                  }`}
                />
              </div>
            </Reveal>
          </div>
        ))}
        <DrawnDivider />
      </div>
    </Section>
  );
}

/* ─────────────── Industries ─────────────── */

const industries = [
  { icon: Cpu, name: "AI Startups" },
  { icon: Sparkles, name: "SaaS" },
  { icon: Stethoscope, name: "Healthcare" },
  { icon: Home, name: "Real Estate" },
  { icon: GraduationCap, name: "Education" },
  { icon: ShoppingBag, name: "D2C" },
  { icon: Factory, name: "Manufacturing" },
  { icon: UtensilsCrossed, name: "Hospitality" },
  { icon: Briefcase, name: "Professional Services" },
];

function Industries() {
  return (
    <Section
      id="industries"
      eyebrow="Industries"
      title={
        <>
          Deep fluency across the{" "}
          <span className="text-gradient-gold">sectors we serve.</span>
        </>
      }
      intro="From venture-backed AI startups to established enterprises, we adapt to your market, buyer, and economics."
    >
      <div className="space-y-4">
        {[
          { items: [...industries.slice(0, 5), ...industries.slice(0, 5)], reverse: false },
          { items: [...industries.slice(5), ...industries.slice(5)], reverse: true },
        ].map((row, r) => (
          <SmoothMarquee
            key={r}
            speed={68}
            reverse={row.reverse}
            itemClassName="flex items-center gap-4 pr-4"
          >
            {row.items.map((s, i) => (
              <div
                key={`${s.name}-${i}`}
                className="flex shrink-0 items-center gap-3 rounded-full border border-white/12 px-7 py-4 transition-colors duration-300 hover:bg-white cursor-default group/chip"
              >
                <s.icon className="h-[18px] w-[18px] text-white/50 transition-colors group-hover/chip:text-[rgb(5,6,7)]" />
                <span className="whitespace-nowrap font-hero text-base sm:text-lg font-semibold tracking-tight text-white/85 transition-colors group-hover/chip:text-[rgb(5,6,7)]">
                  {s.name}
                </span>
              </div>
            ))}
          </SmoothMarquee>
        ))}
      </div>
    </Section>
  );
}

/* ─────────────── Comparison ─────────────── */

const compareRows = [
  ["Creates Campaigns", "Builds Growth Systems"],
  ["Runs Ads", "Creates Revenue Engines"],
  ["Measures Likes", "Measures Business Growth"],
  ["Creative First", "Strategy First"],
  ["Vendor", "Strategic Growth Partner"],
];

function WhyUs() {
  return (
    <Section
      eyebrow="Why Hello Media"
      title={
        <>
          Traditional agency,{" "}
          <span className="text-gradient-gold">re-engineered.</span>
        </>
      }
      intro="We rebuilt the agency model around business outcomes, executive accountability, and long-term growth."
    >
      <Reveal>
        <div className="card-luxe overflow-hidden">
          <div className="grid grid-cols-2 border-b border-white/[0.06]">
            <div className="p-4 sm:p-6 lg:p-8 text-center">
              <div className="eyebrow justify-center opacity-60">
                Traditional Agency
              </div>
            </div>
            <div className="p-4 sm:p-6 lg:p-8 text-center bg-white/[0.03] border-l border-white/[0.06]">
              <div className="eyebrow justify-center text-white">Hello Media</div>
            </div>
          </div>
          {compareRows.map(([a, b], i) => (
            <div
              key={i}
              className="group grid grid-cols-2 border-b border-white/[0.06] last:border-0 transition-colors duration-300 hover:bg-white"
            >
              <div className="p-4 sm:p-6 lg:p-7 text-white/35 text-center text-xs sm:text-base line-through decoration-white/20 transition-colors duration-300 group-hover:text-black/40 group-hover:decoration-black/25">
                {a}
              </div>
              <div className="p-4 sm:p-6 lg:p-7 border-l border-white/[0.06] bg-white/[0.02] text-center text-xs sm:text-base font-medium flex items-center justify-center gap-1.5 sm:gap-2 text-white transition-colors duration-300 group-hover:border-black/10 group-hover:bg-transparent group-hover:text-[#0a0a0a]">
                <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/60 shrink-0 transition-colors duration-300 group-hover:text-[#0a0a0a]" />
                {b}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

/* ─────────────── Metrics ─────────────── */

function useCounter(target: number, inView: boolean, duration = 1100, startDelayMs = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) {
      setVal(0);
      return;
    }
    let raf = 0;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(target * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, startDelayMs);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [inView, target, duration, startDelayMs]);
  return val;
}

function Metric({
  value,
  suffix,
  label,
  prefix,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });
  const v = useCounter(value, inView);
  const display = Number.isInteger(value) ? Math.round(v).toString() : v.toFixed(1);
  return (
    <div ref={ref} className="text-center lg:text-left">
      <div className="font-hero font-bold text-4xl sm:text-5xl md:text-6xl text-gradient-gold tracking-[-0.03em]">
        {prefix}
        {display}
        {suffix}
      </div>
      <div className="mt-3 text-sm uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function Outcomes() {
  return (
    <section className="py-10 sm:py-14 lg:py-20 relative border-y border-white/[0.06]">
      <div className="container-luxe">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Business Outcomes</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-hero font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-[-0.03em]">
              Numbers that move{" "}
              <span className="text-gradient-gold">enterprise value.</span>
            </h2>
          </Reveal>
        </div>
        <div className="mt-12 sm:mt-16 grid gap-10 sm:gap-12 grid-cols-2 sm:grid-cols-2 lg:grid-cols-5">
          <Metric value={500} suffix="+" label="Businesses Consulted" />
          <Metric value={300} suffix="%" label="Avg Revenue Growth" />
          <Metric value={5} suffix="×" label="Lead Gen Increase" />
          <Metric value={95} suffix="%" label="Client Retention" />
          <Metric value={50} suffix="+" label="Industries Served" />
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Case Studies ─────────────── */

const cases = [
  {
    industry: "Manufacturing",
    title: "Building a Unified Brand Experience for an International Manufacturer",
    challenge: "Unify brand communication across products, dealers, and international markets.",
    strategy: "Build a scalable brand system through unified branding, dealer marketing, and product communication.",
    execution: "Delivered integrated branding, marketing collateral, and exhibition assets across digital and offline channels.",
    href: "/case-studies/polytank-ghana",
    metrics: [
      { k: "30+ Years", v: "Manufacturing Excellence" },
      { k: "Global Presence", v: "International Trade Exhibitions" },
    ],
  },
  {
    industry: "Education",
    title: "Modernizing a Leading Educational Institution",
    challenge: "Modernize admissions and create a scalable digital education ecosystem.",
    strategy: "Unify branding, admission marketing, lead generation, and automation.",
    execution: "Delivered campaigns, CRM integration, automation, and performance marketing.",
    href: "/case-studies/sunder-deep",
    metrics: [
      { k: "20+ Years", v: "Academic Excellence" },
      { k: "Admission Automation", v: "Traditional & Digital Lead Generation" },
    ],
  },
  {
    industry: "Corporate Branding",
    title: "Strengthening Brand Visibility Through Corporate Communications",
    challenge: "Build stronger public visibility while showcasing the company's values through meaningful offline branding and CSR communication.",
    strategy: "Create a unified corporate communication approach combining brand visibility, CSR storytelling, and experiential brand activation.",
    execution: "Delivered corporate branding assets, CSR campaign communication, event branding, employee engagement creatives, and offline visibility initiatives.",
    href: "/case-studies/masco-foods",
    metrics: [
      { k: "25+ Years", v: "Corporate Presence" },
      { k: "CSR & Brand", v: "Offline Visibility" },
    ],
  },

];

/* Whole-card themes: white → brand yellow → black */
const caseThemes = [
  {
    article: "bg-white border-black/10",
    kicker: "text-black/50",
    chipVal: "text-[#0a0a0a]",
    chipLabel: "text-black/45",
    title: "text-[#0a0a0a]",
    label: "text-black/40",
    body: "text-black/65",
    link: "text-black/70 hover:text-black",
    rule: "border-black/10",
  },
  {
    article: "bg-[#D8E312] border-black/10",
    kicker: "text-black/50",
    chipVal: "text-[#0a0a0a]",
    chipLabel: "text-black/45",
    title: "text-[#0a0a0a]",
    label: "text-black/40",
    body: "text-black/65",
    link: "text-black/70 hover:text-black",
    rule: "border-black/10",
  },
  {
    article: "bg-black border-white/[0.08]",
    kicker: "text-white/50",
    chipVal: "text-white",
    chipLabel: "text-white/45",
    title: "text-white",
    label: "text-white/40",
    body: "text-white/60",
    link: "text-white/70 hover:text-white",
    rule: "border-white/10",
  },
];

function CaseMetric({
  raw,
  label,
  chipVal,
  chipLabel,
  delay,
}: {
  raw: string;
  label: string;
  chipVal: string;
  chipLabel: string;
  delay: number;
}) {
  const ref = useRef(null);
  // in-view whenever any part is visible → reset to 0 only fires once the
  // card is fully off-screen, never while it's still scrolling past.
  const inView = useInView(ref, { once: false, amount: "some" });
  const m = raw.match(/^([^\d.]*)([\d.]+)(.*)$/);
  const isNumeric = !!m;
  const prefix = m ? m[1] : "";
  const target = m ? parseFloat(m[2]) : 0;
  const suffix = m ? m[3] : "";
  const decimals = m && m[2].includes(".") ? 1 : 0;
  const v = useCounter(target, inView, 1200, delay);
  const display = isNumeric ? (decimals ? v.toFixed(1) : Math.round(v).toString()) : raw;
  return (
    <div ref={ref}>
      <div className={`font-hero text-3xl sm:text-4xl font-bold tracking-[-0.02em] tabular-nums ${chipVal}`}>
        {isNumeric && prefix}
        {display}
        {isNumeric && suffix}
      </div>
      <div className={`mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${chipLabel}`}>
        {label}
      </div>
    </div>
  );
}

function CaseStudies() {
  return (
    <Section
      id="case-studies"
      eyebrow="Featured Case Studies"
      title={
        <>
          Work that moved{" "}
          <span className="text-gradient-gold">markets.</span>
        </>
      }
    >
      <div className="space-y-8">
        {cases.map((c, i) => {
          const t = caseThemes[i % caseThemes.length];
          return (
            <div
              key={c.title}
              className="lg:sticky"
              style={{ top: `${104 + i * 36}px` }}
            >
              <article className={`overflow-hidden grid lg:grid-cols-[1.1fr_1.4fr] gap-0 rounded-[2rem] border shadow-[0_24px_64px_rgba(0,0,0,0.35)] lg:min-h-[450px] ${t.article}`}>
                <div className="relative flex min-h-[240px] flex-col justify-between overflow-hidden p-7 sm:p-9 lg:min-h-full lg:p-12">
                  <div className="relative">
                    <div className={`text-[11px] font-semibold uppercase tracking-[0.3em] ${t.kicker}`}>
                      {c.industry}
                    </div>
                    <h3 className={`mt-5 sm:mt-7 font-hero text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.08] tracking-[-0.02em] ${t.title}`}>
                      {c.title}
                    </h3>
                  </div>
                  <div className="relative mt-8 sm:mt-10 flex flex-wrap gap-x-12 gap-y-6">
                    {c.metrics.map((mm, mi) => (
                      <CaseMetric
                        key={mm.v}
                        raw={mm.k}
                        label={mm.v}
                        chipVal={t.chipVal}
                        chipLabel={t.chipLabel}
                        delay={mi * 120}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-12">
                  <div className="grid gap-6 sm:gap-8 sm:grid-cols-3">
                    {[
                      ["Challenge", c.challenge],
                      ["Strategy", c.strategy],
                      ["Execution", c.execution],
                    ].map(([k, v]) => (
                      <div key={k} className={`border-t pt-4 ${t.rule}`}>
                        <div className={`text-[10px] font-bold uppercase tracking-[0.25em] ${t.label}`}>
                          {k}
                        </div>
                        <p className={`mt-3 text-sm leading-[1.65] ${t.body}`}>
                          {v}
                        </p>
                      </div>
                    ))}
                  </div>
                  {(c as { href?: string }).href && (
                    <Link
                      to={(c as { href?: string }).href!}
                      preload="intent"
                      onClick={() => {
                        try {
                          sessionStorage.setItem(
                            "cs-return-y",
                            String(window.scrollY),
                          );
                        } catch {}
                      }}
                      className={`mt-9 inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 ease-out group ${t.link}`}
                    >
                      Read full case study{" "}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ─────────────── Testimonials ─────────────── */

const testimonials = [
  {
    quote:
      "Hello Media rebuilt our entire growth engine. In 12 months we tripled revenue and finally look like the category leader we always claimed to be.",
    name: "Ananya Rao",
    role: "Chief Executive Officer",
    initials: "AR",
  },
  {
    quote:
      "They think like operators, not consultants. Every recommendation ties directly to pipeline, revenue, or enterprise value.",
    name: "Marcus Chen",
    role: "Founder & CEO",
    initials: "MC",
  },
  {
    quote:
      "The most strategic marketing partner we've ever worked with. They earned a permanent seat at our leadership table.",
    name: "Priya Menon",
    role: "Chief Marketing Officer",
    initials: "PM",
  },
];

function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    // restart the timer on every change so a manual pick gets a full 7s
    const t = setTimeout(() => setI((v) => (v + 1) % testimonials.length), 7000);
    return () => clearTimeout(t);
  }, [i]);
  const t = testimonials[i];
  return (
    <Section
      eyebrow="Client Voices"
      title={
        <>
          What leaders say about{" "}
          <span className="text-gradient-gold">working with us.</span>
        </>
      }
    >
      <div className="max-w-4xl mx-auto">
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.45, ease: EASE }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70)
                  setI((v) => (v + 1) % testimonials.length);
                else if (info.offset.x > 70)
                  setI((v) => (v - 1 + testimonials.length) % testimonials.length);
              }}
              className="relative rounded-[2rem] border border-white/[0.05] bg-[#18191b] p-6 sm:p-8 lg:p-14 cursor-grab active:cursor-grabbing select-none"
            >
              <div className="text-sm text-white/40">{t.name}</div>
              <p className="mt-4 sm:mt-5 font-hero text-xl sm:text-2xl lg:text-3xl leading-[1.3] font-medium text-white">
                ‷ {t.quote} ‴
              </p>
              <div className="mt-10 flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-white/[0.06] font-hero font-bold text-white">
                  {t.initials}
                </div>
                <div className="text-left">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2">
          {testimonials.map((_, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              aria-label={`Go to testimonial ${k + 1}`}
              aria-current={k === i}
              className="group cursor-pointer px-1 py-3"
            >
              <span
                className={`block h-1.5 rounded-full transition-all ${
                  k === i ? "w-10 bg-white" : "w-2 bg-white/20 group-hover:bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─────────────── Insights ─────────────── */

const insights: Array<{
  cat: string;
  title: string;
  desc: string;
  time: string;
  href?: string;
  image?: string;
}> = [
  {
    cat: "Strategy",
      title:
        "Why Most Businesses Don't Have a Marketing Problem: They Have a Strategy Problem",
    desc: "Most businesses blame marketing when growth slows. In reality, the biggest bottleneck is often unclear positioning, weak differentiation, and the absence of a scalable business strategy. Discover why strategy, not marketing, is the true foundation of sustainable business growth.",
    time: "8 min read",
    href: "/insights/why-strategy-not-marketing",
    image: insightStrategyAsset.url,
  },
  {
    cat: "Growth Guide",
    title: "The 7 Growth Mistakes That Keep Businesses Stuck",
    desc: "Growth rarely stops because of one big decision. It slows when small strategic mistakes compound over time. Discover the patterns that separate businesses that plateau from those that scale.",
    time: "8 min read",
    href: "/insights/7-growth-mistakes",
    image: insightGrowthMistakesAsset.url,
  },
  {
    cat: "AI Insights",
    title: "AI Won't Replace Great Marketing: It Will Replace Slow Businesses",
    desc: "AI isn't replacing marketers. It's replacing slow execution. Discover how businesses use AI to accelerate research, content, automation, decision-making, and growth while keeping strategy at the center.",
    time: "10 min read",
    href: "/insights/ai-wont-replace-great-marketing",
    image: insightAiAsset.url,
  },
];

function Insights() {
  return (
    <Section
      id="insights"
      eyebrow="Insights"
      title={
        <>
          Ideas from our{" "}
          <span className="text-gradient-gold">strategy desk.</span>
        </>
      }
      intro="Research, guides, and thinking for operators building enduring companies."
      className="py-6 sm:py-8 lg:py-10"
      contentClassName="mt-6"
      compact
    >
      <div className="grid gap-6 md:grid-cols-3">
        {insights.map((a, i) => (
          <Reveal key={a.title} delay={i * 0.08}>
            <InsightCard a={a} index={i} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function InsightCard({
  a,
  index,
}: {
  a: (typeof insights)[number];
  index: number;
}) {
  const { ref, active, handlers } = useTouchInViewActive<HTMLDivElement>();
  return (
    <div
      ref={ref}
      {...handlers}
      data-active={active ? "true" : undefined}
      className="group h-full"
    >
    <article
      className="h-full flex flex-col cursor-pointer overflow-hidden rounded-[2rem] border border-white/[0.05] bg-[#18191b] shadow-[0_2px_10px_-6px_rgba(0,0,0,0.4)] transition-[transform,border-color,background-color,box-shadow] duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[7px] group-hover:border-white/[0.14] group-hover:bg-[#1f2022] group-hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] group-data-[active=true]:-translate-y-[7px] group-data-[active=true]:border-white/[0.14] group-data-[active=true]:bg-[#1f2022] group-data-[active=true]:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] will-change-transform"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        {a.image ? (
          <>
            {/* Single image recolored via filter on hover — a separate gold
                render never aligns pixel-perfectly, so recolor instead. */}
            <img
              src={a.image}
              alt=""
              className="absolute inset-0 block h-full w-full object-cover transition-[filter,scale] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[filter,scale] group-hover:scale-[1.06] group-data-[active=true]:scale-[1.06] group-hover:[filter:sepia(1)_saturate(2.6)_brightness(1.04)] group-data-[active=true]:[filter:sepia(1)_saturate(2.6)_brightness(1.04)]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <span className="absolute top-4 left-4 rounded-full bg-black/40 backdrop-blur border border-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
              {a.cat}
            </span>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-white to-[#e7e9eb] transition-transform duration-700 ease-out group-hover:scale-110 group-data-[active=true]:scale-110" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(0,0,0,0.05),transparent_60%)]" />
            <div className="absolute -bottom-5 -right-3 font-hero font-black text-8xl tracking-[-0.05em] text-black/[0.07] select-none transition-transform duration-700 group-hover:-translate-y-3 group-data-[active=true]:-translate-y-3">
              {String(index + 1).padStart(2, "0")}
            </div>
            <span className="absolute top-4 left-4 rounded-full bg-black/[0.06] backdrop-blur border border-black/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#0a0a0a]">
              {a.cat}
            </span>
          </>
        )}
      </div>
      <div className="p-3.5 flex flex-col flex-1">
        <h3 className="font-hero text-xl font-semibold leading-snug tracking-tight group-hover:text-white group-data-[active=true]:text-white transition-colors duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)]">
          {a.title}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground font-light leading-relaxed flex-1">
          {a.desc}
        </p>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>{a.time}</span>
          {a.href ? (
            <a
              href={a.href}
              className="inline-flex items-center gap-1 text-white/70 group-hover:text-white group-data-[active=true]:text-white transition-colors duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            >
              Read more <ArrowRight className="h-3.5 w-3.5 transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-data-[active=true]:translate-x-1" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1 text-white/70 group-hover:text-white group-data-[active=true]:text-white transition-colors duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)]">
              Read more <ArrowRight className="h-3.5 w-3.5 transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-data-[active=true]:translate-x-1" />
            </span>
          )}
        </div>
      </div>
    </article>
    </div>
  );
}


/* ─────────────── FAQ ─────────────── */

const faqs = [
  {
    q: "Why choose Hello Media?",
    a: "We combine executive-level consulting with modern AI-native execution, one accountable partner across strategy, brand, and growth.",
  },
  {
    q: "How do consulting engagements work?",
    a: "Every engagement starts with a diagnostic sprint, followed by a defined roadmap and either a retained or embedded execution model.",
  },
  {
    q: "Who do you work with?",
    a: "Ambitious founders, CXOs, and enterprise leaders across SaaS, AI, D2C, healthcare, real estate, and professional services.",
  },
  {
    q: "Can startups hire you?",
    a: "Yes. We work with venture-backed startups from seed through Series C, often as a Fractional CMO before a full-time hire.",
  },
  {
    q: "How is pricing structured?",
    a: "Fixed-fee sprints for strategy, monthly retainers for ongoing execution, and equity-inclusive models for select high-conviction partnerships.",
  },
  {
    q: "Do you offer Fractional CMO services?",
    a: "Yes, this is one of our most requested engagements. Senior marketing leadership without the cost or ramp of a full-time hire.",
  },
];

function FAQItem({ q, a, open, onClick }: { q: string; a: string; open: boolean; onClick: () => void }) {
  return (
    <div className="mb-3 rounded-2xl border border-white/[0.05] bg-[#18191b] px-5 sm:px-8">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between gap-4 sm:gap-6 py-5 sm:py-6 text-left"
      >
        <span className="font-hero text-base sm:text-lg font-semibold tracking-tight">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-white shrink-0"
        >
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-4 sm:pr-14 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section
      eyebrow="FAQ"
      title={
        <>
          Questions leaders{" "}
          <span className="text-gradient-gold">ask us.</span>
        </>
      }
    >
      <div className="max-w-3xl mx-auto">
        {faqs.map((f, i) => (
          <FAQItem
            key={f.q}
            q={f.q}
            a={f.a}
            open={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          />
        ))}
      </div>
    </Section>
  );
}

/* ─────────────── CTA ─────────────── */

const CONTACT_EMAIL = "contact@hellomedia.com";

function FinalCTA() {
  return (
    <section id="contact" className="relative py-14 sm:py-18 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(900px_450px_at_50%_0%,rgba(255,255,255,0.05),transparent_60%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="container-luxe relative text-center max-w-3xl">
        <Reveal>
          <div className="flex justify-center">
            <svg
              className="animate-spin-slow h-10 w-10 text-white/70"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2l1.8 6.6L20 6.8l-4.4 5.2 4.4 5.2-6.2-1.8L12 22l-1.8-6.6L4 17.2l4.4-5.2L4 6.8l6.2 1.8L12 2z" />
            </svg>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-8 font-hero font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-[-0.03em]">
            Let's build your next{" "}
            <span className="text-gradient-gold">growth story.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-6 text-lg text-muted-foreground font-light leading-relaxed">
            Whether you're launching, repositioning, or scaling your business,
            Hello Media becomes your strategic growth partner.
          </p>
        </Reveal>
        <Reveal delay={0.22}>
          <div className="mt-10 sm:mt-12 flex flex-col items-center">
            <motion.a
              href="tel:+917292097749"
              className="inline-flex items-center justify-center rounded-[24px] sm:rounded-[28px] bg-white px-8 sm:px-10 py-4 sm:py-5 font-hero text-lg sm:text-xl font-bold tracking-tight text-[rgb(5,6,7)]"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              Book a Strategy Call
            </motion.a>
            <div className="mt-8 sm:mt-9 flex flex-col items-center gap-3.5 sm:flex-row sm:justify-center sm:gap-7">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group inline-flex items-center gap-2 text-[15px] sm:text-base font-medium tracking-tight text-white/90 transition-colors duration-300 hover:text-[#D8E312]"
              >
                <Mail className="h-[1em] w-[1em] shrink-0 opacity-80" />
                <span className="underline-offset-[5px] decoration-[#D8E312]/40 group-hover:underline">
                  {CONTACT_EMAIL}
                </span>
              </a>
              <span aria-hidden className="hidden h-4 w-px bg-white/15 sm:block" />
              <a
                href="tel:+917292097749"
                className="group inline-flex items-center gap-2 text-[15px] sm:text-base font-medium tracking-tight text-white/90 transition-colors duration-300 hover:text-[#D8E312]"
              >
                <Phone className="h-[1em] w-[1em] shrink-0 opacity-80" />
                <span className="underline-offset-[5px] decoration-[#D8E312]/40 group-hover:underline">
                  +91 72920 97749
                </span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────── Footer ─────────────── */

function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="container-luxe py-10 sm:py-12 grid gap-10 sm:gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-[rgb(5,6,7)] font-bold font-hero">
              H
            </span>
            <span className="font-hero text-lg font-bold">
              Hello<span className="text-white/60">Media</span>
            </span>
          </div>
          <p className="mt-5 text-sm text-muted-foreground font-light leading-relaxed max-w-xs">
            Building brands, accelerating growth, and creating market leaders.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 hover:border-white/40 hover:text-white text-muted-foreground transition"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 hover:border-white/40 hover:text-white text-muted-foreground transition"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="mailto:contact@hellomedia.com"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 hover:border-white/40 hover:text-white text-muted-foreground transition"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <div className="eyebrow">Company</div>
          <ul className="mt-5 space-y-3">
            {[
              { label: "About", href: "#about" },
              { label: "Services", href: "#services" },
              { label: "Industries", href: "#industries" },
              { label: "Case Studies", href: "#case-studies" },
              { label: "Insights", href: "#insights" },
              { label: "Contact", href: "#contact" },
            ].map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="eyebrow">Let's Talk</div>
          <h3 className="mt-5 text-sm font-semibold text-white">
            Book Your Strategy Consultation
          </h3>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground font-light">
            <a
              href="mailto:contact@hellomedia.com"
              className="block hover:text-white transition-colors"
            >
              contact@hellomedia.com
            </a>
            <a
              href="tel:+917292097749"
              className="block hover:text-white transition-colors"
            >
              +91 72920 97749
            </a>
          </div>
          <a
            href="#contact"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0B0C0E] transition-colors duration-300 hover:bg-[#D8E312]"
          >
            Book a Call
          </a>
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="container-luxe py-6 flex flex-wrap justify-between gap-4 text-xs text-muted-foreground">
          <div>© 2026 Hello Media. All Rights Reserved.</div>
          <div>Designed & Developed by Hello Media</div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────── Page ─────────────── */

function HomePage() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Trust />
        <About />
        <Philosophy />
        <Process />
        <Services />
        <Industries />
        <WhyUs />
        <Outcomes />
        <CaseStudies />
        <Testimonials />
        <Insights />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
