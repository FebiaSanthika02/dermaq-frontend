import React, { useState, useCallback, useRef } from "react";
import UploadZone from "./components/UploadZone";
import ResultCard from "./components/ResultCard";
import {
  LogoDermiq, IconScan, IconSparkle, IconArrowRight, IconArrowDown,
  IconX, IconZap, IconShield, IconLeaf, IconChevronDown, IconCheck, IconMenu,
} from "./components/Icons";

const API_URL = import.meta.env.VITE_API_URL
  || "https://dermaq-backend-production.up.railway.app";

/* ── Data ───────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <IconZap className="w-5 h-5" />,
    title: "Answers quickly",
    desc: "Share one selfie and see a likely skin type in seconds.",
  },
  {
    icon: <IconSparkle className="w-5 h-5" />,
    title: "Based on your photo",
    desc: "Dermiq looks at how your skin appears in the picture you send.",
  },
  {
    icon: <IconLeaf className="w-5 h-5" />,
    title: "Ideas tailored to you",
    desc: "We suggest simple routines and ingredients people often try at home.",
  },
  {
    icon: <IconShield className="w-5 h-5" />,
    title: "Privacy minded",
    desc: "Your photo is only used for this check—it isn’t kept with your name on our side.",
  },
];

const SKIN_TYPES = [
  { key: "dry",    tag: "Often feels tight",   emoji: "🌿", label: "Dry skin",      desc: "Can feel tight, flaky, smaller-looking pores." },
  { key: "normal", tag: "Fairly balanced",     emoji: "✦",  label: "Normal skin",   desc: "Balanced moisture, finer pores, few issues." },
  { key: "oily",   tag: "Shine‑prone",         emoji: "💧", label: "Oily skin",     desc: "Forehead, nose, and chin tend to look shiny with more visible pores and clogged bumps." },
];

const HOW = [
  { num: "01", title: "Add a photo",        desc: "Face the camera straight on, soft even light, minimal editing." },
  { num: "02", title: "We read your image", desc: "We look for common patterns seen in selfies like yours." },
  { num: "03", title: "See gentle guidance",desc: "Review a calm summary plus everyday routine ideas." },
];

const FAQS = [
  { q: "How reliable is this?",         a: "This is a simple at-home helper, not a clinic visit. If anything worries you—or you need treatment advice—talk to a skin professional." },
  { q: "Do you save my photo?",                 a: "After this check finishes, your photo isn’t kept with your name. Think of it as a one-off look at your picture." },
  { q: "What kinds of pictures work?",             a: "A normal gallery shot is fine—not too dark, and your face shouldn’t be cut off." },
  { q: "What makes the best selfie?", a: "Full face facing forward, natural color (no beauty filters), and light that doesn’t blow out your features." },
  { q: "Can this replace my dermatologist?",         a: "No. Use Dermiq for a quick idea from a photo—your dermatologist still leads on serious concerns or prescriptions." },
];

/* ── FAQ Item ───────────────────────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-stone-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 hover:text-amber transition-colors"
      >
        <span className="font-medium text-[15px] text-ink">{q}</span>
        <IconChevronDown className={`w-4 h-4 text-stone-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="text-stone-500 text-sm pb-5 leading-relaxed">{a}</p>}
    </div>
  );
}

/* ── Main App ───────────────────────────────────────────────────── */
export default function App() {
  const [file,        setFile]       = useState(null);
  const [preview,     setPreview]    = useState(null);
  const [result,      setResult]     = useState(null);
  const [loading,     setLoading]    = useState(false);
  const [error,       setError]      = useState("");
  const [mobileMenu,  setMobileMenu] = useState(false);
  const prevUrlRef                   = useRef(null);
  const analyzeRef                   = useRef(null);

  const scrollToAnalyze = () => {
    analyzeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenu(false);
  };

  const handleFileSelect = useCallback((f) => {
    if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    const url = URL.createObjectURL(f);
    prevUrlRef.current = url;
    setFile(f);
    setPreview(url);
    setResult(null);
    setError("");
    setTimeout(() => analyzeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }, []);

  const handleAnalyze = async () => {
    if (!file || loading) return;
    setLoading(true);
    setError("");
    setResult(null);
    const form = new FormData();
    form.append("file", file);
    try {
      const res  = await fetch(`${API_URL}/analyze`, { method: "POST", body: form });
      const raw  = await res.text();

      let data;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        throw new Error("UNSUPPORTED_RESPONSE");
      }

      if (!res.ok || !data) {
        throw new Error("BAD_RESPONSE");
      }
      setResult(data);
    } catch (e) {
      const fallback =
        typeof e.message === "string" && (
          e.message.includes("fetch") ||
          e.message.includes("Failed to fetch") ||
          e.message.includes("NetworkError")
        );
      if (e.message === "UNSUPPORTED_RESPONSE" || e.message === "BAD_RESPONSE") {
        setError(
          "We couldn’t finish that request cleanly. Wait a minute and try again.",
        );
      } else if (fallback) {
        setError(
          "Connection dropped. Check your internet and try again.",
        );
      } else {
        setError("Something went wrong. Try another photo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    prevUrlRef.current = null;
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");
  };

  const NAV_LINKS = [
    { label: "Home",      href: "#"           },
    { label: "How it works",  href: "#how"         },
    { label: "Skin types", href: "#skin-types"  },
    { label: "Help", href: "#faq"         },
  ];

  return (
    <div className="min-h-screen bg-cream flex flex-col">

      {/* ════════════════════════════════════════════════════════
          NAVBAR — logo kiri · links tengah · CTA kanan
      ════════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-30 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-[68px] flex items-center justify-between relative">

          {/* Logo */}
          <a href="#" className="flex-shrink-0">
            <span className="hidden sm:inline-block"><LogoDermiq boxSize={38} /></span>
            <span className="sm:hidden"><LogoDermiq boxSize={32} /></span>
          </a>

          {/* Desktop nav — centered */}
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href}
                 className="text-sm text-stone-600 hover:text-ink font-medium transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <button
              onClick={scrollToAnalyze}
              className="btn-primary text-xs sm:text-sm py-2 sm:py-2.5 px-3 sm:px-5
                         inline-flex items-center gap-1.5"
            >
              <span className="hidden sm:inline">Analyze my skin</span>
              <span className="sm:hidden">Analyze</span>
              <IconArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden btn-ghost p-2">
              <IconMenu />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="lg:hidden bg-white border-t border-stone-100 px-4 sm:px-6 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setMobileMenu(false)}
                 className="text-sm text-stone-600 hover:text-ink font-medium py-2.5 transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      <main className="flex-1">

        {/* ════════════════════════════════════════════════════
            HERO — besar, bersih, editorial
        ════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-cream-100">

          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none select-none">
            {/* Warm circle kiri atas */}
            <div className="absolute -left-24 top-1/2 -translate-y-1/2 w-[500px] h-[500px]
                            rounded-full bg-amber-muted opacity-40 blur-3xl" />
            {/* Subtle grid texture */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.025]"
                 xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1A1714" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)"/>
            </svg>
          </div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 lg:pt-24
                          pb-12 sm:pb-16 lg:pb-20 text-center animate-fade-in">

            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 badge-amber text-[11px] sm:text-xs
                            mb-5 sm:mb-8 tracking-wide">
              <IconSparkle className="w-3 h-3" />
              Powered by Dermiq
            </div>

            {/* Headline */}
            <h1 className="font-bold text-[2.25rem] sm:text-5xl md:text-6xl lg:text-7xl
                           text-ink leading-[1.1] tracking-tight mb-4 sm:mb-6">
              Understand your skin,<br />
              <span className="text-amber">care with confidence.</span>
            </h1>

            {/* Sub */}
            <p className="text-stone-500 text-sm sm:text-base md:text-lg lg:text-xl
                          max-w-xl mx-auto leading-relaxed mb-7 sm:mb-10 px-2">
              Add one clear face photo to see an easy‑to‑read take on skin type
              plus care ideas that fit everyday life at home.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center
                            mb-10 sm:mb-16 max-w-sm sm:max-w-none mx-auto">
              <button
                onClick={scrollToAnalyze}
                className="btn-primary text-sm sm:text-base flex items-center justify-center gap-2
                           px-5 sm:px-8 py-3 sm:py-3.5 rounded-lg"
              >
                Get started <IconArrowRight />
              </button>
              <a href="#how"
                 className="btn-outline text-sm sm:text-base flex items-center justify-center gap-2
                            px-5 sm:px-8 py-3 sm:py-3.5">
                See how it works <IconArrowDown className="w-4 h-4" />
              </a>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 sm:inline-flex sm:flex-wrap items-center
                            justify-center gap-3 sm:gap-8
                            border border-stone-200 bg-white/80 rounded-2xl
                            px-4 sm:px-8 py-3 sm:py-4 text-sm w-full sm:w-auto">
              {[
                ["3 moods", "Dry • normal • oily"],
                ["Fast enough", "Just moments"],
                ["Free today", "No account needed"],
              ].map(([val, lbl]) => (
                <div key={val} className="text-center">
                  <p className="font-bold text-ink text-sm sm:text-base">{val}</p>
                  <p className="text-stone-400 text-[10px] sm:text-xs mt-0.5">{lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            FEATURES
        ════════════════════════════════════════════════════ */}
        <section id="features" className="bg-white border-y border-stone-200 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <span className="label-section">Highlights</span>
              <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl text-ink mt-2 sm:mt-3 tracking-tight">
                Why people try Dermiq
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {FEATURES.map((f, i) => (
                <div key={i} className="group p-4 sm:p-7 rounded-2xl border border-stone-100 bg-cream-50
                                        hover:border-amber/30 hover:shadow-lift transition-all duration-300">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-muted flex items-center
                                   justify-center text-amber mb-3 sm:mb-5">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-ink text-[13px] sm:text-[15px] mb-1.5 sm:mb-2">{f.title}</h3>
                  <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            HOW IT WORKS
        ════════════════════════════════════════════════════ */}
        <section id="how" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center mb-8 sm:mb-14">
            <span className="label-section">How it works</span>
            <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl text-ink mt-2 sm:mt-3 tracking-tight">
              Three relaxed steps
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 sm:gap-6">
            {HOW.map((h, i) => (
              <div key={i} className="relative p-5 sm:p-8 rounded-2xl border border-stone-200 bg-white
                                      hover:border-amber/40 hover:shadow-lift transition-all duration-300">
                <span className="font-black text-[60px] sm:text-[80px] leading-none text-stone-50
                                  absolute top-2 sm:top-3 right-4 sm:right-5 select-none">{h.num}</span>

                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber flex items-center justify-center
                                 text-white font-bold text-sm mb-3 sm:mb-5 relative z-10">
                  {h.num.replace("0","")}
                </div>
                <h3 className="font-semibold text-ink text-sm sm:text-base mb-1.5 sm:mb-2 relative z-10">
                  {h.title}
                </h3>
                <p className="text-stone-400 text-xs sm:text-sm leading-relaxed relative z-10">{h.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-10">
            <button onClick={scrollToAnalyze}
                    className="btn-primary inline-flex items-center gap-2 text-sm sm:text-base">
              Start now <IconArrowRight />
            </button>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            SKIN TYPES
        ════════════════════════════════════════════════════ */}
        <section id="skin-types" className="bg-white border-y border-stone-200 py-12 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-14">
              <span className="label-section">Skin types</span>
              <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl text-ink mt-2 sm:mt-3 tracking-tight">
                Common patterns we look for
              </h2>
              <p className="text-stone-400 text-xs sm:text-sm mt-2 sm:mt-3 px-4">
                Dermiq focuses on three everyday skin vibes from selfies like yours.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 sm:gap-6">
              {SKIN_TYPES.map((s) => (
                <div key={s.key}
                     className="p-5 sm:p-8 rounded-2xl border border-stone-200 bg-cream-100
                                hover:border-amber/30 hover:shadow-lift transition-all duration-300">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-5">{s.emoji}</div>
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber inline-block" />
                    <span className="text-[10px] sm:text-xs font-semibold text-stone-400 tracking-wide">
                      {s.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-ink text-lg sm:text-xl mb-2 sm:mb-3">{s.label}</h3>
                  <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 sm:mt-10">
              <button onClick={scrollToAnalyze}
                      className="btn-outline inline-flex items-center gap-2 text-sm sm:text-base">
                Find yours <IconArrowRight />
              </button>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            ANALYZE TOOL
        ════════════════════════════════════════════════════ */}
        <section id="analyze" ref={analyzeRef} className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center mb-6 sm:mb-10">
            <span className="label-section">When you’re ready</span>
            <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl text-ink mt-2 sm:mt-3 tracking-tight">
              Share your selfie here
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm mt-2 sm:mt-3">
              Free glance • No sign‑in • Photos aren’t labeled with your name afterward
            </p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 shadow-card
                          p-4 sm:p-6 md:p-8">
            {!file ? (
              <UploadZone onFileSelect={handleFileSelect} disabled={loading} />
            ) : (
              <div className="space-y-4 sm:space-y-6">

                {/* Preview */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch sm:items-start
                                bg-cream rounded-2xl p-4 sm:p-5 border border-stone-100">
                  <div className="relative flex-shrink-0 mx-auto sm:mx-0">
                    <img src={preview} alt="Your photo preview"
                         className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-xl
                                    border border-stone-200 shadow-card" />
                    <button
                      onClick={handleReset}
                      title="Remove photo"
                      className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-stone-200
                                 rounded-full flex items-center justify-center text-stone-400
                                 hover:text-red-400 hover:border-red-200 shadow-sm transition-all"
                    >
                      <IconX />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                    <div className="text-center sm:text-left">
                      <p className="font-semibold text-ink text-xs sm:text-sm truncate">{file.name}</p>
                      <p className="text-stone-400 text-[11px] sm:text-xs mt-0.5">
                        We only look at your picture once for this summary
                      </p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3 justify-center sm:justify-start">
                        {["Photo received", "Ready to analyze"].map((t) => (
                          <span key={t} className="flex items-center gap-1 text-[10px] sm:text-xs text-sage-dark
                                                    bg-sage-muted px-2 sm:px-2.5 py-1 rounded-full font-medium">
                            <IconCheck className="w-3 h-3" /> {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="btn-primary flex items-center justify-center gap-2
                                   disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {loading ? (
                          <>
                            <svg className="w-4 h-4 animate-spin-slow" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5"
                                      strokeDasharray="14 28" strokeLinecap="round"/>
                            </svg>
                            Preparing your results…
                          </>
                        ) : (
                          <><IconScan /> Start analysis</>
                        )}
                      </button>
                      <button onClick={handleReset} className="btn-outline">Different photo</button>
                    </div>
                  </div>
                </div>

                {/* Loading skeleton */}
                {loading && (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-36 bg-stone-100 rounded-2xl" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-32 bg-stone-100 rounded-2xl" />
                      <div className="h-32 bg-stone-100 rounded-2xl" />
                    </div>
                    <div className="h-44 bg-stone-100 rounded-2xl" />
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="flex gap-3 items-start bg-red-50 border border-red-100 rounded-2xl p-4">
                    <span className="text-xl flex-shrink-0">⚠️</span>
                    <div>
                      <p className="text-red-600 font-semibold text-sm">We couldn’t finish</p>
                      <p className="text-red-400 text-sm mt-0.5 leading-snug">{error}</p>
                    </div>
                    <button onClick={() => setError("")} className="ml-auto text-red-300 hover:text-red-500">
                      <IconX />
                    </button>
                  </div>
                )}

                {/* Result */}
                {result && !loading && <ResultCard result={result} />}

                {result && !loading && (
                  <div className="text-center pt-2">
                    <button onClick={handleReset}
                            className="btn-outline inline-flex items-center gap-2 text-sm">
                      Try another photo
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            FAQ
        ════════════════════════════════════════════════════ */}
        <section id="faq" className="bg-white border-t border-stone-200 py-12 sm:py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <span className="label-section">Questions</span>
              <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl text-ink mt-2 sm:mt-3 tracking-tight">
                Answers people ask for first
              </h2>
            </div>
            <div className="divide-y divide-stone-100">
              {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
            </div>
            <div className="text-center mt-8 sm:mt-12">
              <button onClick={scrollToAnalyze}
                      className="btn-primary inline-flex items-center gap-2 text-sm sm:text-base">
                Try again <IconArrowRight />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* ════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════ */}
      <footer className="border-t border-stone-200 bg-ink text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-10">

            <div className="max-w-xs">
              <div className="mb-3 sm:mb-4">
                <LogoDermiq boxSize={36} dark={true} />
              </div>
                <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                Learn your everyday skin tendencies and routines that tend to suit them well.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 sm:gap-x-16 gap-y-2 text-sm">
              <div className="flex flex-col gap-2 sm:gap-2.5">
                <p className="text-stone-500 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-1">Explore</p>
                {[["How it works","#how"],["Skin types","#skin-types"],["Help","#faq"]].map(([l,h]) => (
                  <a key={l} href={h} className="text-stone-400 text-xs sm:text-sm hover:text-amber transition-colors">{l}</a>
                ))}
              </div>
              <div className="flex flex-col gap-2 sm:gap-2.5">
                <p className="text-stone-500 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-1">Services</p>
                {[["Analyze skin","#analyze"],["Discover more","#features"]].map(([l,h]) => (
                  <a key={l} href={h} className="text-stone-400 text-xs sm:text-sm hover:text-amber transition-colors">{l}</a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-stone-800 mt-6 sm:mt-10 pt-4 sm:pt-6 flex flex-col md:flex-row
                           items-center justify-between gap-2 sm:gap-3 text-[11px] sm:text-xs
                           text-stone-600 text-center md:text-left">
            <p>© 2026 Dermiq. All rights reserved.</p>
            <p>This page offers friendly guidance only—talk to your dermatologist whenever something worries you clinically.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
