import { formatPrice } from "@/lib/format";

type PriceTagProps = {
  price: number;
  oldPrice?: number;
  size?: "md" | "lg";
  className?: string;
};

export function PriceTag({ price, oldPrice, size = "md", className = "" }: PriceTagProps) {
  const hasDiscount = oldPrice !== undefined && oldPrice > price;
  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 ${className}`}>
      {hasDiscount && (
        <span className={`text-ink-soft line-through ${size === "lg" ? "text-sm" : "text-xs"}`}>
          <span className="sr-only">Au lieu de </span>
          {formatPrice(oldPrice)}
        </span>
      )}
      <span className={`font-display font-semibold text-orange-ink ${size === "lg" ? "text-3xl" : "text-base"}`}>
        {formatPrice(price)}
      </span>
    </p>
  );
}

export function DiscountBadge({ percent, className = "" }: { percent: number | null; className?: string }) {
  if (!percent) return null;
  return (
    <span className={`bg-orange px-2 py-0.5 text-xs font-semibold text-white ${className}`}>−{percent}%</span>
  );
}
