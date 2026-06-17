import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import comingSoonBg from "@/assets/coming-soon-bg.jpg";
import downloadShape from "@/assets/download-shape-3.png";
import logo from "@/assets/logo_white.png";
import starShape from "@/assets/star-shape.png";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", href: "/#about" },
  { label: "Vision & Mission", href: "/#vision" },
  { label: "Why Choose?", href: "/#why" },
  { label: "Token Utility", href: "/#token" },
  { label: "Roadmap", href: "/#roadmap" },
];

function BrandMark({ size = "default" }: { size?: "default" | "small" }) {
  return (
    <span className={`egt-brand ${size === "small" ? "egt-brand--small" : ""}`}>
      <img src={logo} alt="EGT Verse" className="egt-brand__image" />
    </span>
  );
}

function Header() {
  return (
    <header className="egt-auth-header">
      <div className="egt-auth-container egt-auth-header__inner">
        <Link to="/" className="egt-auth-logo" aria-label="EGT Verse home">
          <BrandMark />
        </Link>

        <nav className="egt-auth-nav" aria-label="Primary navigation">
          {navLinks.map((link) =>
            link.to ? (
              <Link key={link.label} to={link.to} className="egt-auth-nav__link">
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} className="egt-auth-nav__link">
                {link.label}
              </a>
            )
          )}
        </nav>

        <div className="egt-auth-actions">
          <Link to="/login" className="egt-site-btn egt-site-btn--ghost">
            Login
          </Link>
          <Link to="/register" className="egt-site-btn egt-site-btn--solid">
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="egt-auth-footer">
      <div className="egt-auth-container egt-auth-footer__main">
        <div>
          <Link to="/" className="egt-auth-footer__brand">
            <BrandMark size="small" />
          </Link>
          <p className="egt-auth-footer__text">
            EGT Verse is a decentralized Web3 ecosystem for transparent, community-driven earnings with staking,
            dividends and passive income.
          </p>
        </div>

        <div>
          <h3 className="egt-auth-footer__title">Useful Links</h3>
          <div className="egt-auth-footer__line" />
          <ul className="egt-auth-footer__links egt-auth-footer__links--two">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.to ? (
                  <Link to={link.to} className="egt-auth-footer__link">
                    {link.label}
                  </Link>
                ) : (
                  <a href={link.href} className="egt-auth-footer__link">
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="egt-auth-footer__title">Account Links</h3>
          <div className="egt-auth-footer__line" />
          <ul className="egt-auth-footer__links">
            <li>
              <Link to="/login" className="egt-auth-footer__link">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="egt-auth-footer__link">
                Register
              </Link>
            </li>
          </ul>
        </div>
      </div>
<div 
  className="egt-auth-footer__bottom" 
  style={{ 
    width: '100%'
  }}
>
  <div 
    className="egt-auth-footer__bottom-inner"
    style={{
      maxWidth: '1200px',
      margin: '0 auto',
      // padding: '0 10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}
  >
    <p style={{ margin: 0, color: '#9ca3af' }}>
      © {new Date().getFullYear()} EGT Verse. All rights reserved.
    </p>
    <a 
      href="#" 
      className="egt-auth-footer__terms"
      style={{ color: '#9ca3af', textDecoration: 'none' }}
    >
      Terms &amp; Conditions
    </a>
  </div>
</div>
    </footer>
  );
}

function ScrollProgressButton() {
  const [scrollState, setScrollState] = useState({ pct: 0, visible: false });

  useEffect(() => {
    const onScroll = () => {
      const page = document.documentElement;
      const max = page.scrollHeight - page.clientHeight;
      setScrollState({
        pct: max > 0 ? Math.round((page.scrollTop / max) * 100) : 0,
        visible: page.scrollTop > 80,
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      className="egt-auth-scroll"
      style={{
        opacity: scrollState.visible ? 1 : 0,
        visibility: scrollState.visible ? "visible" : "hidden",
        pointerEvents: scrollState.visible ? "auto" : "none",
        background: `conic-gradient(#d4483c ${scrollState.pct * 3.6}deg, rgba(255,255,255,0.18) 0deg)`,
        transform: scrollState.visible ? "translateY(0) scale(1)" : "translateY(8px) scale(0.92)",
      }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      <span>{scrollState.pct}%</span>
    </button>
  );
}

interface EgtAuthLayoutProps {
  title: string;
  children: ReactNode;
}

export function EgtAuthLayout({ title, children }: EgtAuthLayoutProps) {
  return (
    <main className="egt-auth-page">
      <Header />

      <section className="egt-auth-hero">
        <img src={comingSoonBg} alt="" className="egt-auth-bg-img" aria-hidden="true" />
        <div className="egt-auth-bg" aria-hidden="true" />
        <img src={starShape} alt="" className="egt-auth-star egt-auth-star--left" aria-hidden="true" />
        <img src={downloadShape} alt="" className="egt-auth-ring" aria-hidden="true" />

        <div className="egt-auth-container egt-auth-hero__inner">
          <h1 className="egt-auth-title">{title}</h1>
          <div className="egt-auth-form-wrap">{children}</div>
        </div>
      </section>

      <Footer />
      <ScrollProgressButton />
    </main>
  );
}
