import { Link, createFileRoute } from "@tanstack/react-router";
import heroGlobe from "@/assets/hero-globe.jpg";
import aboutCoin from "@/assets/about-coin.jpg";
import { useEffect, useState } from "react";

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EGT Verse — Decentralized Earning Ecosystem" },
      { name: "description", content: "Build your future with Web3 earnings. Stake, earn, grow and build passive income through a transparent blockchain-powered ecosystem." },
      { property: "og:title", content: "EGT Verse — Decentralized Earning Ecosystem" },
      { property: "og:description", content: "Stake, earn, grow and build passive income through a transparent blockchain-powered ecosystem." },
    ],
  }),
  component: Home,
});

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Vision & Mission", href: "#vision" },
  { label: "Why Choose?", href: "#why" },
  { label: "Token Utility", href: "#token" },
  { label: "Roadmap", href: "#roadmap" },
];

const marqueeItems = [
  "Blockchain Rewards", "Global Matrix Pools", "Passive Income",
  "Web3 Opportunity", "Financial Freedom", "Upgrade Your Financial Life",
  "Grow With Community",
];

const whyItems = [
  "100% Decentralised System",
  "100% Token Allocation to the Public",
  "Multiple Income Streams",
  "Daily Dividend Rewards",
  "Smart, Secure & Automated Earnings",
  "Transparent 100% Distribution Model",
  "Global Community Matrix Pools",
  "Weekly & Daily Bonus Opportunities",
  "Staking & Exchange Utility",
];

const tokenUtility = [
  { title: "Staking", desc: "Stake tokens and earn passive rewards based on ecosystem activities.", icon: "⬢" },
  { title: "Income Distribution", desc: "Daily dividends | Pair matching | Pool income | Rewards & bonuses.", icon: "◈" },
  { title: "Exchange Utility", desc: "Buy, sell, transfer and trade tokens within and outside the ecosystem.", icon: "⟁" },
  { title: "Withdrawal Utility", desc: "Supports bonuses, stability funds and reward pools.", icon: "◉" },
];

