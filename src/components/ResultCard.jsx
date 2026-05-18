import React from "react";
import { IconCheck, IconLeaf } from "./Icons";

const SKIN_CONFIG = {
  dry:         { bar: "bg-clay",      badge: "badge-clay",  accent: "text-clay-dark"   },
  normal:      { bar: "bg-sage",      badge: "badge-sage",  accent: "text-sage-dark"   },
  oily:        { bar: "bg-stone-400", badge: "badge-stone", accent: "text-stone-600"   },
  combination: { bar: "bg-stone-500", badge: "badge-clay",  accent: "text-stone-700"   },
};

function ProbBar({ label, value, isTop, barClass }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className={`text-xs w-20 capitalize font-medium ${isTop ? "text-ink" : "text-stone-400"}`}>
        {label}
      </span>
      <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ease-out ${isTop ? barClass : "bg-stone-200"}`}
             style={{ width: `${Math.max(value, 0.5)}%` }} />
      </div>
      <span className={`text-xs w-9 text-right font-semibold ${isTop ? "text-stone-700" : "text-stone-300"}`}>
        {value.toFixed(0)}%
      </span>
    </div>
  );
}

export default function ResultCard({ result }) {
  const cfg     = SKIN_CONFIG[result.skin_type] ?? SKIN_CONFIG.normal;
  const probArr = Object.entries(result.probabilities).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-4 animate-slide-up">

      {/* Hero */}
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="label-section block mb-2">Hasil Analisis Kulit</span>
            <h2 className={`font-serif text-3xl font-bold ${cfg.accent}`}>{result.label}</h2>
          </div>
          <div className="text-right">
            <span className={`${cfg.badge}`}>{result.emoji} {result.skin_type}</span>
            <p className="text-2xl font-bold text-ink mt-2">{result.confidence}%</p>
            <p className="text-stone-400 text-xs">keyakinan</p>
          </div>
        </div>
        <div className="h-1 bg-stone-100 rounded-full mb-4 overflow-hidden">
          <div className={`h-full rounded-full ${cfg.bar} transition-all duration-700`}
               style={{ width: `${result.confidence}%` }} />
        </div>
        <p className="text-stone-500 text-sm leading-relaxed">{result.description}</p>
      </div>

      {/* Prob + Ingredients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card-sm p-5">
          <span className="label-section block mb-3">Probabilitas</span>
          <div className="space-y-0.5">
            {probArr.map(([cls, val]) => (
              <ProbBar key={cls} label={cls} value={val}
                       isTop={cls === result.skin_type} barClass={cfg.bar} />
            ))}
          </div>
        </div>
        <div className="card-sm p-5">
          <span className="label-section flex items-center gap-1.5 mb-3">
            <IconLeaf className="w-3.5 h-3.5" /> Bahan yang Cocok
          </span>
          <div className="flex flex-wrap gap-2">
            {result.ingredients?.map((ing, i) => (
              <span key={i} className="badge-stone">{ing}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      {result.tips?.length > 0 && (
        <div className="card p-6">
          <span className="label-section block mb-4">💡 Rekomendasi Perawatan</span>
          <div className="grid sm:grid-cols-2 gap-3">
            {result.tips.map((tip, i) => (
              <div key={i} className="flex gap-3 items-start bg-stone-50 rounded-2xl p-3">
                <span className={`w-6 h-6 rounded-full ${cfg.bar} flex items-center justify-center
                                   text-white flex-shrink-0 mt-0.5`}>
                  <IconCheck className="w-3 h-3" />
                </span>
                <p className="text-stone-600 text-sm leading-snug">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-stone-300 text-xs text-right">Selesai dianalisis ✓</p>
    </div>
  );
}
