import React from 'react';

interface QuadGenLogoProps {
  className?: string;
  variant?: 'full' | 'mark-only' | 'header-compact' | 'icon';
  height?: number;
}

export const QuadGenLogo: React.FC<QuadGenLogoProps> = ({
  className = '',
  variant = 'full',
  height = 36,
}) => {
  // SVG Graphic of the QuadGen 3D sphere with metallic blue/silver and cyan ribbon
  const renderSphere = (size = 36) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <defs>
        {/* Soft ground shadow beneath sphere */}
        <radialGradient id="qg-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0f172a" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#0f172a" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
        </radialGradient>

        {/* Sphere Top & Bottom Deep Blue Metallic */}
        <radialGradient id="qg-blue-metal" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="40%" stopColor="#1D4ED8" />
          <stop offset="75%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>

        {/* Silver Chrome Middle Segment */}
        <linearGradient id="qg-chrome" x1="20%" y1="20%" x2="80%" y2="80%">
          <stop offset="0%" stopColor="#64748B" />
          <stop offset="30%" stopColor="#F1F5F9" />
          <stop offset="50%" stopColor="#CBD5E1" />
          <stop offset="70%" stopColor="#475569" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>

        {/* Cyan Ribbon Front Gradient */}
        <linearGradient id="qg-ribbon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>

        {/* Cyan Ribbon Back/Fold Gradient */}
        <linearGradient id="qg-ribbon-back" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        {/* Sphere clip to keep spherical shape */}
        <clipPath id="sphere-clip">
          <circle cx="50" cy="46" r="38" />
        </clipPath>
      </defs>

      {/* Drop shadow on "table" */}
      <ellipse cx="50" cy="91" rx="26" ry="6" fill="url(#qg-shadow)" />

      {/* Main Clipped Sphere Content */}
      <g clipPath="url(#sphere-clip)">
        {/* Base Sphere */}
        <circle cx="50" cy="46" r="38" fill="url(#qg-blue-metal)" />

        {/* Chrome metallic curve sweep */}
        <path
          d="M 12 46 C 25 24, 75 22, 88 46 C 88 56, 75 68, 50 68 C 25 68, 12 56, 12 46 Z"
          fill="url(#qg-chrome)"
        />

        {/* Secondary blue metallic counter-curve */}
        <path
          d="M 12 48 C 28 65, 72 65, 88 48 C 88 72, 70 84, 50 84 C 30 84, 12 72, 12 48 Z"
          fill="url(#qg-blue-metal)"
        />

        {/* Specular highlight on top curve */}
        <ellipse cx="42" cy="22" rx="18" ry="8" fill="#FFFFFF" fillOpacity="0.45" transform="rotate(-15 42 22)" />
      </g>

      {/* Cyan Wrapping Ribbon - Behind Left */}
      <path
        d="M 16 35 C 13 32, 12 28, 18 24 C 23 20, 27 22, 28 26 C 24 28, 20 31, 16 35 Z"
        fill="url(#qg-ribbon-back)"
      />

      {/* Cyan Wrapping Ribbon - Front Diagonal Swirl Across Sphere */}
      <path
        d="M 18 24 C 34 32, 56 60, 80 62 C 86 62, 88 58, 86 54 C 64 50, 42 26, 26 21 Z"
        fill="url(#qg-ribbon)"
      />

      {/* Cyan Ribbon Tail - Front Bottom Right Wrap */}
      <path
        d="M 76 59 C 83 59, 89 62, 88 66 C 86 70, 78 72, 70 70 C 74 66, 76 62, 76 59 Z"
        fill="url(#qg-ribbon-back)"
      />
    </svg>
  );

  if (variant === 'mark-only' || variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{renderSphere(height)}</div>;
  }

  if (variant === 'header-compact') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        {renderSphere(32)}
        <div className="flex flex-col leading-tight">
          <div className="flex items-baseline font-bold tracking-tight text-slate-900">
            <span className="text-[17px] font-semibold text-[#1e40af]">Quad</span>
            <span className="text-[17px] font-semibold text-[#0284c7]">Gen</span>
          </div>
          <span className="text-[9px] font-bold tracking-[0.18em] text-[#0284c7] uppercase">
            Wireless Solutions
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {renderSphere(height)}
      <div className="flex flex-col">
        <div className="flex items-baseline font-serif font-bold text-slate-900 leading-none">
          <span className="text-[20px] tracking-tight text-[#1e3a8a]">Quad</span>
          <span className="text-[20px] tracking-tight text-[#0284c7]">Gen</span>
        </div>
        <span className="text-[9.5px] font-semibold tracking-[0.22em] text-[#0284c7] uppercase mt-0.5">
          Wireless Solutions
        </span>
      </div>
    </div>
  );
};
