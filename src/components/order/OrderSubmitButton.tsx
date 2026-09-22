import { WhatsappIcon } from "@/components/site/icons";

export function OrderSubmitButton() {
  return (
    <div>
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 bg-orange px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <WhatsappIcon className="h-4 w-4" />
        Envoyer ma commande sur WhatsApp
      </button>
      <p className="mt-2 text-center text-xs text-ink-soft">
        Aucun paiement en ligne. Votre commande s&apos;ouvre dans WhatsApp, prête à envoyer au magasin.
      </p>
    </div>
  );
}
