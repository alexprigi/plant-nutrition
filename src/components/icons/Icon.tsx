'use client';

import React from 'react';
import './icon-animations.css';

export type IconName =
  | 'heart' | 'sparkles' | 'leaf' | 'laptop' | 'apple' | 'book' | 'route'
  | 'heartNature' | 'gift' | 'sprout' | 'helpCircle' | 'coin' | 'users'
  | 'activity' | 'calendar' | 'chart' | 'document' | 'star'
  | 'appleWorld' | 'bodyWorld' | 'clock' | 'alert' | 'share' | 'lotus'
  | 'heartMom' | 'certificate' | 'baby' | 'carrot' | 'medal' | 'speech' | 'puzzle' | 'gradCap'
  | 'pregnant' | 'pawHeart' | 'userSingle' | 'dna'
  | 'mail' | 'phone' | 'mapPin' | 'chat' | 'check' | 'tag'
  | 'numberOne' | 'numberTwo' | 'numberThree' | 'numberFour';

interface IconProps {
  name: IconName;
  size?: number;
  boxSize?: number;
  animated?: boolean;
  style?: React.CSSProperties;
  className?: string;
  shape?: 'square' | 'circle';
  variant?: 'mint' | 'blue' | 'peach' | 'pink' | 'lavender' | 'lemon';
}

const getDefaultTheme = (name: IconName): string => {
  switch (name) {
    // --- VERDE MENTA ---
    case 'leaf': case 'sprout': case 'apple': case 'appleWorld':
    case 'heartNature': case 'alert': case 'share':
    case 'certificate': case 'medal':
    case 'mail': case 'mapPin': case 'chat': case 'check':
    case 'numberOne':
      return 'icon-bg-mint';

    // --- AZZURRO ---
    case 'laptop': case 'chart': case 'document': case 'book':
    case 'calendar': case 'helpCircle': case 'users': case 'bodyWorld':
    case 'speech': case 'userSingle': case 'phone':
    case 'numberTwo':
      return 'icon-bg-blue';

    // --- PESCA ---
    case 'route': case 'carrot': case 'pawHeart':
    case 'numberThree':
      return 'icon-bg-peach';

    // --- ROSA ---
    case 'heart': case 'gift': case 'clock': case 'lotus':
    case 'baby': case 'pregnant': case 'heartMom': case 'tag':
      return 'icon-bg-pink';

    // --- LAVANDA ---
    case 'activity': case 'puzzle': case 'dna':
    case 'numberFour':
      return 'icon-bg-lavender';

    // --- LEMON ---
    case 'star': case 'sparkles': case 'coin': case 'gradCap':
      return 'icon-bg-lemon';

    default: return 'icon-bg-mint';
  }
};

