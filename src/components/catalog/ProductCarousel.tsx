"use client";

import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/site/icons";

type ProductCarouselProps = {
  /** Nom accessible du carrousel (ex. "Plafonniers LED"). */
  label: string;
  children: ReactNode;
  intervalMs?: number;
  className?: string;
};

/** Marge d'erreur (px) pour détecter le début / la fin du défilement. */
const EDGE_TOLERANCE = 8;

/**
 * Largeur d'une slide selon l'écran. Formule : (100% - espaces) / nb visibles.
 *  - mobile  : 2 cartes + un bout de la 3e (÷ 2.2) → le client voit qu'il peut swiper ;
 *  - tablette : 3 cartes ; desktop : 4 cartes.
 * Les espaces (gap-3 = 0.75rem, gap-4 = 1rem) doivent correspondre au gap du conteneur.
 */
const SLIDE_WIDTH =
  "shrink-0 snap-start w-[calc((100%-0.75rem)/2.15)] md:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/5)]";

/**
 * Carrousel à défilement automatique, basé sur le scroll natif
 * (scroll-snap) : swipe mobile gratuit, pas de librairie.
 *
 * Il reçoit ses slides en children : les ProductCard restent des Server
 * Components, seul ce conteneur est envoyé comme JS au navigateur.
 *
 * L'autoplay se met en pause quand :
 *  - la souris survole ou le clavier est dedans (le client lit / choisit) ;
 *  - le carrousel n'est pas visible à l'écran (inutile de défiler) ;
 *  - l'utilisateur a swipé (il a pris la main, on n'interfère plus) ;
 *  - le système demande de réduire les animations.
 */
export function ProductCarousel({
  label,
  children,
  intervalMs = 4000,
  className = "",
}: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocusInside, setHasFocusInside] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [stoppedByUser, setStoppedByUser] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const slides = Children.toArray(children);

  const scrollOneSlide = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current;
      if (!track) return;

      const firstSlide = track.firstElementChild as HTMLElement | null;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const stepPx = firstSlide
        ? firstSlide.offsetWidth + gap
        : track.clientWidth;
      const maxScroll = track.scrollWidth - track.clientWidth;
      const behavior: ScrollBehavior = prefersReducedMotion ? "auto" : "smooth";

      const atEnd = track.scrollLeft >= maxScroll - EDGE_TOLERANCE;
      const atStart = track.scrollLeft <= EDGE_TOLERANCE;

      // Boucle : après le dernier on revient au premier, et inversement.
      if (direction === 1 && atEnd) track.scrollTo({ left: 0, behavior });
      else if (direction === -1 && atStart)
        track.scrollTo({ left: maxScroll, behavior });
      else track.scrollBy({ left: direction * stepPx, behavior });
    },
    [prefersReducedMotion],
  );

  // Visible à l'écran ?
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.5 },
    );
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const autoplay =
    slides.length > 1 &&
    isInView &&
    !isHovered &&
    !hasFocusInside &&
    !stoppedByUser &&
    !prefersReducedMotion;

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setInterval(() => scrollOneSlide(1), intervalMs);
    return () => window.clearInterval(timer);
  }, [autoplay, intervalMs, scrollOneSlide]);

  return (
    <div
      role="region"
      aria-roledescription="carrousel"
      aria-label={label}
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setHasFocusInside(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget))
          setHasFocusInside(false);
      }}
      onTouchStart={() => setStoppedByUser(true)}
    >
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto md:gap-2"
      >
        {slides.map((slide, index) => (
          <div
            key={isValidElement(slide) && slide.key != null ? slide.key : index}
            role="group"
            aria-roledescription="diapositive"
            aria-label={`${index + 1} sur ${slides.length}`}
            className={SLIDE_WIDTH}
          >
            {slide}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <CarouselArrow direction="prev" onClick={() => scrollOneSlide(-1)} />
          <CarouselArrow direction="next" onClick={() => scrollOneSlide(1)} />
        </>
      )}
    </div>
  );
}

function CarouselArrow({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Produits précédents" : "Produits suivants"}
      className={`absolute top-[38%] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-sm transition-colors hover:border-orange hover:text-orange md:flex ${
        isPrev ? "-left-5" : "-right-5"
      }`}
    >
      {isPrev ? (
        <ChevronLeftIcon className="h-4 w-4" />
      ) : (
        <ChevronRightIcon className="h-4 w-4" />
      )}
    </button>
  );
}
