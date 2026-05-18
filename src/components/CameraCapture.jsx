import React, { useEffect, useRef, useState } from "react";
import { IconCameraOn, IconSwitchCamera, IconX, IconScan } from "./Icons";

/**
 * CameraCapture — modal full-screen yang membuka kamera device,
 * menampilkan live preview, dan meng-capture frame ke File.
 *
 * Props:
 *   open        — boolean, kontrol visibility
 *   onClose     — fungsi tutup modal
 *   onCapture   — callback(file: File) saat user menekan tombol Ambil Foto
 */
export default function CameraCapture({ open, onClose, onCapture }) {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [facing,    setFacing]    = useState("user");        // 'user' | 'environment'
  const [ready,     setReady]     = useState(false);
  const [error,     setError]     = useState("");
  const [shooting,  setShooting]  = useState(false);

  /* ── start camera ────────────────────────────────────────── */
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function start() {
      setReady(false);
      setError("");
      stopStream();

      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Browser tidak mendukung akses kamera.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
          setReady(true);
        }
      } catch (e) {
        setError(
          e.name === "NotAllowedError"
            ? "Akses kamera ditolak. Izinkan akses kamera lalu coba lagi."
            : e.name === "NotFoundError"
            ? "Tidak ada kamera yang tersedia di perangkat ini."
            : "Gagal mengakses kamera: " + (e.message ?? "unknown error"),
        );
      }
    }

    start();
    return () => {
      cancelled = true;
      stopStream();
    };
  }, [open, facing]);

  function stopStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  /* ── capture frame ───────────────────────────────────────── */
  async function handleCapture() {
    if (!videoRef.current || !ready) return;
    setShooting(true);

    try {
      const video  = videoRef.current;
      const canvas = canvasRef.current;
      const w = video.videoWidth  || 1280;
      const h = video.videoHeight || 720;

      canvas.width  = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");

      // Mirror untuk kamera depan supaya hasil sesuai preview
      if (facing === "user") {
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, w, h);
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], `dermiq-scan-${Date.now()}.jpg`, {
              type: "image/jpeg",
            });
            onCapture(file);
            onClose?.();
          }
          setShooting(false);
        },
        "image/jpeg",
        0.92,
      );
    } catch (e) {
      setError("Gagal mengambil foto: " + e.message);
      setShooting(false);
    }
  }

  function handleSwitch() {
    setFacing((f) => (f === "user" ? "environment" : "user"));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* ── Topbar ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/60 text-white">
        <span className="text-sm font-medium">Scan Wajah</span>
        <button
          onClick={() => { stopStream(); onClose?.(); }}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          aria-label="Tutup"
        >
          <IconX className="w-4 h-4" />
        </button>
      </div>

      {/* ── Video area ──────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${facing === "user" ? "scale-x-[-1]" : ""}`}
        />

        {/* Frame overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative w-[78vw] max-w-[420px] aspect-[3/4]">
            {/* Corners */}
            {[
              "top-0 left-0 border-t-2 border-l-2 rounded-tl-2xl",
              "top-0 right-0 border-t-2 border-r-2 rounded-tr-2xl",
              "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-2xl",
              "bottom-0 right-0 border-b-2 border-r-2 rounded-br-2xl",
            ].map((c, i) => (
              <span key={i} className={`absolute w-10 h-10 border-amber ${c}`} />
            ))}
            {/* Center hint */}
            <p className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white/80 text-xs whitespace-nowrap">
              Posisikan wajah dalam frame
            </p>
          </div>
        </div>

        {/* Status overlays */}
        {!ready && !error && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm">
            Memuat kamera...
          </div>
        )}
        {error && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center px-6">
            <div className="bg-white rounded-2xl p-6 max-w-sm text-center">
              <p className="text-red-600 font-semibold text-sm mb-2">⚠️ Kamera tidak tersedia</p>
              <p className="text-stone-600 text-sm">{error}</p>
              <button onClick={onClose} className="btn-outline mt-4 text-sm">Tutup</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom controls ─────────────────────────────────── */}
      <div className="bg-black/70 px-6 py-6 flex items-center justify-between gap-4">
        <div className="w-12" /> {/* spacer kiri */}

        <button
          onClick={handleCapture}
          disabled={!ready || shooting}
          className="w-16 h-16 rounded-full bg-white flex items-center justify-center
                     ring-4 ring-white/30 hover:ring-amber transition disabled:opacity-50"
          aria-label="Ambil foto"
        >
          {shooting ? (
            <svg className="w-6 h-6 animate-spin-slow text-ink" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5"
                      strokeDasharray="14 28" strokeLinecap="round"/>
            </svg>
          ) : (
            <IconScan className="w-7 h-7 text-ink" />
          )}
        </button>

        <button
          onClick={handleSwitch}
          disabled={!ready}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white
                     flex items-center justify-center transition disabled:opacity-50"
          aria-label="Ganti kamera"
        >
          <IconSwitchCamera />
        </button>
      </div>

      {/* hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
