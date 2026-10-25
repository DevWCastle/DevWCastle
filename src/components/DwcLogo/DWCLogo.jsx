import React from 'react';

export default function DWCLogo({ className = "hero-logo-svg" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 500 420" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cyanBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#0055ff" />
        </linearGradient>
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Hexágono Superior Esquerdo */}
      <g stroke="url(#cyanBlueGrad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#neonGlow)">
        <polygon points="175,20 220,46 220,98 175,124 130,98 130,46" fill="none" />
        <path d="M145 60 L195 32 M160 80 L210 52 M150 102 L190 78" strokeWidth="2.5" />
        <circle cx="145" cy="60" r="3.5" fill="#00f0ff" />
        <circle cx="195" cy="32" r="3.5" fill="#00f0ff" />
        <circle cx="160" cy="80" r="3.5" fill="#00f0ff" />
        <circle cx="210" cy="52" r="3.5" fill="#00f0ff" />
      </g>

      {/* Hexágono Superior Direito */}
      <g stroke="url(#cyanBlueGrad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#neonGlow)">
        <polygon points="325,20 370,46 370,98 325,124 280,98 280,46" fill="none" />
        <path d="M305 60 L355 32 M290 80 L340 52 M310 102 L350 78" strokeWidth="2.5" />
        <circle cx="305" cy="60" r="3.5" fill="#00f0ff" />
        <circle cx="355" cy="32" r="3.5" fill="#00f0ff" />
        <circle cx="290" cy="80" r="3.5" fill="#00f0ff" />
        <circle cx="340" cy="52" r="3.5" fill="#00f0ff" />
      </g>

      {/* Texto DWC Central */}
      <text 
        x="250" 
        y="225" 
        textAnchor="middle" 
        dominantBaseline="middle" 
        fill="url(#cyanBlueGrad)" 
        fontSize="85" 
        fontWeight="800" 
        fontFamily="system-ui, -apple-system, sans-serif" 
        letterSpacing="12"
        style={{ filter: 'drop-shadow(0 0 12px rgba(0, 240, 255, 0.6))' }}
      >
        DWC
      </text>

      {/* Hexágono Inferior Esquerdo */}
      <g stroke="url(#cyanBlueGrad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#neonGlow)">
        <polygon points="175,286 220,312 220,364 175,390 130,364 130,312" fill="none" />
        <path d="M145 326 L195 298 M160 346 L210 318 M150 368 L190 344" strokeWidth="2.5" />
        <circle cx="145" cy="326" r="3.5" fill="#00f0ff" />
        <circle cx="195" cy="298" r="3.5" fill="#00f0ff" />
        <circle cx="160" cy="346" r="3.5" fill="#00f0ff" />
        <circle cx="210" cy="318" r="3.5" fill="#00f0ff" />
      </g>

      {/* Hexágono Inferior Direito */}
      <g stroke="url(#cyanBlueGrad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#neonGlow)">
        <polygon points="325,286 370,312 370,364 325,390 280,364 280,312" fill="none" />
        <path d="M305 326 L355 298 M290 346 L340 318 M310 368 L350 344" strokeWidth="2.5" />
        <circle cx="305" cy="326" r="3.5" fill="#00f0ff" />
        <circle cx="355" cy="298" r="3.5" fill="#00f0ff" />
        <circle cx="290" cy="346" r="3.5" fill="#00f0ff" />
        <circle cx="340" cy="318" r="3.5" fill="#00f0ff" />
      </g>
    </svg>
  );
}