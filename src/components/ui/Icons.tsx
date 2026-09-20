// Inline SVG icon components (UI chrome icons + decorative service icons).

// UI Icons
export const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
)

export const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)

export const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
)

export const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
)

export const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
)

// Service Icons for Booking Modal + service cards
export const EuKontrollIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="12" y="8" width="40" height="48" rx="4" />
    <path d="M20 20 L44 20" />
    <path d="M20 28 L44 28" />
    <path d="M20 36 L36 36" />
    <circle cx="32" cy="48" r="4" />
  </svg>
)

export const BremserIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="8" y="20" width="12" height="24" rx="2" />
    <rect x="44" y="20" width="12" height="24" rx="2" />
    <path d="M20 28 L44 28" />
    <path d="M20 36 L44 36" />
    <circle cx="32" cy="32" r="4" />
  </svg>
)

export const HjulskiftIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="32" cy="32" r="20" />
    <circle cx="32" cy="32" r="12" />
    <circle cx="32" cy="32" r="4" />
    <line x1="32" y1="20" x2="32" y2="12" />
    <line x1="32" y1="44" x2="32" y2="52" />
    <line x1="20" y1="32" x2="12" y2="32" />
    <line x1="44" y1="32" x2="52" y2="32" />
  </svg>
)

export const AcServiceIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="12" y="16" width="40" height="32" rx="4" />
    <path d="M20 32 L28 24 L36 40 L44 32" />
    <circle cx="20" cy="24" r="2" fill="currentColor" />
    <circle cx="44" cy="24" r="2" fill="currentColor" />
  </svg>
)

export const RuteskiftIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 20 L16 48 L48 48 L56 20 Z" />
    <path d="M12 24 L18 44 L46 44 L52 24 Z" />
    <path d="M24 32 L40 32" />
    <path d="M32 28 L32 36" />
  </svg>
)

export const HvBatteriIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="8" y="20" width="48" height="24" rx="4" />
    <rect x="56" y="28" width="4" height="8" />
    <rect x="14" y="26" width="8" height="12" fill="currentColor" opacity="0.3" />
    <rect x="26" y="26" width="8" height="12" fill="currentColor" opacity="0.3" />
    <rect x="38" y="26" width="8" height="12" fill="currentColor" opacity="0.5" />
    <path d="M32 50 L28 56 L34 56 L30 62" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const SohAvlesingIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="8" y="12" width="48" height="40" rx="4" />
    <rect x="14" y="18" width="36" height="20" rx="2" />
    <path d="M20 26 L28 26" />
    <path d="M20 30 L36 30" />
    <path d="M20 34 L32 34" />
    <circle cx="32" cy="48" r="3" />
  </svg>
)

export const HentingIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 40 L6 26 L30 26 L30 40" />
    <path d="M30 30 L44 30 L52 38 L52 40" />
    <path d="M6 40 L52 40" />
    <circle cx="18" cy="44" r="5" />
    <circle cx="44" cy="44" r="5" />
    <path d="M36 16 L46 16 M46 16 L42 12 M46 16 L42 20" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const BilvaskIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 44 L14 34 L20 24 L44 24 L50 34 L50 44" />
    <path d="M14 44 L50 44" />
    <circle cx="22" cy="44" r="4" />
    <circle cx="42" cy="44" r="4" />
    <path d="M20 14 C20 10 24 8 24 6 C24 8 28 10 28 14 C28 16.2 26.2 18 24 18 C21.8 18 20 16.2 20 14 Z" />
    <path d="M40 16 C40 13 43 11 43 9 C43 11 46 13 46 16 C46 17.7 44.7 19 43 19 C41.3 19 40 17.7 40 16 Z" />
  </svg>
)

export const HoyvoltIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="10" y="18" width="44" height="28" rx="4" />
    <path d="M34 22 L24 34 L32 34 L28 42 L40 30 L32 30 Z" strokeLinejoin="round" />
    <path d="M18 12 L18 18" strokeLinecap="round" />
    <path d="M46 12 L46 18" strokeLinecap="round" />
  </svg>
)

export const TilstandskontrollIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="14" y="10" width="36" height="44" rx="4" />
    <rect x="25" y="6" width="14" height="8" rx="2" />
    <path d="M22 26 L26 30 L34 22" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M38 26 L44 26" strokeLinecap="round" />
    <path d="M22 40 L26 44 L34 36" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M38 40 L44 40" strokeLinecap="round" />
  </svg>
)

export const MobilitetIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M32 6 L52 14 L52 30 C52 43 42 52 32 58 C22 52 12 43 12 30 L12 14 Z" strokeLinejoin="round" />
    <path d="M23 31 L29 37 L42 24" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const AnnetIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="20" cy="20" r="6" />
    <circle cx="44" cy="20" r="6" />
    <circle cx="20" cy="44" r="6" />
    <rect x="38" y="38" width="12" height="12" rx="2" />
    <path d="M26 20 L38 20" />
    <path d="M20 26 L20 38" />
  </svg>
)