const Icon: React.FC<IconProps> = ({
  name, size = 28, boxSize, animated = false, style = {}, className = '', shape = 'square', variant
}) => {
  let themeClass = getDefaultTheme(name);
  if (variant) themeClass = `icon-bg-${variant}`;

  const shapeClass = shape === 'circle' ? 'icon-circle' : '';
  const animClass = animated ? 'icon-animated' : '';
  const containerClass = `icon-container ${themeClass} ${shapeClass} ${animClass} ${className}`;

  // 1. CALCOLO DIMENSIONE SCATOLA
  const multiplier = size >= 32 ? 1.4 : 1.6;
  const finalBoxSize = boxSize || Math.round(size * multiplier);

  // 2. ARROTONDATURA DINAMICA
  const dynamicRadius = shape === 'circle' ? '50%' : `${Math.round(finalBoxSize * 0.22)}px`;

  const containerStyle: React.CSSProperties = {
    width: `${finalBoxSize}px`,
    height: `${finalBoxSize}px`,
    minWidth: `${finalBoxSize}px`,
    minHeight: `${finalBoxSize}px`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    borderRadius: dynamicRadius,
    flexShrink: 0,
    ...style
  };

  const svgProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };

  const renderSvgPath = () => {
    switch (name) {

      // --- NUMERI RIDISEGNATI (Stile Arrotondato e Uniforme) ---

      case 'numberOne':
        return (
          <g strokeWidth="2.5">
            <path d="M12 5v14" />
            <path d="M8 9l4-4" /> {/* Serif classica diagonale */}
          </g>
        );

      case 'numberTwo':
        return (
          <g strokeWidth="2.5">
            {/* Base allargata e arco superiore più alto per compensare la dimensione visiva */}
            <path d="M7 20h10" />
            <path d="M17 20c0-1.67-1.3-3.6-2.5-5L8 7a4 4 0 0 1 8 0" opacity="0" /> {/* Guida invisibile */}
            <path d="M7 8.5c0-3 2.5-4.5 5-4.5s5 1.5 5 4.5c0 3-8 9-10 11.5" />
          </g>
        );
      // CORREZIONE NUMERO 2 per renderlo più semplice e grande:
      case 'numberTwo':
        return (
          <g strokeWidth="2.5">
            <path d="M8 7c0-2.5 2-3 5-3s5 1 5 3.5c0 2.5-9 8.5-9 11.5h10" />
          </g>
        );

      case 'numberThree':
        return (
          // Stile a "due curve" (B rovesciata), molto classico e leggibile
          <g strokeWidth="2.5">
            <path d="M8 6.5c0-2 2-2.5 4-2.5s4 1 4 3c0 2-2 2.5-3 2.5" />
            <path d="M13 9.5c1.5 0 4 1 4 4s-2.5 4.5-5 4.5c-2.5 0-4-1.5-4.5-2.5" />
          </g>
        );

      case 'numberFour':
        return (
          <g strokeWidth="2.5">
            <path d="M16 5v14" /> {/* Asta verticale lunga */}
            <path d="M14 5L6 14h11" /> {/* Diagonale + Traversa */}
          </g>
        );

      // --- ALTRE ICONE ---
      case 'tag':
        return (
          <g strokeWidth="2.5">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </g>
        );
      case 'check': return <polyline points="20 6 9 17 4 12" />;
      case 'chat': return <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
      case 'mail': return <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>;
      case 'phone': return <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />;
      case 'mapPin': return <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>;
      case 'userSingle': return <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>;
      case 'dna': return <><path d="M2 15c6.667-6 13.333 0 20-6" /><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" /><path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" /><path d="M17 12a19 19 0 0 0-10 0" /></>;
      case 'pawHeart': return <><circle cx="7" cy="9" r="2" /><circle cx="17" cy="9" r="2" /><circle cx="12" cy="6" r="2" /><path d="M12 12c-3 0-5 2-5 4.5S9 21 12 21s5-2 5-4.5-2-4.5-5-4.5z" /></>;
      case 'pregnant': return <><circle cx="10" cy="5" r="3" /><path d="M10 8 L10 22" /><path d="M10 10 Q 18 14 15 21" /><path d="M10 12 Q 15 15 14 19" /></>;
      case 'heartMom': return <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /><path d="M15 11a2.5 2.5 0 0 0-4 0l-.5.5-.5-.5a2.5 2.5 0 0 0-4 0l.5.5 4 4 4-4 .5-.5z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" /></>;
      case 'baby': return <><circle cx="12" cy="9" r="5" /><path d="M12 14v7" /><path d="M8 17h8" /><path d="M10 9h.01" /><path d="M14 9h.01" /><path d="M12 11a1 1 0 0 0 0 .5" /></>;
      case 'certificate': return <><rect x="3" y="2" width="18" height="20" rx="2" /><path d="M7 6h10" /><path d="M7 10h10" /><path d="M7 14h6" /><circle cx="16" cy="17" r="3" /><path d="M16 17l1.5 1.5-1.5 1.5-1.5-1.5z" fill="currentColor" fillOpacity="0.2" stroke="none" /></>;
      case 'carrot': return <><path d="M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.83 2.27 21.7 2.27 21.7z" /><path d="M8.6 9c3.39-1.83 6.64-1.2 9.07 1.23" /><path d="M22 2c-4 2-5 6-2 9" /><path d="M16 8c2-4 6-5 6-6" /></>;
      case 'medal': return <><circle cx="12" cy="15" r="5" /><path d="M12 12l1 2 2 .5-1.5 1.5.5 2-2-1-2 1 .5-2L9 14.5l2-.5z" /><path d="M8.21 13.89L7 4V2h10v2l-1.21 9.89" /></>;
      case 'speech': return <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /><path d="M8 11h8" /><path d="M8 15h4" /></>;
      case 'puzzle': return <path d="M19.439 15.439a4.5 4.5 0 0 0-6.364-6.364 4.5 4.5 0 0 0-6.364 6.364 4.5 4.5 0 0 0 6.364-6.364zM10.5 7a2.5 2.5 0 1 1 2.5 2.5M7 10.5a2.5 2.5 0 1 1 2.5 2.5" />;
      case 'gradCap': return <><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>;
      case 'lotus': return <><path d="M12 2.5s-4 5-4 11c0 3.5 4 7.5 4 7.5s4-4 4-7.5c0-6-4-11-4-11z" /><path d="M12 21c-4.5 0-8-4-8-9 0-3.5 2.5-6.5 5.5-7.5" opacity="0.8" /><path d="M12 21c4.5 0 8-4 8-9 0-3.5-2.5-6.5-5.5-7.5" opacity="0.8" /><path d="M12 21v-2" /></>;
      case 'book': return <><rect x="5" y="3" width="14" height="18" rx="2" ry="2" /><rect x="9" y="7" width="6" height="4" rx="0.5" /><line x1="8" y1="15" x2="16" y2="15" /></>;
      case 'share': return <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>;
      case 'helpCircle': return <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></>;
      case 'alert': return <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>;
      case 'appleWorld': return <><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" /><path d="M10 2c1 .5 2 2 2 5" /><path d="M4.5 12c2 1 6 2 7.5 2s5.5-1 7.5-2" opacity="0.6" /><path d="M12 5c-2 3-3 8-3 12" opacity="0.6" /><path d="M12 5c2 3 3 8 3 12" opacity="0.6" /></>;
      case 'bodyWorld': return <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="8" r="2.5" /><path d="M12 10.5v8" /><path d="M8 13l4-2.5 4 2.5" /><path d="M9 20l3-4 3 4" /></>;
      case 'laptop': return <><path d="M20 15V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9" /><path d="M2 16h20a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z" /></>;
      case 'sprout': return <g transform="translate(3, 3) scale(0.75)"><path d="M2 22h20" /><path d="M12 22v-10" /><path d="M12 12c0-4 4-6 6-6s4 2 4 6" /><path d="M12 12c0-4-4-6-6-6s-4 2-4 6" /></g>;
      case 'clock': return <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>;
      case 'apple': return <><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" /><path d="M10 2c1 .5 2 2 2 5" /></>;
      case 'sparkles': return <><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" /><path d="M19 12l.75 2.25L22 15l-2.25.75L19 18l-.75-2.25L16 15l2.25-.75L19 12z" /><path d="M6 20l.75 2.25L9 23l-2.25.75L6 26l-.75-2.25L3 23l2.25-.75L6 20z" /></>;
      case 'star': return <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />;
      case 'leaf': return <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />;
      case 'heart': return <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />;
      case 'activity': return <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />;
      case 'route': return <><circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" /><circle cx="18" cy="5" r="3" /></>;
      case 'calendar': return <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>;
      case 'users': return <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>;
      case 'coin': return <><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><line x1="12" y1="18" x2="12" y2="20" /><line x1="12" y1="4" x2="12" y2="6" /></>;
      case 'document': return <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>;
      case 'chart': return <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>;
      case 'gift': return <><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></>;
      case 'heartNature': return <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /><path d="M12 5 9.04 11" opacity="0.5" /><path d="M12 5l2.96 6" opacity="0.5" /></>;

      default: return <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>;
    }
  };

  return (
    <span className={containerClass} style={containerStyle}>
      <svg {...svgProps}>
        {renderSvgPath()}
      </svg>
    </span>
  );
};

export default Icon;