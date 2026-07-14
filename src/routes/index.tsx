import { createFileRoute } from "@tanstack/react-router";
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
  Menu,
  X,
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
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
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

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center pt-12">
      <nav
        aria-label="Primary"
        className="pointer-events-auto relative flex items-center gap-7 rounded-full px-5 py-2.5 font-hero"
        style={{
          background: "rgba(255,255,255,0.11)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div className="hidden items-center gap-7 sm:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="whitespace-nowrap text-[17px] font-semibold tracking-[-0.01em] text-white transition-opacity duration-200 hover:opacity-70"
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
          className="p-0.5 text-white sm:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <a
          href="#contact"
          className="whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-[17px] font-bold text-[#050505] transition-transform duration-200 hover:scale-[1.03]"
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
              className="absolute right-0 top-[calc(100%+12px)] flex w-[220px] flex-col gap-2.5 rounded-2xl p-3.5 sm:hidden"
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

function Hero() {
  return (
    <div id="top" className="px-0 pt-6">
      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col items-center">
      <section
        className="relative z-[4] flex w-full flex-col items-center overflow-hidden rounded-[32px] px-3 pb-[256px] pt-7 md:px-8 xl:px-[110px]"
        style={{
          height: "min(890px, calc(100svh - 78px))",
          background:
            "linear-gradient(180deg, #111214 0%, #111214 50%, #a4abad 100%)",
        }}
      >
        <div className="relative mt-[clamp(120px,20vh,190px)] flex h-full w-full flex-col items-start pl-[clamp(40px,7vw,140px)]">
          <Reveal>
            <h1
              className="whitespace-pre-line bg-clip-text font-hero font-black text-transparent"
              style={{
                fontSize: "clamp(48px, 9vw, 120px)",
                letterSpacing: "-0.04em",
                lineHeight: 0.94,
                maxWidth: 891,
                backgroundImage:
                  "linear-gradient(100deg, #ffffff 12%, #b9bcbf 55%, #86898d 100%)",
              }}
            >
              {"We Build\nBrands That\nScale."}
            </h1>
          </Reveal>

          <div className="mt-[clamp(28px,5vh,56px)] flex w-full flex-col items-start gap-[40px]">
            <Reveal delay={0.1}>
              <p className="max-w-[560px] text-[17px] leading-[1.4] text-white/[0.72]">
                Building future-ready businesses through strategic consulting,
                branding, AI marketing, and go-to-market execution.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="flex flex-wrap items-center gap-[34px]">
                <motion.a
                  href="#contact"
                  className="rounded-[8px] px-[26px] py-[17px] font-hero text-[16px] font-extrabold text-[#0B0C0E]"
                  style={{ background: "#D8E312" }}
                  whileHover={{ scale: 1.02, filter: "brightness(1.03)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                >
                  Book a strategy session
                </motion.a>

                <a
                  href="#services"
                  className="font-hero text-[16px] font-extrabold text-white transition-opacity duration-200 hover:opacity-70"
                >
                  Our services
                </a>

                <div className="ml-1 flex items-center gap-[18px]">
                  <span className="max-w-[170px] text-[14px] leading-[1.2] text-white/85">
                    Trusted by 500+ businesses worldwide
                  </span>

                  <motion.a
                    href="#case-studies"
                    aria-label="Jump to case studies"
                    className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm"
                    whileHover={{ scale: 1.06, backgroundColor: "rgba(255,255,255,0.18)" }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <ArrowDown className="h-7 w-7" />
                  </motion.a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div
        aria-hidden
        className="relative z-[3] w-[96%]"
        style={{
          height: 10,
          background: "#34363b",
          borderRadius: "0 0 18px 18px",
          boxShadow: "0 7px 18px rgba(0,0,0,0.45)",
        }}
      />
      <div
        aria-hidden
        className="relative z-[2] w-[92%]"
        style={{
          height: 9,
          background: "#25272b",
          borderRadius: "0 0 16px 16px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
        }}
      />
      <div
        aria-hidden
        className="relative z-[1] w-[88%]"
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
    <section className="py-24 lg:py-28">
      <div className="container-luxe">
        <Reveal>
          <p className="text-center text-sm font-light tracking-wide text-white/45">
            Trusted by Industry Leaders
          </p>
        </Reveal>

        <div className="mt-10">
          <SmoothMarquee
            speed={100}
            itemClassName="flex items-center gap-16 md:gap-20 pr-16 md:pr-20"
          >
            {clients.map((client, i) => (
              <span
                key={i}
                className="font-display text-2xl md:text-[2.5rem] font-extrabold tracking-[0.02em] uppercase text-white/35 hover:text-white transition-colors duration-300 whitespace-nowrap"
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
}: {
  id?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  children: React.ReactNode;
  center?: boolean;
  introWide?: boolean;
}) {
  return (
    <section id={id} className="py-24 lg:py-32 relative">
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
                    <h2 className="mt-5 font-hero font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-[-0.03em]">
                      {title}
                    </h2>
                  </Reveal>
                )}
              </div>
            )}
            {intro && (
              <Reveal delay={0.16}>
                <div className={`mt-6 text-lg font-light text-muted-foreground leading-relaxed ${introWide ? "max-w-[52rem]" : "max-w-3xl"} ${center ? "mx-auto text-center" : ""}`}>
                  {intro}
                </div>
              </Reveal>
            )}
          </div>
        )}
        <div className={eyebrow || title ? "mt-16" : ""}>{children}</div>
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
              className="group relative flex h-full min-h-[380px] flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.05] bg-[#18191b] p-10 pb-12 transition-colors duration-300 hover:border-transparent hover:bg-white"
            >
              <span
                aria-hidden
                className="absolute -top-8 right-2 select-none font-hero font-black text-[9.5rem] leading-none text-white/[0.04] transition-colors duration-300 group-hover:text-black/[0.06]"
              >
                {i + 1}
              </span>
              <h3 className="relative font-hero text-[1.75rem] font-semibold tracking-tight transition-colors duration-300 group-hover:text-[#0a0a0a]">
                {c.title}
              </h3>
              <p className="relative mt-5 text-[1.05rem] text-muted-foreground font-light leading-relaxed transition-colors duration-300 group-hover:text-[#33352f]">
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
    <section className="py-24 lg:py-32 relative">
      <div className="container-luxe max-w-5xl">
        <Reveal>
          <Eyebrow>Our Philosophy</Eyebrow>
        </Reveal>
        <ScrollHighlightText
          className="mt-10 font-hero text-3xl sm:text-4xl lg:text-[3.4rem] font-bold leading-[1.15] tracking-[-0.02em] text-white"
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
        {processSteps.map((s, i) => (
          <Reveal key={s.title} delay={(i % 3) * 0.07} className="h-full">
            <div className="group h-full rounded-[1.75rem] border border-white/[0.05] bg-[#18191b] p-8 transition-colors duration-300 hover:bg-white cursor-default">
              <span className="inline-flex items-center rounded-full border border-white/15 px-4 py-1.5 text-[13px] font-medium text-white/70 transition-colors duration-300 group-hover:border-black/20 group-hover:text-[rgb(5,6,7)]/70">
                Step {i + 1}
              </span>
              <h3 className="mt-6 font-hero text-2xl sm:text-3xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-[rgb(5,6,7)]">
                {s.title}
              </h3>
              <p className="mt-2 text-muted-foreground font-light transition-colors duration-300 group-hover:text-[rgb(5,6,7)]/60">
                {s.sub}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
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
            <div className="p-6 lg:p-8 text-center">
              <div className="eyebrow justify-center opacity-60">
                Traditional Agency
              </div>
            </div>
            <div className="p-6 lg:p-8 text-center bg-white/[0.03] border-l border-white/[0.06]">
              <div className="eyebrow justify-center text-white">Hello Media</div>
            </div>
          </div>
          {compareRows.map(([a, b], i) => (
            <div
              key={i}
              className="group grid grid-cols-2 border-b border-white/[0.06] last:border-0 transition-colors duration-300 hover:bg-white"
            >
              <div className="p-6 lg:p-7 text-white/35 text-center text-sm sm:text-base line-through decoration-white/20 transition-colors duration-300 group-hover:text-black/40 group-hover:decoration-black/25">
                {a}
              </div>
              <div className="p-6 lg:p-7 border-l border-white/[0.06] bg-white/[0.02] text-center text-sm sm:text-base font-medium flex items-center justify-center gap-2 text-white transition-colors duration-300 group-hover:border-black/10 group-hover:bg-transparent group-hover:text-[#0a0a0a]">
                <Check className="h-4 w-4 text-white/60 shrink-0 transition-colors duration-300 group-hover:text-[#0a0a0a]" />
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
      <div className="font-hero font-bold text-5xl sm:text-6xl text-gradient-gold tracking-[-0.03em]">
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
    <section className="py-24 lg:py-32 relative border-y border-white/[0.06]">
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
        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
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
    industry: "SaaS",
    title: "From product-led plateau to category leadership",
    challenge: "A vertical SaaS platform hit a growth ceiling at $8M ARR.",
    strategy: "Repositioned the brand, built an ABM engine, and rebuilt GTM around ICP economics.",
    execution: "12-month engagement across brand, content, paid, and lifecycle.",
    metrics: [
      { k: "300%", v: "Revenue Growth" },
      { k: "8×", v: "ROAS" },
    ],
  },
  {
    industry: "D2C",
    title: "Rebuilding a heritage brand for the modern buyer",
    challenge: "A legacy consumer brand losing share to digital-native challengers.",
    strategy: "New brand architecture, DTC website, AI-personalized lifecycle, and creator engine.",
    execution: "Full-funnel rebuild across brand, ecommerce, and performance.",
    metrics: [
      { k: "500%", v: "Lead Growth" },
      { k: "120%", v: "Organic Traffic" },
    ],
  },
  {
    industry: "AI Startup",
    title: "Zero-to-one GTM for an enterprise AI platform",
    challenge: "Seed-stage AI company launching into a crowded enterprise category.",
    strategy: "Founder positioning, category narrative, ABM motion, and pipeline design.",
    execution: "Fractional CMO engagement through Series A.",
    metrics: [
      { k: "$4.2M", v: "Pipeline in 90 days" },
      { k: "6×", v: "Qualified Meetings" },
    ],
  },
];

/* Whole-card themes: 1 = white, 2 = yellow, 3 = black */
const caseThemes = [
  {
    article: "bg-white border-black/10",
    number: "text-black/[0.85]",
    kicker: "text-black/55",
    chip: "bg-black/[0.05] border-black/10",
    chipVal: "text-[#0a0a0a]",
    chipLabel: "text-black/55",
    title: "text-[#0a0a0a]",
    label: "text-black/45",
    body: "text-black/60",
    link: "text-black/60 hover:text-black",
  },
  {
    article: "bg-[#D8E312] border-black/10",
    number: "text-black/[0.8]",
    kicker: "text-black/60",
    chip: "bg-black/[0.08] border-black/15",
    chipVal: "text-[#0a0a0a]",
    chipLabel: "text-black/60",
    title: "text-[#0a0a0a]",
    label: "text-black/50",
    body: "text-black/65",
    link: "text-black/65 hover:text-black",
  },
  {
    article: "bg-[#1e1f22] border-white/[0.09]",
    number: "text-white/[0.85]",
    kicker: "text-white/55",
    chip: "bg-white/[0.06] border-white/10",
    chipVal: "text-white",
    chipLabel: "text-white/55",
    title: "text-white",
    label: "text-white/45",
    body: "text-white/55",
    link: "text-white/70 hover:text-white",
  },
];

function CaseMetric({
  raw,
  label,
  chip,
  chipVal,
  chipLabel,
  delay,
}: {
  raw: string;
  label: string;
  chip: string;
  chipVal: string;
  chipLabel: string;
  delay: number;
}) {
  const ref = useRef(null);
  // in-view whenever any part is visible → reset to 0 only fires once the
  // card is fully off-screen, never while it's still scrolling past.
  const inView = useInView(ref, { once: false, amount: "some" });
  const m = raw.match(/^([^\d.]*)([\d.]+)(.*)$/);
  const prefix = m ? m[1] : "";
  const target = m ? parseFloat(m[2]) : 0;
  const suffix = m ? m[3] : "";
  const decimals = m && m[2].includes(".") ? 1 : 0;
  const v = useCounter(target, inView, 1200, delay);
  const display = decimals ? v.toFixed(1) : Math.round(v).toString();
  return (
    <div ref={ref} className={`rounded-xl backdrop-blur border px-3 py-2 ${chip}`}>
      <div className={`font-hero font-bold text-lg tabular-nums ${chipVal}`}>
        {prefix}
        {display}
        {suffix}
      </div>
      <div className={`text-[10px] uppercase tracking-widest ${chipLabel}`}>
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
      intro="Selected engagements across SaaS, D2C, and enterprise AI."
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
              <article className={`overflow-hidden grid lg:grid-cols-[1.1fr_1.4fr] gap-0 rounded-[2rem] border shadow-[0_-16px_48px_rgba(0,0,0,0.45)] ${t.article}`}>
                <div className="relative flex min-h-[280px] flex-col justify-between overflow-hidden p-8 lg:min-h-full lg:p-10">
                  <div className="relative">
                    <div className={`text-xs uppercase tracking-[0.25em] ${t.kicker}`}>
                      {c.industry}
                    </div>
                    <h3 className={`mt-6 font-hero text-2xl lg:text-3xl font-semibold leading-tight tracking-tight ${t.title}`}>
                      {c.title}
                    </h3>
                  </div>
                  <div className="relative mt-8 flex gap-4">
                    {c.metrics.map((mm, mi) => (
                      <CaseMetric
                        key={mm.v}
                        raw={mm.k}
                        label={mm.v}
                        chip={t.chip}
                        chipVal={t.chipVal}
                        chipLabel={t.chipLabel}
                        delay={mi * 120}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-10">
                  <div className="grid gap-5 sm:grid-cols-3">
                    {[
                      ["Challenge", c.challenge],
                      ["Strategy", c.strategy],
                      ["Execution", c.execution],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <div className={`text-[11px] font-bold uppercase tracking-[0.2em] ${t.label}`}>
                          {k}
                        </div>
                        <p className={`mt-2 text-sm font-light leading-relaxed ${t.body}`}>
                          {v}
                        </p>
                      </div>
                    ))}
                  </div>
                  <a
                    href="#insights"
                    className={`mt-8 inline-flex items-center gap-2 text-sm font-medium transition group ${t.link}`}
                  >
                    Read full case study{" "}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
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
    role: "CEO",
    company: "Northwind SaaS",
    initials: "AR",
  },
  {
    quote:
      "They think like operators, not consultants. Every recommendation ties directly to pipeline, revenue, or enterprise value.",
    name: "Marcus Chen",
    role: "Founder",
    company: "Quanta AI",
    initials: "MC",
  },
  {
    quote:
      "The most strategic marketing partner we've ever worked with. They earned a permanent seat at our leadership table.",
    name: "Priya Menon",
    role: "CMO",
    company: "Meridian Health",
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
              className="relative rounded-[2rem] border border-white/[0.05] bg-[#18191b] p-8 lg:p-14 cursor-grab active:cursor-grabbing select-none"
            >
              <div className="text-sm text-white/40">{t.name}</div>
              <p className="mt-5 font-hero text-2xl sm:text-3xl leading-[1.3] font-medium text-white">
                ‷ {t.quote} ‴
              </p>
              <div className="mt-10 flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-white/[0.06] font-hero font-bold text-white">
                  {t.initials}
                </div>
                <div className="text-left">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {t.role} · {t.company}
                  </div>
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

const insights = [
  {
    cat: "Research",
    title: "The 2026 State of AI-Led Growth",
    desc: "How the top 5% of growth teams are using AI to compound insight, creative, and pipeline.",
    time: "12 min read",
  },
  {
    cat: "Growth Guide",
    title: "The Fractional CMO Playbook",
    desc: "A field manual for founders scaling from $2M to $20M ARR without a full-time CMO.",
    time: "9 min read",
  },
  {
    cat: "AI Insights",
    title: "Beyond Prompts: Building AI Marketing Systems",
    desc: "Why the winners aren't chasing tools, they're re-architecting the marketing stack.",
    time: "7 min read",
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
    >
      <div className="grid gap-6 md:grid-cols-3">
        {insights.map((a, i) => (
          <Reveal key={a.title} delay={i * 0.08}>
            <article className="h-full flex flex-col group cursor-pointer overflow-hidden rounded-[2rem] border border-white/[0.05] bg-[#18191b] transition-[transform,border-color] duration-300 hover:-translate-y-1.5 hover:border-white/[0.14]">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-[#e7e9eb] transition-transform duration-700 ease-out group-hover:scale-110" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(0,0,0,0.05),transparent_60%)]" />
                <div className="absolute -bottom-5 -right-3 font-hero font-black text-8xl tracking-[-0.05em] text-black/[0.07] select-none transition-transform duration-700 group-hover:-translate-y-3">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <span className="absolute top-4 left-4 rounded-full bg-black/[0.06] backdrop-blur border border-black/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#0a0a0a]">
                  {a.cat}
                </span>
              </div>
              <div className="p-7 flex flex-col flex-1">
                <h3 className="font-hero text-xl font-semibold leading-snug tracking-tight group-hover:text-white transition-colors">
                  {a.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed flex-1">
                  {a.desc}
                </p>
                <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{a.time}</span>
                  <span className="inline-flex items-center gap-1 text-white/70 group-hover:text-white group-hover:gap-2 transition-all">
                    Read more <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
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
    <div className="mb-3 rounded-2xl border border-white/[0.05] bg-[#18191b] px-6 sm:px-8">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between gap-6 py-6 text-left"
      >
        <span className="font-hero text-lg font-semibold tracking-tight">{q}</span>
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
            <p className="pb-6 pr-14 text-muted-foreground font-light leading-relaxed">{a}</p>
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

function FinalCTA() {
  return (
    <section id="contact" className="relative py-28 lg:py-36 overflow-hidden">
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
          <motion.a
            href="mailto:contact@hellomedia.in"
            className="mt-12 block w-full rounded-[28px] bg-white py-7 sm:py-9 text-center font-hero text-2xl sm:text-3xl font-bold tracking-tight text-[rgb(5,6,7)]"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            Book Your Strategy Consultation
          </motion.a>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mt-6 text-sm text-muted-foreground">
            or{" "}
            <a
              href="#services"
              className="text-white/80 underline underline-offset-4 decoration-white/30 hover:text-white transition-colors"
            >
              Explore Services
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────── Footer ─────────────── */

function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="container-luxe py-16 grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
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
            A growth consulting firm building brands, engineering revenue, and
            creating market leaders.
          </p>
          <div className="mt-6 flex gap-3">
            {[Linkedin, Instagram, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 hover:border-white/40 hover:text-white text-muted-foreground transition"
                aria-label="Social"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {[
          {
            title: "Company",
            links: ["About", "Services", "Industries", "Case Studies"],
          },
          {
            title: "Resources",
            links: ["Insights", "Research", "Podcasts", "Whitepapers"],
          },
          {
            title: "Legal",
            links: ["Privacy Policy", "Terms", "Cookies", "Contact"],
          },
        ].map((col) => (
          <div key={col.title}>
            <div className="eyebrow">{col.title}</div>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-white transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <div className="eyebrow">Newsletter</div>
          <p className="mt-5 text-sm text-muted-foreground font-light">
            Strategy notes from our desk. Twice a month. No noise.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-4 flex gap-2 rounded-full border border-white/15 p-1.5 bg-black/30"
          >
            <input
              type="email"
              placeholder="you@company.com"
              className="flex-1 bg-transparent px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-[rgb(5,6,7)]">
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="container-luxe py-6 flex flex-wrap justify-between gap-4 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Hello Media. All rights reserved.</div>
          <div>Crafted for founders building market leaders.</div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────── Page ─────────────── */

function HomePage() {
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
