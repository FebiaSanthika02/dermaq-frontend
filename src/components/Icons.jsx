/**
 * LogoDermiq — icon "face scan" modern + wordmark.
 * Props:
 *   boxSize  — ukuran icon (default 42)
 *   dark     — true = wordmark putih (untuk background gelap)
 */
export function LogoDermiq({ boxSize = 42, dark = false }) {
  return (
    <div className="flex items-center gap-3 select-none">

      {/* ── Icon mark ── */}
      <svg width={boxSize} height={boxSize} viewBox="0 0 48 48" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        {/* Background rounded square */}
        <rect width="48" height="48" rx="11" fill="#1A1714"/>

        {/* Face oval */}
        <ellipse cx="24" cy="27" rx="9" ry="11.5"
                 stroke="#D4A030" strokeWidth="1.8" fill="none"/>
        {/* Head/forehead arc */}
        <path d="M17 23 Q17 14 24 14 Q31 14 31 23"
              stroke="#D4A030" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

        {/* Scan lines */}
        <line x1="12" y1="23" x2="36" y2="23" stroke="#D4A030" strokeWidth="0.7" opacity="0.3"/>
        <line x1="12" y1="27" x2="36" y2="27" stroke="#D4A030" strokeWidth="1.4"/>
        <line x1="12" y1="31" x2="36" y2="31" stroke="#D4A030" strokeWidth="0.7" opacity="0.3"/>

        {/* Scan endpoint dots */}
        <circle cx="12" cy="27" r="1.8" fill="#D4A030"/>
        <circle cx="36" cy="27" r="1.8" fill="#D4A030"/>

        {/* Corner scan brackets */}
        <path d="M5 12 L5 6 L11 6"  stroke="#D4A030" strokeWidth="1.3"
              strokeLinecap="round" opacity="0.55"/>
        <path d="M43 12 L43 6 L37 6" stroke="#D4A030" strokeWidth="1.3"
              strokeLinecap="round" opacity="0.55"/>
        <path d="M5 36 L5 42 L11 42" stroke="#D4A030" strokeWidth="1.3"
              strokeLinecap="round" opacity="0.55"/>
        <path d="M43 36 L43 42 L37 42" stroke="#D4A030" strokeWidth="1.3"
              strokeLinecap="round" opacity="0.55"/>
      </svg>

      {/* ── Wordmark ── */}
      <div className="leading-tight">
        <p style={{ fontSize: boxSize * 0.33, letterSpacing: "0.06em" }}
           className={`font-black uppercase ${dark ? "text-white" : "text-ink"}`}>
          Dermiq
        </p>
        <p style={{ fontSize: boxSize * 0.205, letterSpacing: "0.14em" }}
           className="uppercase font-semibold text-stone-400 mt-0.5">
          Skin Care
        </p>
      </div>

    </div>
  );
}

export function IconScan({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"/>
      <rect x="7" y="7" width="10" height="10" rx="2"/>
    </svg>
  );
}

export function IconSparkle({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" className={className}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
      <path d="M19 3l.8 2.2L22 6l-2.2.8L19 9l-.8-2.2L16 6l2.2-.8z"/>
    </svg>
  );
}

export function IconDroplet({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" className={className}>
      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>
    </svg>
  );
}

export function IconArrowRight({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" className={className}>
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

export function IconArrowDown({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" className={className}>
      <path d="M12 5v14M5 12l7 7 7-7"/>
    </svg>
  );
}

export function IconX({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" className={className}>
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  );
}

export function IconCamera({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );
}

export function IconUpload({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}

export function IconShield({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

export function IconZap({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}

export function IconLeaf({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11 20A7 7 0 0118 7c0 5.25-2.5 9.5-7 10a9 9 0 01-9-9c0-4 1.5-8 5-10 0 4.25 1.5 7.75 4 9"/>
    </svg>
  );
}

export function IconStar({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

export function IconChevronDown({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" className={className}>
      <path d="M6 9l6 6 6-6"/>
    </svg>
  );
}

export function IconCheck({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
         strokeLinecap="round" className={className}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

export function IconMenu({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" className={className}>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}
