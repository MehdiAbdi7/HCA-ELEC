import type { ReactNode } from "react";
import { AlertIcon } from "@/components/site/icons";

type FormFieldProps = {
  label: string;
  inputId: string;
  hintId: string;
  errorId: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  children: ReactNode;
};

/**
 * Enveloppe standard d'un champ : label + champ + aide + erreur,
 * reliés entre eux pour les lecteurs d'écran (htmlFor / aria-describedby).
 */
export function FormField({ label, inputId, hintId, errorId, hint, error, required, optional, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-orange-ink">
            *
          </span>
        )}
        {optional && <span className="ml-1.5 font-normal text-ink-soft">(facultatif)</span>}
      </label>
      {children}
      {hint && (
        <p id={hintId} className="text-xs text-ink-soft">
          {hint}
        </p>
      )}
      {error && <FieldError id={errorId} message={error} />}
    </div>
  );
}

export function FieldError({ id, message }: { id?: string; message: string }) {
  return (
    <p id={id} className="flex items-start gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
      <AlertIcon className="mt-px h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}

/** Classes partagées par tous les inputs/textarea du site. */
export function inputClassName(invalid: boolean): string {
  return [
    "w-full border bg-bg px-3 py-2.5 text-sm text-ink outline-none transition-colors",
    "placeholder:text-ink-soft/60 focus:border-orange",
    invalid ? "border-red-500" : "border-line",
  ].join(" ");
}
