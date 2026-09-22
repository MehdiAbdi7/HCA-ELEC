import { SITE } from "@/data/lighting";
import { PhoneIcon, WhatsappIcon } from "./icons";

export function Contact() {
  return (
    <section id="contact" className="bg-line py-16 text-ink md:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            Une question sur une référence ? Passez au magasin ou appelez.
          </h2>
          <p className="mt-2 text-ink-soft">{SITE.address}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={SITE.phoneHref}
            className="flex items-center gap-2 bg-ink-soft px-6 py-3 text-sm font-medium text-orange-ink transition-opacity hover:opacity-90"
          >
            <PhoneIcon className="h-4 w-4" />
            {SITE.phoneDisplay}
          </a>
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-white/60 px-6 py-3 text-sm font-medium transition-colors hover:border-white"
          >
            <WhatsappIcon className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
