import React from 'react';

// Official-style Gujarat Education / Saraswati Lamp / School Emblem
export const SchoolEmblem: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 40,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`shrink-0 drop-shadow-sm ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="3" />
      <circle cx="50" cy="50" r="44" fill="#1E3A8A" />
      
      {/* Decorative Golden Rays / Sun */}
      <circle cx="50" cy="38" r="16" fill="#FBBF24" opacity="0.3" />
      
      {/* Book (વિદ્યા પુસ્તક) */}
      <path
        d="M26 62C34 58 46 58 50 63C54 58 66 58 74 62V46C66 42 54 42 50 47C46 42 34 42 26 46V62Z"
        fill="#FFFFFF"
      />
      <path
        d="M50 47V63"
        stroke="#1E3A8A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Gyan Deep (દિપક / જ્યોત) */}
      <path
        d="M48 30C48 25 50 20 50 20C50 20 52 25 52 30C53 32 51.5 34 50 34C48.5 34 47 32 48 30Z"
        fill="#EF4444"
      />
      <path
        d="M49 28C49 25 50 22 50 22C50 22 51 25 51 28C51.5 29 50.8 30 50 30C49.2 30 48.5 29 49 28Z"
        fill="#FDE047"
      />
      <ellipse cx="50" cy="36" rx="6" ry="2.5" fill="#F59E0B" />
      
      {/* School motto arch text curve banner */}
      <path
        d="M20 74C30 81 70 81 80 74"
        stroke="#F59E0B"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* 3 Stars */}
      <circle cx="50" cy="80" r="2" fill="#F59E0B" />
      <circle cx="36" cy="78" r="1.5" fill="#F59E0B" />
      <circle cx="64" cy="78" r="1.5" fill="#F59E0B" />
    </svg>
  );
};

// Gujarat Government Stamp / Emblem Mark
export const GujaratGovBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
      <span>UDISE: 24170307402</span>
    </div>
  );
};
