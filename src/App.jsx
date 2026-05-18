import React, { useState, useCallback, useRef } from "react";
import UploadZone from "./components/UploadZone";
import ResultCard from "./components/ResultCard";
import {
  LogoDermiq, IconScan, IconSparkle, IconArrowRight, IconArrowDown,
  IconX, IconZap, IconShield, IconLeaf, IconChevronDown, IconCheck, IconMenu,
} from "./components/Icons";

const API_URL = import.meta.env.VITE_API_URL ?? "";

/* ── Data ───────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <IconZap className="w-5 h-5" />,
    title: "Hasil Instan",
    desc: "Upload foto dan dapatkan hasil analisis dalam hitungan detik.",
  },
  {
    icon: <IconSparkle className="w-5 h-5" />,
    title: "Teknologi AI",
    desc: "Dilatih khusus untuk mengenali kondisi kulit wajah secara akurat.",
  },
  {
    icon: <IconLeaf className="w-5 h-5" />,
    title: "Saran Personal",
    desc: "Rekomendasi bahan skincare yang cocok dengan jenis kulitmu.",
  },
  {
    icon: <IconShield className="w-5 h-5" />,
    title: "Privasi Terjaga",
    desc: "Foto tidak disimpan. Diproses langsung dan dihapus setelahnya.",
  },
];

const SKIN_TYPES = [
  { key: "dry",    emoji: "🌿", label: "Kulit Kering",     desc: "Terasa kencang, mudah mengelupas, pori-pori kecil." },
  { key: "normal", emoji: "✦",  label: "Kulit Normal",     desc: "Seimbang, lembap, pori-pori halus, jarang bermasalah." },
  { key: "oily",   emoji: "💧", label: "Kulit Berminyak",  desc: "Zona T mengkilap, pori-pori besar, rentan jerawat." },
];

const HOW = [
  { num: "01", title: "Upload Foto Wajah",    desc: "Ambil foto tampak depan, pencahayaan merata, tanpa filter." },
  { num: "02", title: "AI Menganalisis",       desc: "Sistem membaca kondisi kulitmu dan mengenali jenis kulitmu." },
  { num: "03", title: "Terima Hasilnya",       desc: "Lihat jenis kulit beserta tips perawatan yang sesuai untukmu." },
];

const FAQS = [
  { q: "Seberapa akurat hasil analisisnya?",         a: "Model mencapai akurasi ~75–80% pada data uji. Hasil bersifat indikatif — konfirmasi dengan konsultasi profesional untuk keputusan penting." },
  { q: "Apakah foto saya disimpan?",                 a: "Tidak. Foto diproses langsung di server dan tidak tersimpan dalam bentuk apapun setelah analisis selesai." },
  { q: "Format foto apa yang didukung?",             a: "JPG, PNG, dan WebP dengan ukuran maksimum 10 MB." },
  { q: "Foto seperti apa yang memberikan hasil terbaik?", a: "Foto wajah tampak depan tanpa filter, pencahayaan merata, dan resolusi minimal 300×300 piksel." },
  { q: "Apakah ini pengganti dokter kulit?",         a: "Tidak. Dermiq membantu mengenal kondisi kulitmu, bukan pengganti saran dokter. Untuk masalah serius, kunjungi dokter kulit." },
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
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? "Terjadi kesalahan pada server.");
      setResult(data);
    } catch (e) {
      setError(e.message || "Gagal terhubung ke server. Pastikan backend sudah berjalan di port 8000.");
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
    { label: "Beranda",     href: "#"           },
    { label: "Cara Kerja",  href: "#how"         },
    { label: "Jenis Kulit", href: "#skin-types"  },
    { label: "FAQ",         href: "#faq"         },
  ];

  return (
    <div className="min-h-screen bg-cream flex flex-col">

      {/* ════════════════════════════════════════════════════════
          NAVBAR — logo kiri · links tengah · CTA kanan
      ════════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-30 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 h-[68px] flex items-center justify-between">

          {/* Logo */}
          <a href="#" className="flex-shrink-0">
            <LogoDermiq boxSize={38} />
          </a>

          {/* Desktop nav — centered */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
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
              className="btn-primary text-sm py-2.5 px-5 hidden md:inline-flex items-center gap-1.5"
            >
              Analisis Kulit <IconArrowRight className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden btn-ghost p-2">
              <IconMenu />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="md:hidden bg-white border-t border-stone-100 px-6 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setMobileMenu(false)}
                 className="text-sm text-stone-600 hover:text-ink font-medium py-2.5 transition-colors">
                {l.label}
              </a>
            ))}
            <button onClick={scrollToAnalyze} className="btn-primary mt-2 text-sm text-center">
              Analisis Kulit
            </button>
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

          <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center animate-fade-in">

            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 badge-amber text-xs mb-8 tracking-wide">
              <IconSparkle className="w-3 h-3" />
              Didukung Kecerdasan Buatan
            </div>

            {/* Headline */}
            <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl text-ink leading-[1.1] tracking-tight mb-6">
              Kenali Kulitmu,<br />
              <span className="text-amber">Rawat dengan Tepat.</span>
            </h1>

            {/* Sub */}
            <p className="text-stone-500 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10">
              Upload foto wajahmu dan dapatkan analisis jenis kulit secara instan
              beserta rekomendasi perawatan yang dipersonalisasi.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 justify-center mb-16">
              <button
                onClick={scrollToAnalyze}
                className="btn-primary text-base flex items-center gap-2 px-8 py-3.5 rounded-lg"
              >
                Gunakan Layanan Sekarang <IconArrowRight />
              </button>
              <a href="#how"
                 className="btn-outline text-base flex items-center gap-2 px-8 py-3.5">
                Pelajari Cara Kerja <IconArrowDown className="w-4 h-4" />
              </a>
            </div>

            {/* Stats strip */}
            <div className="inline-flex flex-wrap items-center justify-center gap-8
                            border border-stone-200 bg-white/80 rounded-2xl px-8 py-4 text-sm">
              {[
                ["3 Jenis Kulit", "Terdeteksi AI"],
                ["< 3 Detik",     "Waktu Analisis"],
                ["100% Gratis",   "Tanpa Daftar"],
              ].map(([val, lbl]) => (
                <div key={val} className="text-center">
                  <p className="font-bold text-ink text-base">{val}</p>
                  <p className="text-stone-400 text-xs mt-0.5">{lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            FEATURES
        ════════════════════════════════════════════════════ */}
        <section id="features" className="bg-white border-y border-stone-200 py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="label-section">Keunggulan</span>
              <h2 className="font-bold text-3xl md:text-4xl text-ink mt-3 tracking-tight">
                Mengapa Dermiq?
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((f, i) => (
                <div key={i} className="group p-7 rounded-2xl border border-stone-100 bg-cream-50
                                        hover:border-amber/30 hover:shadow-lift transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-amber-muted flex items-center justify-center
                                   text-amber mb-5">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-ink text-[15px] mb-2">{f.title}</h3>
                  <p className="text-stone-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            HOW IT WORKS
        ════════════════════════════════════════════════════ */}
        <section id="how" className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <span className="label-section">Cara Kerja</span>
            <h2 className="font-bold text-3xl md:text-4xl text-ink mt-3 tracking-tight">
              3 Langkah Mudah
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {HOW.map((h, i) => (
              <div key={i} className="relative p-8 rounded-2xl border border-stone-200 bg-white
                                      hover:border-amber/40 hover:shadow-lift transition-all duration-300">
                {/* Big number watermark */}
                <span className="font-black text-[80px] leading-none text-stone-50 absolute
                                  top-3 right-5 select-none">{h.num}</span>

                {/* Amber dot indicator */}
                <div className="w-10 h-10 rounded-xl bg-amber flex items-center justify-center
                                 text-white font-bold text-sm mb-5 relative z-10">
                  {h.num.replace("0","")}
                </div>
                <h3 className="font-semibold text-ink text-[16px] mb-2 relative z-10">{h.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed relative z-10">{h.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button onClick={scrollToAnalyze}
                    className="btn-primary inline-flex items-center gap-2">
              Mulai Analisis <IconArrowRight />
            </button>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            SKIN TYPES
        ════════════════════════════════════════════════════ */}
        <section id="skin-types" className="bg-white border-y border-stone-200 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="label-section">Jenis Kulit</span>
              <h2 className="font-bold text-3xl md:text-4xl text-ink mt-3 tracking-tight">
                Dermiq Mengenali Jenis Kulitmu
              </h2>
              <p className="text-stone-400 text-sm mt-3">
                Sistem AI kami mampu membedakan 3 kondisi kulit wajah utama
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {SKIN_TYPES.map((s, i) => (
                <div key={s.key}
                     className="p-8 rounded-2xl border border-stone-200 bg-cream-100
                                hover:border-amber/30 hover:shadow-lift transition-all duration-300">
                  <div className="text-4xl mb-5">{s.emoji}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber inline-block" />
                    <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest">
                      {["Dry", "Normal", "Oily"][i]}
                    </span>
                  </div>
                  <h3 className="font-bold text-ink text-xl mb-3">{s.label}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <button onClick={scrollToAnalyze}
                      className="btn-outline inline-flex items-center gap-2">
                Temukan Jenis Kulitmu <IconArrowRight />
              </button>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            ANALYZE TOOL
        ════════════════════════════════════════════════════ */}
        <section id="analyze" ref={analyzeRef} className="max-w-3xl mx-auto px-6 py-20">
          <div className="text-center mb-10">
            <span className="label-section">Analisis Sekarang</span>
            <h2 className="font-bold text-3xl md:text-4xl text-ink mt-3 tracking-tight">
              Upload Foto Wajahmu
            </h2>
            <p className="text-stone-400 text-sm mt-3">
              Gratis · Tanpa daftar · Privasi terjaga
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-card p-8">
            {!file ? (
              <UploadZone onFileSelect={handleFileSelect} disabled={loading} />
            ) : (
              <div className="space-y-6">

                {/* Preview */}
                <div className="flex gap-5 items-start flex-wrap bg-cream rounded-2xl p-5
                                border border-stone-100">
                  <div className="relative flex-shrink-0">
                    <img src={preview} alt="Preview"
                         className="w-32 h-32 object-cover rounded-xl border border-stone-200 shadow-card" />
                    <button
                      onClick={handleReset}
                      title="Hapus foto"
                      className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-stone-200
                                 rounded-full flex items-center justify-center text-stone-400
                                 hover:text-red-400 hover:border-red-200 shadow-sm transition-all"
                    >
                      <IconX />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink text-sm truncate">{file.name}</p>
                      <p className="text-stone-400 text-xs mt-0.5">
                        {(file.size / 1024).toFixed(0)} KB · {file.type.split("/")[1].toUpperCase()}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {["Foto diterima", "Siap dianalisis"].map((t) => (
                          <span key={t} className="flex items-center gap-1 text-xs text-sage-dark
                                                    bg-sage-muted px-2.5 py-1 rounded-full font-medium">
                            <IconCheck className="w-3 h-3" /> {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="btn-primary flex items-center gap-2
                                   disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {loading ? (
                          <>
                            <svg className="w-4 h-4 animate-spin-slow" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5"
                                      strokeDasharray="14 28" strokeLinecap="round"/>
                            </svg>
                            Menganalisis...
                          </>
                        ) : (
                          <><IconScan /> Analisis Kulit</>
                        )}
                      </button>
                      <button onClick={handleReset} className="btn-outline">Ganti Foto</button>
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
                      <p className="text-red-600 font-semibold text-sm">Analisis Gagal</p>
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
                      Analisis Foto Lain
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
        <section id="faq" className="bg-white border-t border-stone-200 py-20">
          <div className="max-w-2xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="label-section">FAQ</span>
              <h2 className="font-bold text-3xl md:text-4xl text-ink mt-3 tracking-tight">
                Pertanyaan Umum
              </h2>
            </div>
            <div className="divide-y divide-stone-100">
              {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
            </div>
            <div className="text-center mt-12">
              <button onClick={scrollToAnalyze}
                      className="btn-primary inline-flex items-center gap-2">
                Coba Analisis Sekarang <IconArrowRight />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* ════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════ */}
      <footer className="border-t border-stone-200 bg-ink text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between gap-10">

            <div className="max-w-xs">
              <div className="mb-4">
                <LogoDermiq boxSize={36} dark={true} />
              </div>
              <p className="text-stone-400 text-sm leading-relaxed">
                Kenali jenis kulitmu dan temukan rutinitas perawatan yang paling cocok untukmu.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-16 gap-y-2 text-sm">
              <div className="flex flex-col gap-2.5">
                <p className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">Navigasi</p>
                {[["Cara Kerja","#how"],["Jenis Kulit","#skin-types"],["FAQ","#faq"]].map(([l,h]) => (
                  <a key={l} href={h} className="text-stone-400 hover:text-amber transition-colors">{l}</a>
                ))}
              </div>
              <div className="flex flex-col gap-2.5">
                <p className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">Layanan</p>
                {[["Analisis Kulit","#analyze"],["Tentang Kami","#features"]].map(([l,h]) => (
                  <a key={l} href={h} className="text-stone-400 hover:text-amber transition-colors">{l}</a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-stone-800 mt-10 pt-6 flex flex-col md:flex-row items-center
                           justify-between gap-3 text-xs text-stone-600">
            <p>© 2026 Dermiq. Hak cipta dilindungi.</p>
            <p>Hasil analisis bersifat panduan, bukan pengganti saran dokter kulit.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
