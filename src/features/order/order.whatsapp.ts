import { SITE } from "@/config/site";
import { DELIVERY_MODE_LABELS, formatWilaya, getWilaya } from "@/config/delivery";
import { formatPrice } from "@/lib/format";
import type { Order } from "./order.schema";
import { getOrderSummary } from "./order.pricing";

/**
 * Le site est un export statique (pas de backend) : la commande est
 * transmise au magasin par un message WhatsApp pré-rempli.
 * Si un backend arrive un jour, seul ce fichier est remplacé par un POST.
 */
export function buildOrderMessage(order: Order): string {
  const { lines, subtotal, deliveryFee, total } = getOrderSummary(order);

  const receptionLines =
    order.deliveryMode === "pickup"
      ? [`Réception : ${DELIVERY_MODE_LABELS.pickup} (${SITE.address})`]
      : [
          `Réception : ${DELIVERY_MODE_LABELS[order.deliveryMode]}`,
          `Wilaya : ${wilayaLabel(order.wilaya)}`,
          ...(order.deliveryMode === "domicile" ? [`Adresse : ${order.address}`] : []),
        ];

  return [
    `Bonjour ${SITE.name}, je souhaite passer commande :`,
    "",
    ...lines.map((line) => `• ${line.quantity} × ${line.product.name} — ${formatPrice(line.lineTotal)}`),
    "",
    `Sous-total produits : ${formatPrice(subtotal)}`,
    `Livraison : ${deliveryFee > 0 ? formatPrice(deliveryFee) : "—"}`,
    `Total : ${formatPrice(total)}`,
    "",
    `Nom : ${order.fullName}`,
    `Téléphone : ${order.phone}`,
    ...receptionLines,
    ...(order.note ? [`Remarque : ${order.note}`] : []),
  ].join("\n");
}

function wilayaLabel(code: string): string {
  const wilaya = getWilaya(code);
  return wilaya ? formatWilaya(wilaya) : code;
}

export function buildWhatsappOrderUrl(order: Order): string {
  return `${SITE.whatsappHref}?text=${encodeURIComponent(buildOrderMessage(order))}`;
}
