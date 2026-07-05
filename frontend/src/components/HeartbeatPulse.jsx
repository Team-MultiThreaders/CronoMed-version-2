// A clearly-visible horizontal EKG line that continuously travels across the screen.
// Meant to be dropped in as a design accent (e.g. just below the header),
// not as a faint background detail.
export default function HeartbeatPulse({ height = 70 }) {
  // One EKG "unit" is 400px wide. We render it 3x back-to-back (each shifted
  // by exactly 400px) and animate a translateX loop of one unit width,
  // so the pattern seam is invisible and the loop feels continuous.
  const unitPaths = [0, 400, 800].map(
    (offset) =>
      `M${offset + 0} 35 L${offset + 60} 35 L${offset + 80} 35 L${offset + 95} 10 L${offset + 110} 60 L${offset + 125} 8 L${offset + 140} 35 L${offset + 160} 35 L${offset + 400} 35`
  );

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl bg-slate-900 shadow-lg"
      style={{ height }}
      aria-hidden="true"
    >
      {/* subtle monitor-screen scanline glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-transparent to-transparent" />

      <svg
        className="absolute top-0 left-0 h-full animate-ekg-travel"
        style={{ width: '1200px' }}
        viewBox="0 0 1200 70"
        preserveAspectRatio="none"
      >
        {unitPaths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#34d399"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>

      {/* leading glow dot that rides the peak of the pulse, purely decorative */}
      <div className="absolute inset-0 flex items-center">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.8)] animate-ekg-dot" />
      </div>
    </div>
  );
}