/**
 * icons.jsx
 * Centralised SVG icon components.
 * All icons accept a `size` prop (default 18) and forward extra props to the <svg>.
 */

const defaultProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const Icon = ({ size = 18, strokeWidth = 2, style, className, children, ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    strokeWidth={strokeWidth}
    style={{ flexShrink: 0, ...style }}
    className={className}
    aria-hidden="true"
    {...defaultProps}
    {...rest}
  >
    {children}
  </svg>
);

export const IconLink = ({ size = 20, className }) => (
  <Icon size={size} className={className}>
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </Icon>
);

export const IconQr = ({ size = 18 }) => (
  <Icon size={size}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="3" height="3" rx="0.5" />
    <rect x="19" y="14" width="2" height="2" rx="0.5" />
    <rect x="14" y="19" width="2" height="2" rx="0.5" />
    <rect x="19" y="19" width="2" height="2" rx="0.5" />
  </Icon>
);

export const IconDownload = ({ size = 18 }) => (
  <Icon size={size} strokeWidth={2.2}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </Icon>
);

export const IconX = ({ size = 16 }) => (
  <Icon size={size} strokeWidth={2.2}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </Icon>
);

export const IconAlert = ({ size = 16 }) => (
  <Icon size={size}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </Icon>
);

export const IconCheck = ({ size = 18 }) => (
  <Icon size={size} strokeWidth={2.5}>
    <polyline points="20 6 9 17 4 12" />
  </Icon>
);

export const IconHeroes = ({ size = 18 }) => (
  <Icon size={size}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </Icon>
);

export const IconSpinner = ({ size = 18 }) => (
  <Icon size={size} strokeWidth={2.5} style={{ animation: 'spin 0.8s linear infinite' }}>
    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.25" />
    <path d="M12 3a9 9 0 019 9" strokeOpacity="1" />
  </Icon>
);

/* ── New feature icons ───────────────────────────────────────────────────── */

export const IconCopy = ({ size = 18 }) => (
  <Icon size={size}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </Icon>
);

export const IconSun = ({ size = 18 }) => (
  <Icon size={size} strokeWidth={2}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1"     x2="12" y2="3" />
    <line x1="12" y1="21"    x2="12" y2="23" />
    <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12"    x2="3" y2="12" />
    <line x1="21" y1="12"   x2="23" y2="12" />
    <line x1="4.22" y1="19.78"  x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22" />
  </Icon>
);

export const IconMoon = ({ size = 18 }) => (
  <Icon size={size}>
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </Icon>
);

export const IconClock = ({ size = 16 }) => (
  <Icon size={size}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </Icon>
);

export const IconTrash = ({ size = 14 }) => (
  <Icon size={size}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </Icon>
);

export const IconExternalLink = ({ size = 16 }) => (
  <Icon size={size}>
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </Icon>
);

/* ── Ghost QR placeholder icon (larger viewBox) ──────────────────────────── */
export const IconPlaceholderQr = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 80 80"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <rect x="5"  y="5"  width="28" height="28" rx="3" strokeOpacity="0.6" />
    <rect x="47" y="5"  width="28" height="28" rx="3" strokeOpacity="0.6" />
    <rect x="5"  y="47" width="28" height="28" rx="3" strokeOpacity="0.6" />
    <rect x="12" y="12" width="14" height="14" rx="2" fillOpacity="0.4" fill="currentColor" strokeWidth="0" />
    <rect x="54" y="12" width="14" height="14" rx="2" fillOpacity="0.4" fill="currentColor" strokeWidth="0" />
    <rect x="12" y="54" width="14" height="14" rx="2" fillOpacity="0.4" fill="currentColor" strokeWidth="0" />
    <rect x="47" y="47" width="7" height="7" rx="1" fillOpacity="0.3" fill="currentColor" strokeWidth="0" />
    <rect x="57" y="47" width="7" height="7" rx="1" fillOpacity="0.3" fill="currentColor" strokeWidth="0" />
    <rect x="47" y="57" width="7" height="7" rx="1" fillOpacity="0.3" fill="currentColor" strokeWidth="0" />
    <rect x="57" y="57" width="7" height="7" rx="1" fillOpacity="0.3" fill="currentColor" strokeWidth="0" />
    <rect x="68" y="47" width="7" height="7" rx="1" fillOpacity="0.3" fill="currentColor" strokeWidth="0" />
    <rect x="47" y="68" width="7" height="7" rx="1" fillOpacity="0.3" fill="currentColor" strokeWidth="0" />
    <rect x="68" y="68" width="7" height="7" rx="1" fillOpacity="0.3" fill="currentColor" strokeWidth="0" />
  </svg>
);
