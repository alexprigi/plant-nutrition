'use client';

import React from 'react';
import './icon-animations.css';

export type IconName =
  | 'heart' | 'sparkles' | 'leaf' | 'laptop' | 'apple' | 'book' | 'route'
  | 'heartNature' | 'gift' | 'sprout' | 'helpCircle' | 'coin' | 'users'
  | 'activity' | 'calendar' | 'chart' | 'document' | 'star'
  | 'appleWorld' | 'bodyWorld' | 'clock' | 'alert' | 'share'
  | 'lotus'; // <--- AGGIUNTA

// ... interfaccia props ...

const getDefaultTheme = (name: IconName): string => {
  switch (name) {
    // ROSA (Cuore, Filosofia, Emozioni)
    case 'heart':
    case 'gift':
    case 'clock':
    case 'lotus': // <--- Il Loto è Rosa di default (Filosofia)
      return 'icon-bg-pink';

    // ... (tutti gli altri case restano uguali)
    case 'leaf':
    case 'sprout':
    case 'apple':
    case 'appleWorld':
    case 'heartNature':
    case 'alert':
    case 'share':
      return 'icon-bg-mint';

    case 'laptop':
    case 'chart':
    case 'document':
    case 'book':
    case 'calendar':
    case 'helpCircle':
    case 'users':
    case 'bodyWorld':
      return 'icon-bg-blue';

    case 'route':
      return 'icon-bg-peach';

    case 'activity':
      return 'icon-bg-lavender';

    case 'star':
    case 'sparkles':
    case 'coin':
      return 'icon-bg-lemon';

    default:
      return 'icon-bg-mint';
  }
};

const Icon: React.FC<IconProps> = ({
  // ... props uguali ...
  name, size = 28, animated = false, style = {}, className = '', shape = 'square', variant
}) => {
  // ... logica tema uguale ...
  let themeClass = getDefaultTheme(name);
  if (variant) themeClass = `icon-bg-${variant}`;

  const shapeClass = shape === 'circle' ? 'icon-circle' : '';
  const animClass = animated ? 'icon-animated' : '';
  const containerClass = `icon-container ${themeClass} ${shapeClass} ${animClass} ${className}`;

  const svgProps = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" as const, strokeLinejoin: "round" as const
  };

  const renderSvgPath = () => {
    switch (name) {

      // --- NUOVA ICONA LOTUS (Filosofia) ---
      case 'lotus':
        return (
          <>
            {/* Petalo Centrale */}
            <path d="M12 2.5s-4 5-4 11c0 3.5 4 7.5 4 7.5s4-4 4-7.5c0-6-4-11-4-11z" />
            {/* Petali Laterali (stilizzati) */}
            <path d="M12 21c-4.5 0-8-4-8-9 0-3.5 2.5-6.5 5.5-7.5" opacity="0.8" />
            <path d="M12 21c4.5 0 8-4 8-9 0-3.5-2.5-6.5-5.5-7.5" opacity="0.8" />
            {/* Base */}
            <path d="M12 21v-2" />
          </>
        );

      // ... TUTTI GLI ALTRI CASE RESTANO UGUALI ...

      case 'share': return <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>;
      case 'alert': return <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>;
      case 'helpCircle': return <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></>;
      case 'appleWorld': return <><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" /><path d="M10 2c1 .5 2 2 2 5" /><path d="M4.5 12c2 1 6 2 7.5 2s5.5-1 7.5-2" opacity="0.6" /><path d="M12 5c-2 3-3 8-3 12" opacity="0.6" /><path d="M12 5c2 3 3 8 3 12" opacity="0.6" /></>;
      case 'bodyWorld': return <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="8" r="2.5" /><path d="M12 10.5v8" /><path d="M8 13l4-2.5 4 2.5" /><path d="M9 20l3-4 3 4" /></>;
      case 'clock': return <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>;
      case 'sprout': return <g transform="translate(3, 3) scale(0.75)"><path d="M2 22h20" /><path d="M12 22v-10" /><path d="M12 12c0-4 4-6 6-6s4 2 4 6" /><path d="M12 12c0-4-4-6-6-6s-4 2-4 6" /></g>;
      case 'laptop': return <><path d="M20 15V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9" /><path d="M2 16h20a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z" /></>;
      case 'apple': return <><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" /><path d="M10 2c1 .5 2 2 2 5" /></>;
      case 'sparkles': return <><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" /><path d="M19 12l.75 2.25L22 15l-2.25.75L19 18l-.75-2.25L16 15l2.25-.75L19 12z" /><path d="M6 20l.75 2.25L9 23l-2.25.75L6 26l-.75-2.25L3 23l2.25-.75L6 20z" /></>;
      case 'star': return <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />;
      case 'leaf': return <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />;
      case 'heart': return <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />;
      case 'activity': return <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />;
      case 'route': return <><circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" /><circle cx="18" cy="5" r="3" /></>;
      case 'book': return <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />;
      case 'calendar': return <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>;
      case 'users': return <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>;
      case 'coin': return <><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><line x1="12" y1="18" x2="12" y2="20" /><line x1="12" y1="4" x2="12" y2="6" /></>;
      case 'document': return <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>;
      case 'chart': return <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>;
      case 'gift': return <><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></>;
      case 'heartNature': return <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /><path d="M12 5 9.04 11" opacity="0.5" /><path d="M12 5l2.96 6" opacity="0.5" /></>;

      default:
        // Default circle
        return <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>;
    }
  };

  return (
    <span className={containerClass} style={style}>
      <svg {...svgProps}>
        {renderSvgPath()}
      </svg>
    </span>
  );
};

export default Icon;