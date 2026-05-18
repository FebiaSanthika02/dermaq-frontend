import React, { useCallback, useRef, useState } from "react";
import { IconCamera, IconUpload } from "./Icons";

const MAX_MB = 10;

export default function UploadZone({ onFileSelect, disabled }) {
  const [dragging, setDragging] = useState(false);
  const [error,    setError]    = useState("");
  const inputRef               = useRef();

  const validate = (file) => {
    if (!file) return "Tidak ada file yang dipilih.";
    if (!["image/jpeg","image/png","image/webp"].includes(file.type))
      return "Format tidak didukung. Gunakan JPG, PNG, atau WebP.";
    if (file.size > MAX_MB * 1024 * 1024)
      return `Ukuran file melebihi ${MAX_MB} MB.`;
    return null;
  };

  const handleFile = useCallback((file) => {
    const err = validate(file);
    if (err) { setError(err); return; }
    setError("");
    onFileSelect(file);
  }, [onFileSelect]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`
        relative flex flex-col items-center gap-5 rounded-3xl p-12 cursor-pointer
        transition-all duration-300 select-none text-center
        ${dragging
          ? "bg-amber-muted drop-active"
          : "bg-cream-100 border-2 border-dashed border-stone-200 hover:border-amber/40 hover:bg-amber-muted/30"}
        ${disabled ? "opacity-50 pointer-events-none" : ""}
      `}
    >
      <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
                        ${dragging ? "bg-amber/15 text-amber-dark scale-110" : "bg-stone-100 text-stone-400"}`}>
        <IconCamera className="w-9 h-9" />
      </div>

      <div>
        <p className="text-ink font-semibold text-base mb-1">
          {dragging ? "Lepaskan foto di sini" : "Upload foto wajahmu"}
        </p>
        <p className="text-stone-400 text-sm">Seret & lepas, atau klik untuk memilih</p>
        <p className="text-stone-300 text-xs mt-1">JPG · PNG · WebP · Maks {MAX_MB} MB</p>
      </div>

      <button
        type="button"
        className="btn-primary flex items-center gap-2"
        onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
      >
        <IconUpload className="w-4 h-4" />
        Pilih Foto
      </button>

      <div className="flex gap-3 flex-wrap justify-center">
        {["💡 Cahaya terang", "👁 Tampak depan", "🚫 Tanpa filter"].map((t) => (
          <span key={t} className="badge-stone">{t}</span>
        ))}
      </div>

      {error && <p className="text-red-400 text-xs font-medium">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}
