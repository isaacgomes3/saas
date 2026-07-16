"use client";

import { formatBRL } from "@/lib/stores";
import type { Quote } from "@/lib/types";

type CheckoutPanelProps = {
  quote: Quote | null;
  handoff: boolean;
  dental?: boolean;
  onPay: () => void;
  onClose: () => void;
};

export function CheckoutPanel({ quote, handoff, dental, onPay, onClose }: CheckoutPanelProps) {
  if (!quote && !handoff) return null;

  return (
    <aside className="checkout-panel" role="dialog" aria-label="Finalização do atendimento">
      <button type="button" className="checkout-close" onClick={onClose} aria-label="Fechar">
        ×
      </button>
      {handoff ? (
        <>
          <h3>{dental ? "Equipe da clínica a caminho" : "Vendedor humano a caminho"}</h3>
          <p>
            {dental
              ? "A recepção/dentista foi notificada e continua o atendimento com o histórico da conversa."
              : "Um atendente da loja foi notificado e vai finalizar com você. Seu contexto da conversa já está disponível para agilizar."}
          </p>
        </>
      ) : null}
      {quote ? (
        <>
          <h3>Orçamento {quote.id}</h3>
          <ul className="quote-list">
            {quote.items.map((item) => (
              <li key={item.productId}>
                <span>{item.name}</span>
                <strong>{formatBRL(item.price)}</strong>
              </li>
            ))}
          </ul>
          <p className="quote-total">
            Total <strong>{formatBRL(quote.total)}</strong>
          </p>
          <button type="button" className="btn-primary" onClick={onPay}>
            {dental ? "Reservar / pagar avaliação" : "Ir para pagamento"}
          </button>
          <p className="quote-hint">
            {dental
              ? "Pix, cartão ou reserva — integrado ao fluxo da clínica."
              : "Pix, cartão ou link seguro — integrado ao checkout da loja."}
          </p>
        </>
      ) : null}
    </aside>
  );
}
