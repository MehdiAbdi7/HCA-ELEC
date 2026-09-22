import type { ReactNode } from "react";
import { CheckIcon, WhatsappIcon } from "@/components/site/icons";

type OrderSentPanelProps = {
  whatsappUrl: string;
  onBack: () => void;
  /** Actions supplémentaires (ex. vider le panier). */
  children?: ReactNode;
};

export function OrderSentPanel({ whatsappUrl, onBack, children }: OrderSentPanelProps) {
  return (
    <div role="status" className="notch border border-orange bg-surface p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange text-white">
          <CheckIcon className="h-4 w-4" />
        </span>
        <h3 className="font-display text-lg font-semibold">Commande prête dans WhatsApp</h3>
      </div>
      <p className="mt-3 text-sm text-ink-soft">
        Appuyez sur « Envoyer » dans WhatsApp pour la transmettre au magasin. Le magasin vous confirme ensuite la
        disponibilité et, en cas de livraison, les frais.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-orange px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <WhatsappIcon className="h-4 w-4" />
          Rouvrir WhatsApp
        </a>
        {children}
        <button
          type="button"
          onClick={onBack}
          className="px-2 py-2.5 text-sm font-medium text-ink-soft underline-offset-4 hover:text-ink hover:underline"
        >
          Modifier la commande
        </button>
      </div>
    </div>
  );
}
