export default function AmbientBackground({ image }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Real photo background */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-bg-drift"
        style={{ backgroundImage: `url('${image}')` }}
      />

      {/* Light overlay so glass cards stay readable over a busy photo */}
      <div className="absolute inset-0 bg-white/55" />

      {/* Traveling pulse line accent */}
      <svg
        className="absolute bottom-[18%] left-0 w-[200%] h-24 animate-pulse-travel"
        viewBox="0 0 1600 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0 50 L620 50 L650 15 L680 85 L710 50 L1600 50"
          fill="none"
          stroke="#059669"
          strokeOpacity="0.18"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}