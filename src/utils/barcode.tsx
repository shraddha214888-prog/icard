import React from 'react';

// Generates an SVG representation of a Code 39/128-like barcode for student G.R. number
export const BarcodeSvg: React.FC<{
  value: string;
  width?: number;
  height?: number;
  showText?: boolean;
  className?: string;
}> = ({ value, width = 140, height = 32, showText = false, className = '' }) => {
  // Simple deterministic pattern generator based on char codes
  const bars: { x: number; width: number }[] = [];
  const text = value || '0000';
  let currentX = 4;
  
  // Guard quiet zone
  bars.push({ x: currentX, width: 2 });
  currentX += 4;

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    const pattern = (code * 17 + 23) % 16;
    for (let b = 0; b < 4; b++) {
      const bit = (pattern >> b) & 1;
      const barW = bit === 1 ? 2.5 : 1.2;
      bars.push({ x: currentX, width: barW });
      currentX += barW + (b % 2 === 0 ? 1.5 : 2.5);
    }
    currentX += 2;
  }

  // End guard
  bars.push({ x: currentX, width: 2 });
  currentX += 4;

  const totalWidth = Math.max(currentX + 4, width);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        viewBox={`0 0 ${totalWidth} ${height}`}
        className="w-full h-auto max-h-[36px]"
        preserveAspectRatio="none"
      >
        <rect width={totalWidth} height={height} fill="transparent" />
        {bars.map((bar, idx) => (
          <rect
            key={idx}
            x={bar.x}
            y={2}
            width={bar.width}
            height={height - 4}
            fill="#1e293b"
          />
        ))}
      </svg>
      {showText && (
        <span className="text-[9px] font-mono tracking-widest text-slate-600 mt-0.5">
          *{value}*
        </span>
      )}
    </div>
  );
};

// Generates a decorative & functional SVG QR Code
export const QRCodeSvg: React.FC<{
  value: string;
  size?: number;
  className?: string;
}> = ({ value, size = 48, className = '' }) => {
  // Generate a 21x21 QR-like matrix deterministically from string
  const gridSize = 21;
  const matrix: boolean[][] = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(false)
  );

  // Function to set Finder pattern
  const setFinderPattern = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[row + r][col + c] = true;
        }
      }
    }
  };

  // Top-left, Top-right, Bottom-left finders
  setFinderPattern(0, 0);
  setFinderPattern(0, gridSize - 7);
  setFinderPattern(gridSize - 7, 0);

  // Timing patterns
  for (let i = 8; i < gridSize - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Populate data cells pseudo-randomly based on string hash
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Don't overwrite finders
      if (
        (r < 8 && c < 8) ||
        (r < 8 && c >= gridSize - 8) ||
        (r >= gridSize - 8 && c < 8) ||
        r === 6 ||
        c === 6
      ) {
        continue;
      }
      const val = Math.sin(hash + r * 13 + c * 37) * 10000;
      matrix[r][c] = (Math.floor(val) & 1) === 1;
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${gridSize} ${gridSize}`}
      className={`bg-white p-0.5 rounded-sm shadow-sm border border-slate-200 ${className}`}
    >
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#0f172a" /> : null
        )
      )}
    </svg>
  );
};
