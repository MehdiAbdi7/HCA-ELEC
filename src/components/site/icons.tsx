import type { ReactNode } from "react";

type IconProps = { className?: string };

/** Base commune des icônes "trait" : même grille 24x24, même épaisseur. */
function StrokeIcon({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const SunIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.5 12h2M19.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </StrokeIcon>
);

export const MoonIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
  </StrokeIcon>
);

export const PhoneIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M4 5c0-.6.4-1 1-1h2.6c.5 0 .9.3 1 .8l.8 3.2c.1.4 0 .8-.3 1.1L7.7 10.5a12 12 0 0 0 5.8 5.8l1.4-1.4c.3-.3.7-.4 1.1-.3l3.2.8c.5.1.8.5.8 1V19c0 .6-.4 1-1 1h-1.5C9.5 20 4 14.5 4 6.5V5Z" />
  </StrokeIcon>
);

export const MenuIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" />
  </StrokeIcon>
);

export const CloseIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </StrokeIcon>
);

export const CartIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L21 8H6.2" />
    <circle cx="9.5" cy="20" r="1.2" />
    <circle cx="17" cy="20" r="1.2" />
  </StrokeIcon>
);

export const CheckIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </StrokeIcon>
);

export const PlusIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M12 5v14M5 12h14" />
  </StrokeIcon>
);

export const MinusIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M5 12h14" />
  </StrokeIcon>
);

export const TrashIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a1.5 1.5 0 0 0 1.5 1.4h7a1.5 1.5 0 0 0 1.5-1.4L18 7M9 7V4.5h6V7" />
  </StrokeIcon>
);

export const SearchIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </StrokeIcon>
);

export const SlidersIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
    <circle cx="15" cy="7" r="2" />
    <circle cx="9" cy="17" r="2" />
  </StrokeIcon>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M15 5l-7 7 7 7" />
  </StrokeIcon>
);

export const ChevronRightIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M9 5l7 7-7 7" />
  </StrokeIcon>
);

export const AlertIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.5v.01" />
  </StrokeIcon>
);

export function WhatsappIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.02 2C6.5 2 2.03 6.47 2.03 12c0 1.9.53 3.68 1.44 5.2L2 22l4.94-1.42A9.94 9.94 0 0 0 12.02 22C17.55 22 22 17.53 22 12S17.55 2 12.02 2Zm5.8 14.2c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.16-4.94-4.35-.14-.19-1.18-1.57-1.18-3s.74-2.13 1-2.42c.26-.29.57-.36.76-.36h.55c.18 0 .42-.07.65.5.24.58.8 2 .87 2.15.07.15.11.32.02.51-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.19.68-.79.86-1.06.18-.27.36-.23.6-.14.24.09 1.53.72 1.79.85.26.13.43.19.5.3.07.11.07.63-.17 1.3Z" />
    </svg>
  );
}

/** Le seul motif fort de la page : l'éclair du logo, utilisé une fois en grand. */
export function BoltShape({ className }: IconProps) {
  return (
    <svg viewBox="0 0 200 320" fill="currentColor" className={className} aria-hidden="true">
      <polygon points="120,0 40,180 95,180 70,320 170,120 105,120" />
    </svg>
  );
}
