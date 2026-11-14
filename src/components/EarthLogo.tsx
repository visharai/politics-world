import React from 'react';

export interface EarthLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showGlow?: boolean;
  interactive?: boolean;
  title?: string;
}

/**
 * Connected Points / Constellation World Network Logo
 * "Point-point jodo to duniya dikhai de"
 * High-tech constellation nodes and vector links forming the recognizable world map.
 */
export const EarthLogo: React.FC<EarthLogoProps> = ({
  size = 'md',
  className = '',
  showGlow = true,
  interactive = true,
  title = 'Politics World · Global Intelligence Network',
}) => {
  const sizeMap = {
    xs: { class: 'w-[22px] h-[22px]' },
    sm: { class: 'w-7 h-7' },
    md: { class: 'w-[34px] h-[34px]' },
    lg: { class: 'w-11 h-11' },
    xl: { class: 'w-14 h-14' },
  };

  const selectedSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full select-none ${selectedSize.class} ${
        interactive ? 'cursor-pointer group' : ''
      } ${className}`}
      title={title}
    >
      {/* Luminous Atmospheric Aura */}
      {showGlow && (
        <div
          className="absolute -inset-1 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(56, 189, 248, 0.2) 60%, transparent 100%)',
            filter: 'blur(2px)',
          }}
        />
      )}

      {/* Sphere Aperture Base */}
      <div
        className="relative w-full h-full rounded-full overflow-hidden border border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.3)] bg-gradient-to-br from-[#06142e] via-[#041a24] to-[#030d1a]"
      >
        {/* Subtle Latitude & Longitude Coordinate Grid */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
        >
          {/* Subtle Equatorial & Meridian Guide Lines */}
          <ellipse cx="50" cy="50" rx="46" ry="14" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2 3" fill="none" />
          <ellipse cx="50" cy="50" rx="16" ry="46" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2 3" fill="none" />
          <line x1="50" y1="4" x2="50" y2="96" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2 3" />
          <line x1="4" y1="50" x2="96" y2="50" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2 3" />
        </svg>

        {/* Constellation Nodes & Connecting Link Vectors (Point-to-Point Connected World Map) */}
        <div className="absolute inset-0 w-full h-full animate-mesh-glow">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="netLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#34d399" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
              </linearGradient>
              <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Trans-Oceanic Global Data Links (Interconnecting the World Continents) */}
            <g stroke="url(#netLineGrad)" strokeWidth="0.4" strokeDasharray="1.5 1.5" opacity="0.4">
              <line x1="36" y1="26" x2="47" y2="28" /> {/* US East to UK/Europe */}
              <line x1="40" y1="62" x2="46" y2="52" /> {/* South America to West Africa */}
              <line x1="58" y1="56" x2="65" y2="46" /> {/* East Africa to India */}
              <line x1="74" y1="52" x2="76" y2="68" /> {/* SE Asia to Australia */}
              <line x1="22" y1="34" x2="82" y2="34" opacity="0.25" /> {/* Trans-Pacific link */}
            </g>

            {/* ================================================================ */}
            {/* CONTINENT 1: NORTH AMERICA (Connected Dots) */}
            {/* ================================================================ */}
            <g stroke="url(#netLineGrad)" strokeWidth="0.85" opacity="0.9">
              {/* Point-to-Point Vectors */}
              <line x1="16" y1="22" x2="24" y2="24" /> {/* Alaska -> Canada West */}
              <line x1="24" y1="24" x2="36" y2="24" /> {/* Canada West -> Canada East */}
              <line x1="16" y1="22" x2="20" y2="34" /> {/* Alaska -> US West */}
              <line x1="20" y1="34" x2="28" y2="35" /> {/* US West -> Midwest */}
              <line x1="28" y1="35" x2="36" y2="34" /> {/* Midwest -> US East */}
              <line x1="36" y1="24" x2="36" y2="34" /> {/* Canada East -> US East */}
              <line x1="20" y1="34" x2="24" y2="44" /> {/* US West -> Mexico */}
              <line x1="28" y1="35" x2="29" y2="43" /> {/* Midwest -> Gulf Coast */}
              <line x1="24" y1="44" x2="29" y2="43" /> {/* Mexico -> Gulf */}
              <line x1="24" y1="44" x2="28" y2="50" /> {/* Mexico -> Central America */}
            </g>

            {/* ================================================================ */}
            {/* CONTINENT 2: SOUTH AMERICA (Connected Dots) */}
            {/* ================================================================ */}
            <g stroke="url(#netLineGrad)" strokeWidth="0.85" opacity="0.9">
              <line x1="28" y1="50" x2="32" y2="56" /> {/* Central America -> Colombia */}
              <line x1="32" y1="56" x2="40" y2="62" /> {/* Colombia -> Brazil East */}
              <line x1="32" y1="56" x2="33" y2="66" /> {/* Colombia -> Amazon */}
              <line x1="33" y1="66" x2="40" y2="62" /> {/* Amazon -> Brazil East */}
              <line x1="33" y1="66" x2="28" y2="70" /> {/* Amazon -> Andes/Chile */}
              <line x1="40" y1="62" x2="34" y2="75" /> {/* Brazil -> Argentina */}
              <line x1="28" y1="70" x2="34" y2="75" /> {/* Andes -> Argentina */}
              <line x1="34" y1="75" x2="31" y2="84" /> {/* Argentina -> Patagonia */}
            </g>

            {/* ================================================================ */}
            {/* CONTINENT 3: EUROPE (Connected Dots) */}
            {/* ================================================================ */}
            <g stroke="url(#netLineGrad)" strokeWidth="0.85" opacity="0.9">
              <line x1="47" y1="26" x2="52" y2="28" /> {/* UK -> France/Germany */}
              <line x1="52" y1="28" x2="55" y2="21" /> {/* Germany -> Scandinavia */}
              <line x1="52" y1="28" x2="59" y2="27" /> {/* Germany -> East Europe */}
              <line x1="52" y1="28" x2="48" y2="34" /> {/* Germany -> Spain/Med */}
              <line x1="48" y1="34" x2="55" y2="35" /> {/* Spain -> Italy/Greece */}
              <line x1="59" y1="27" x2="55" y2="35" /> {/* East Europe -> Greece */}
            </g>

            {/* ================================================================ */}
            {/* CONTINENT 4: AFRICA (Connected Dots) */}
            {/* ================================================================ */}
            <g stroke="url(#netLineGrad)" strokeWidth="0.85" opacity="0.9">
              <line x1="48" y1="41" x2="56" y2="40" /> {/* North Africa -> Egypt */}
              <line x1="48" y1="41" x2="44" y2="50" /> {/* North Africa -> West Africa */}
              <line x1="44" y1="50" x2="52" y2="54" /> {/* West Africa -> Central Africa */}
              <line x1="56" y1="40" x2="58" y2="56" /> {/* Egypt -> East Africa */}
              <line x1="52" y1="54" x2="58" y2="56" /> {/* Central Africa -> East Africa */}
              <line x1="52" y1="54" x2="53" y2="68" /> {/* Central Africa -> South Africa */}
              <line x1="58" y1="56" x2="53" y2="68" /> {/* East Africa -> South Africa */}
            </g>

            {/* ================================================================ */}
            {/* CONTINENT 5: ASIA & MIDDLE EAST (Connected Dots) */}
            {/* ================================================================ */}
            <g stroke="url(#netLineGrad)" strokeWidth="0.85" opacity="0.9">
              <line x1="59" y1="27" x2="68" y2="24" /> {/* Europe -> Siberia */}
              <line x1="68" y1="24" x2="78" y2="26" /> {/* Siberia -> East Russia */}
              <line x1="59" y1="27" x2="63" y2="35" /> {/* Europe -> Central Asia */}
              <line x1="63" y1="35" x2="68" y2="24" /> {/* Central Asia -> Siberia */}
              <line x1="56" y1="40" x2="62" y2="42" /> {/* Egypt -> Middle East */}
              <line x1="62" y1="42" x2="65" y2="47" /> {/* Middle East -> India */}
              <line x1="63" y1="35" x2="65" y2="47" /> {/* Central Asia -> India */}
              <line x1="65" y1="47" x2="72" y2="41" /> {/* India -> China Central */}
              <line x1="72" y1="41" x2="80" y2="35" /> {/* China -> Beijing/East */}
              <line x1="80" y1="35" x2="86" y2="35" /> {/* China -> Japan */}
              <line x1="78" y1="26" x2="86" y2="35" /> {/* Siberia -> Japan */}
              <line x1="65" y1="47" x2="74" y2="52" /> {/* India -> SE Asia */}
              <line x1="72" y1="41" x2="74" y2="52" /> {/* China -> SE Asia */}
            </g>

            {/* ================================================================ */}
            {/* CONTINENT 6: AUSTRALIA & OCEANIA (Connected Dots) */}
            {/* ================================================================ */}
            <g stroke="url(#netLineGrad)" strokeWidth="0.85" opacity="0.9">
              <line x1="75" y1="67" x2="84" y2="68" /> {/* West Australia -> East Australia */}
              <line x1="75" y1="67" x2="78" y2="76" /> {/* West Australia -> South Australia */}
              <line x1="84" y1="68" x2="78" y2="76" /> {/* East Australia -> South Australia */}
              <line x1="84" y1="68" x2="88" y2="78" /> {/* Australia -> New Zealand */}
            </g>

            {/* ================================================================ */}
            {/* LUMINOUS NETWORK NODES / DOTS ("Point-Point Jodo") */}
            {/* ================================================================ */}
            <g fill="#4ade80" filter="url(#nodeGlow)">
              {/* North America Dots */}
              <circle cx="16" cy="22" r="1.4" />
              <circle cx="24" cy="24" r="1.5" />
              <circle cx="36" cy="24" r="1.6" />
              <circle cx="20" cy="34" r="1.7" fill="#67e8f9" />
              <circle cx="28" cy="35" r="1.5" />
              <circle cx="36" cy="34" r="1.8" fill="#fde047" /> {/* Major Hub (New York / DC) */}
              <circle cx="24" cy="44" r="1.5" />
              <circle cx="29" cy="43" r="1.4" />
              <circle cx="28" cy="50" r="1.3" />

              {/* South America Dots */}
              <circle cx="32" cy="56" r="1.5" />
              <circle cx="40" cy="62" r="1.8" fill="#fde047" /> {/* Major Hub (Brasilia / Rio) */}
              <circle cx="33" cy="66" r="1.4" />
              <circle cx="28" cy="70" r="1.3" />
              <circle cx="34" cy="75" r="1.5" />
              <circle cx="31" cy="84" r="1.2" />

              {/* Europe Dots */}
              <circle cx="47" cy="26" r="1.8" fill="#fde047" /> {/* Major Hub (London) */}
              <circle cx="52" cy="28" r="1.8" fill="#67e8f9" /> {/* Major Hub (Berlin / Paris) */}
              <circle cx="55" cy="21" r="1.4" />
              <circle cx="59" cy="27" r="1.5" />
              <circle cx="48" cy="34" r="1.4" />
              <circle cx="55" cy="35" r="1.5" />

              {/* Africa Dots */}
              <circle cx="48" cy="41" r="1.4" />
              <circle cx="56" cy="40" r="1.7" fill="#67e8f9" /> {/* Major Hub (Cairo) */}
              <circle cx="44" cy="50" r="1.5" />
              <circle cx="52" cy="54" r="1.5" />
              <circle cx="58" cy="56" r="1.5" />
              <circle cx="53" cy="68" r="1.7" fill="#fde047" /> {/* Major Hub (Johannesburg) */}

              {/* Asia & India Dots */}
              <circle cx="68" cy="24" r="1.5" />
              <circle cx="78" cy="26" r="1.4" />
              <circle cx="63" cy="35" r="1.4" />
              <circle cx="62" cy="42" r="1.6" /> {/* Middle East / Dubai */}
              <circle cx="65" cy="47" r="2.1" fill="#fde047" /> {/* Prime Hub: New Delhi / India! */}
              <circle cx="72" cy="41" r="1.6" />
              <circle cx="80" cy="35" r="1.9" fill="#67e8f9" /> {/* Beijing */}
              <circle cx="86" cy="35" r="1.8" fill="#fde047" /> {/* Tokyo */}
              <circle cx="74" cy="52" r="1.6" /> {/* Singapore / SE Asia */}

              {/* Australia Dots */}
              <circle cx="75" cy="67" r="1.5" />
              <circle cx="84" cy="68" r="1.8" fill="#fde047" /> {/* Sydney */}
              <circle cx="78" cy="76" r="1.4" />
              <circle cx="88" cy="78" r="1.3" />
            </g>

            {/* Pulsing Signal Beacon on India (New Delhi Bureau) */}
            <circle cx="65" cy="47" r="4.2" stroke="#fde047" strokeWidth="0.6" fill="none" className="animate-ping opacity-75" />
          </svg>
        </div>

        {/* 3D Glass Specular Reflection */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 28% 22%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.08) 35%, transparent 65%)',
          }}
        />

        {/* Inner Luminous Rim Highlight */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 5px rgba(52, 211, 153, 0.8), inset 0 0 1.5px rgba(255, 255, 255, 0.7)',
          }}
        />
      </div>

      {/* Embedded CSS for Network Mesh Glow & Subtle Rotation */}
      <style>{`
        @keyframes meshPulse {
          0%, 100% {
            opacity: 0.92;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
          }
        }
        .animate-mesh-glow {
          animation: meshPulse 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EarthLogo;
