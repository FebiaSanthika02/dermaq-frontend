import React, { useCallback, useRef, useState } from "react";
import { IconCamera, IconUpload, IconCameraOn } from "./Icons";
import CameraCapture from "./CameraCapture";

const MAX_MB = 10;

export default function UploadZone({ onFileSelect, disabled }) {
  const [dragging,    setDragging]    = useState(false);
  const [error,       setError]       = useState("");
  const [cameraOpen,  setCameraOpen]  = useState(false);
  const inputRef                       = useRef();

  const validate = (file) => {
    if (!file) return "No photo selected.";
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
      return "Please choose a photo from your gallery or camera.";
    if (file.size > MAX_MB * 1024 * 1024)
      return "This file is too large. Try a smaller photo.";
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
    <>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`
          relative flex flex-col items-center gap-4 sm:gap-5
          rounded-2xl sm:rounded-3xl
          p-6 sm:p-10 md:p-12
          transition-all duration-300 select-none text-center
          ${dragging
            ? "bg-amber-muted drop-active"
            : "bg-cream-100 border-2 border-dashed border-stone-200 hover:border-amber/40 hover:bg-amber-muted/30"}
          ${disabled ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        <div className={`
          w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center
          transition-all duration-300
          ${dragging ? "bg-amber/15 text-amber-dark scale-110" : "bg-stone-100 text-stone-400"}
        `}>
          <IconCamera className="w-7 h-7 sm:w-9 sm:h-9" />
        </div>

        <div>
          <p className="text-ink font-semibold text-sm sm:text-base mb-1">
            {dragging ? "Drop your photo here" : "Add a face photo"}
          </p>
          <p className="text-stone-400 text-xs sm:text-sm">
            <span className="hidden sm:inline">Drag and drop, or </span>
            <span className="sm:hidden">Choose an option below</span>
            <span className="hidden sm:inline">pick from your device</span>
          </p>
          <p className="text-stone-300 text-xs mt-1">Regular gallery photos • Keep file size small</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          >
            <IconUpload className="w-4 h-4" />
            Choose from gallery
          </button>

          <button
            type="button"
            className="btn-outline flex items-center justify-center gap-2 w-full sm:w-auto
                       border-amber/30 text-amber-dark hover:bg-amber-muted hover:border-amber/50"
            onClick={(e) => { e.stopPropagation(); setCameraOpen(true); }}
          >
            <IconCameraOn className="w-4 h-4" />
            Scan skin
          </button>
        </div>

        <div className="flex gap-2 flex-wrap justify-center">
          {["Bright light", "Face the camera", "No filters"].map((t) => (
            <span key={t} className="badge-stone text-[11px] sm:text-xs">{t}</span>
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

      <CameraCapture
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleFile}
      />
    </>
  );
}