const roadmap = [
  { phase: "Phase 01", title: "Launch", items: ["Token deployment", "Staking module", "Basic income architecture"] },
  { phase: "Phase 02", title: "Expansion", items: ["Exchange listings", "Global community expansion", "Enhanced pooling system"] },
  { phase: "Phase 03", title: "Governance", items: ["DAO model integration", "Community voting rights", "Decentralized treasury"] },
  { phase: "Phase 04", title: "Innovation", items: ["NFT integration", "Cross-chain bridges", "Web3 utility expansion"] },
];

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const contractAddr = "0xa4cfde60D96d18A2Ffe8c673E90F2eDc42c35A83";
  useScrollReveal();

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setScrollPct(max > 0 ? Math.round((h.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const copyAddr = () => {
    navigator.clipboard.writeText(contractAddr);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2 font-display font-bold text-xl">
            <span className="w-9 h-9 rounded-full grid place-items-center text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 12 L9 6 L13 14 L18 4 L21 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            EGT Verse
          </a>

          <ul className="hidden lg:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            {navLinks.map(l => (
              <li key={l.href}><a href={l.href} className="nav-link hover:text-foreground transition-colors">{l.label}</a></li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login" className="px-5 py-2.5 rounded-lg bg-secondary text-foreground font-semibold text-sm hover:bg-secondary/70 transition">Login</Link>
            <Link to="/register" className="btn-primary btn-primary-hover text-sm">Register</Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" className="lg:hidden text-foreground">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/>
            </svg>
          </button>
        </nav>

        {menuOpen && (
          <div className="lg:hidden bg-background/95 border-t border-border px-6 py-4 space-y-3">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block text-muted-foreground hover:text-primary">{l.label}</a>
            ))}
            <div className="flex gap-3 pt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center px-4 py-2 rounded-lg bg-secondary font-semibold text-sm">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center btn-primary text-sm justify-center">Register</Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="pt-32 pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="reveal reveal-left">
            <p className="text-primary font-semibold tracking-[0.2em] text-xs mb-5 uppercase">Decentralized Earning Ecosystem</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
              Build Your Future With<br />
              Web3 <span className="text-gradient">Earnings</span><br />
              In EGT Verse
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              Stake, earn, grow and build passive income through a transparent blockchain-powered ecosystem.
            </p>

            <div className="flex items-center gap-3 mb-8 max-w-md">
              <div className="flex-1 truncate px-4 py-3 rounded-lg bg-input border border-border text-sm text-muted-foreground font-mono">
                {contractAddr}
              </div>
              <button onClick={copyAddr} aria-label="Copy" className="w-12 h-12 grid place-items-center rounded-lg text-primary-foreground transition-transform hover:scale-110 hover:rotate-3" style={{ background: "var(--gradient-primary)" }}>
                {copied ? "✓" : (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
                )}
              </button>
              <a href="#" aria-label="External" className="w-12 h-12 grid place-items-center rounded-lg text-primary-foreground transition-transform hover:scale-110 hover:-rotate-3" style={{ background: "var(--gradient-primary)" }}>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17 17 7M9 7h8v8"/></svg>
              </a>
            </div>

            <a href="#" className="btn-primary btn-primary-hover">Get Started →</a>
          </div>

          <div className="relative flex justify-center reveal reveal-right">
            <div className="absolute inset-0 blur-3xl opacity-50 animate-pulse" style={{ background: "var(--gradient-primary)" }} />
            <img src={heroGlobe} alt="EGT Verse globe" width={1024} height={1024} className="relative w-full max-w-[520px] animate-float rounded-full" />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative reveal reveal-left">
            <div className="absolute -inset-8 blur-3xl opacity-30 animate-pulse" style={{ background: "var(--gradient-primary)" }} />
            <img src={aboutCoin} alt="EGT coin" loading="lazy" width={1024} height={1024} className="relative rounded-2xl w-full animate-float" />
          </div>
          <div className="reveal reveal-right">
            <p className="text-primary font-semibold tracking-[0.2em] text-xs mb-4 uppercase">About Us</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for <span className="text-gradient">Real Growth</span></h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              EGT Verse is a fully decentralized tokenized ecosystem built to empower individuals through transparent, community-driven earning opportunities. Our mission is to deliver a financial model where 100% of tokens belong to the public.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              We merge blockchain transparency with an advanced earning structure to create a sustainable environment where users benefit from daily dividends, multi-level income, staking rewards and multiple bonus layers.
            </p>
            <a href="#" className="btn-primary btn-primary-hover">More About →</a>
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section id="vision" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary font-semibold tracking-[0.2em] text-xs mb-3 uppercase">Vision & Mission</p>
            <h2 className="text-4xl md:text-5xl font-bold">Vision & <span className="text-gradient">Mission</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "Our Vision", body: "To establish the world's most trusted, transparent and community-owned decentralized marketing ecosystem—powered entirely by blockchain technology, public-driven token distribution, and built to create fair, sustainable and accessible opportunities for global participation." },
              { title: "Our Mission", body: "To deliver 100% decentralized digital opportunities, ensure fair and transparent token distribution, provide sustainable earning models for global users, empower individuals through blockchain-based income streams, and create a scalable, secure and rewarding financial ecosystem." }
            ].map((c, i) => (
              <div key={i} className="card-glow p-10 reveal reveal-scale" style={{ transitionDelay: `${i * 120}ms` }}>
                <div className="w-14 h-14 rounded-xl grid place-items-center text-2xl mb-6 text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>{i === 0 ? "◎" : "✦"}</div>
                <h3 className="text-2xl font-bold mb-4">{c.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="py-10 border-y border-border overflow-hidden" style={{ background: "linear-gradient(90deg, oklch(0.20 0.04 30), oklch(0.20 0.04 280))" }}>
        <div className="flex animate-marquee whitespace-nowrap gap-12">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((t, i) => (
            <div key={i} className="flex items-center gap-6 text-2xl md:text-3xl font-bold">
              <svg className="w-6 h-6 text-primary animate-spin-slow" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"/></svg>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section id="why" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary font-semibold tracking-[0.2em] text-xs mb-3 uppercase">Why Choose Us</p>
            <h2 className="text-4xl md:text-5xl font-bold">What Makes Us <span className="text-gradient">Different</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyItems.map((item, i) => (
              <div key={i} className="card-glow p-8 flex items-start gap-4 reveal" style={{ transitionDelay: `${(i % 3) * 100}ms` }}>
                <div className="shrink-0 w-12 h-12 rounded-lg grid place-items-center text-primary-foreground font-bold" style={{ background: "var(--gradient-primary)" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-lg font-semibold pt-2">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOKEN UTILITY */}
      <section id="token" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary font-semibold tracking-[0.2em] text-xs mb-3 uppercase">Token Utility</p>
            <h2 className="text-4xl md:text-5xl font-bold">Token Utility & <span className="text-gradient">Earning Power</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tokenUtility.map((t, i) => (
              <div key={i} className="card-glow p-8 text-center reveal reveal-scale" style={{ transitionDelay: `${i * 110}ms` }}>
                <div className="w-16 h-16 mx-auto rounded-2xl grid place-items-center text-3xl mb-6 text-primary-foreground transition-transform duration-500 hover:rotate-[360deg]" style={{ background: "var(--gradient-primary)" }}>{t.icon}</div>
                <h3 className="text-xl font-bold mb-3">{t.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary font-semibold tracking-[0.2em] text-xs mb-3 uppercase">Our Roadmap</p>
            <h2 className="text-4xl md:text-5xl font-bold">Building The Future Of <span className="text-gradient">Web3 Earnings</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {roadmap.map((r, i) => (
              <div key={i} className="card-glow p-8 relative reveal" style={{ transitionDelay: `${i * 130}ms` }}>
                <div className="text-7xl font-black opacity-10 absolute top-2 right-4">{String(i + 1).padStart(2, "0")}</div>
                <p className="text-primary font-semibold text-sm mb-2">{r.phase}</p>
                <h3 className="text-2xl font-bold mb-5">{r.title}</h3>
                <ul className="space-y-2">
                  {r.items.map(it => (
                    <li key={it} className="text-muted-foreground text-sm flex items-start gap-2">
                      <span className="text-primary mt-1">▸</span>{it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto card-glow p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ background: "var(--gradient-primary)" }} />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Join the <span className="text-gradient">Revolution</span>?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Start your Web3 journey today and become part of a transparent, community-owned ecosystem.</p>
            <a href="#" className="btn-primary btn-primary-hover">Get Started Now →</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative mt-10 border-t border-border bg-card/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-20 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="reveal">
            <a href="#home" className="flex items-center gap-2 font-display font-bold text-2xl mb-5">
              <span className="w-10 h-10 rounded-full grid place-items-center text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12 L9 6 L13 14 L18 4 L21 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              EGT Verse
            </a>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
              EGT Verse is a decentralized Web3 ecosystem for transparent, community-driven earnings with staking, dividends and passive income.
            </p>
          </div>

          <div className="reveal" style={{ transitionDelay: "100ms" }}>
            <h4 className="font-bold text-xl mb-2">Useful Links</h4>
            <div className="h-[3px] w-20 rounded-full mb-7" style={{ background: "var(--gradient-primary)" }} />
            <ul className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              {navLinks.filter(l => l.label !== "Login").map(l => (
                <li key={l.href}><a href={l.href} className="footer-link font-semibold">{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div className="reveal" style={{ transitionDelay: "200ms" }}>
            <h4 className="font-bold text-xl mb-2">Account Links</h4>
            <div className="h-[3px] w-20 rounded-full mb-7" style={{ background: "var(--gradient-primary)" }} />
            <ul className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <li><Link to="/login" className="footer-link font-semibold">Login</Link></li>
              <li><Link to="/register" className="footer-link font-semibold">Register</Link></li>
            </ul>
            <div className="flex gap-3 mt-8">
              {[
                { l: "Twitter", d: "M22 5.8a8.5 8.5 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.4 8.4 0 0 1-2.6 1 4.2 4.2 0 0 0-7.2 3.8A11.9 11.9 0 0 1 3 4.8a4.2 4.2 0 0 0 1.3 5.6 4.2 4.2 0 0 1-1.9-.5v.1a4.2 4.2 0 0 0 3.4 4.1 4.2 4.2 0 0 1-1.9.1 4.2 4.2 0 0 0 3.9 2.9A8.4 8.4 0 0 1 2 18.6 11.9 11.9 0 0 0 8.3 20c7.5 0 11.7-6.3 11.7-11.7v-.5A8.4 8.4 0 0 0 22 5.8z" },
                { l: "Telegram", d: "M21.5 4.5 2.5 12.3l5.2 1.6 2 6.1 3.2-3.1 5.2 3.8 3.4-16.2zM9.5 14.3l9.1-5.7-7.3 6.6-.3 3z" },
                { l: "Discord", d: "M19 5.5A16 16 0 0 0 15 4l-.2.3a14 14 0 0 1 3.5 1.8 16 16 0 0 0-13.5 0A14 14 0 0 1 8.2 4.3L8 4a16 16 0 0 0-4 1.5C1.5 9 1 12.4 1.2 15.8a16 16 0 0 0 4.9 2.5l.7-1A11 11 0 0 1 4.6 16c.2.1.5.3.7.4a11 11 0 0 0 13.4 0l.7-.4a11 11 0 0 1-2.2 1.3l.7 1a16 16 0 0 0 4.9-2.5c.3-4-.6-7.4-3.8-10.3zM9 13.5a1.8 1.8 0 0 1 0-3.6 1.8 1.8 0 0 1 0 3.6zm6 0a1.8 1.8 0 0 1 0-3.6 1.8 1.8 0 0 1 0 3.6z" },
              ].map((s) => (
                <a key={s.l} href="#" aria-label={s.l} className="social-icon">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d={s.d}/></svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} EGT Verse. All rights reserved.</p>
            <a href="#" className="hover:text-primary transition-colors">Terms &amp; Conditions</a>
          </div>
        </div>
      </footer>

      {/* SCROLL PROGRESS */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full grid place-items-center shadow-2xl transition-opacity"
        style={{
          background: `conic-gradient(oklch(0.68 0.22 30) ${scrollPct * 3.6}deg, oklch(0.30 0.03 25) 0deg)`,
          opacity: scrollPct > 2 ? 1 : 0,
          pointerEvents: scrollPct > 2 ? "auto" : "none",
        }}
      >
        <span className="w-12 h-12 rounded-full grid place-items-center text-xs font-bold text-primary-foreground" style={{ background: "linear-gradient(135deg, oklch(0.55 0.20 30), oklch(0.45 0.18 25))" }}>
          {scrollPct}%
        </span>
      </button>
    </div>
  );
}
