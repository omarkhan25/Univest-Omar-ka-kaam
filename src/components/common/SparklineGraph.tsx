import React, { useId } from 'react';

interface SparklineGraphProps {
  isPositive: boolean;
  width?: number;
  height?: number;
  className?: string;
  points?: number[];
}

export const SparklineGraph: React.FC<SparklineGraphProps> = ({
  isPositive,
  width = 52,
  height = 24,
  className = '',
  points
}) => {
  const reactId = useId().replace(/:/g, '');
  const strokeColor = isPositive ? '#16A34A' : '#DC2626';
  const gradientId = `sparkline-grad-${reactId}`;

  // Custom or default smooth paths
  let pathD = '';
  let fillD = '';
  let endCx = 48;
  let endCy = 3;

  if (points && points.length >= 2) {
    // Dynamically calculate bezier curve from data points array
    const minVal = Math.min(...points);
    const maxVal = Math.max(...points);
    const range = (maxVal - minVal) || 1;
    
    // Scale points into 48x16 box inside (viewBox 0 0 50 22)
    const scaled = points.map((val, idx) => {
      const x = 2 + (idx / (points.length - 1)) * 46;
      const y = 18 - ((val - minVal) / range) * 14;
      return { x, y };
    });

    endCx = scaled[scaled.length - 1].x;
    endCy = scaled[scaled.length - 1].y;

    // Construct SVG smooth path
    pathD = `M ${scaled[0].x} ${scaled[0].y}`;
    for (let i = 0; i < scaled.length - 1; i++) {
      const curr = scaled[i];
      const next = scaled[i + 1];
      const cpx = (curr.x + next.x) / 2;
      pathD += ` C ${cpx} ${curr.y}, ${cpx} ${next.y}, ${next.x} ${next.y}`;
    }

    fillD = `${pathD} L ${scaled[scaled.length - 1].x} 21 L ${scaled[0].x} 21 Z`;
  } else {
    // Default handcrafted smooth curves
    if (isPositive) {
      pathD = "M 2 17 C 12 14, 24 15, 36 7 C 42 4, 46 3, 48 3";
      fillD = "M 2 17 C 12 14, 24 15, 36 7 C 42 4, 46 3, 48 3 L 48 21 L 2 21 Z";
      endCx = 48;
      endCy = 3;
    } else {
      pathD = "M 2 3 C 12 6, 24 5, 36 13 C 42 16, 46 17, 48 18";
      fillD = "M 2 3 C 12 6, 24 5, 36 13 C 42 16, 46 17, 48 18 L 48 21 L 2 21 Z";
      endCx = 48;
      endCy = 18;
    }
  }

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 50 22" 
      className={`overflow-visible shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={isPositive ? 0.38 : 0.32} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
        </linearGradient>
      </defs>

      {/* Gradient Area Shadow Below Line */}
      <path d={fillD} fill={`url(#${gradientId})`} />

      {/* Smooth Curved Line */}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Pulsing End Glow Circle Dot */}
      <circle cx={endCx} cy={endCy} r="2.2" fill={strokeColor} />
    </svg>
  );
};

export default SparklineGraph;
