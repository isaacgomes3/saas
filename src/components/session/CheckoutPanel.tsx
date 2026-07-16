"use client";

import { formatBRL } from "@/lib/stores";
import type { Quote } from "@/lib/types";

type CheckoutPanelProps = {
  quote: Quote | null;
  handoff: boolean;
  onPay: () => void;
  onClose: () => void;
};

export function CheckoutPanel({ quote, handoff, onPay, onClose }: CheckoutPanelProps) {
  if (!quote && !handoff) return null;

  return (
    <aside className="checkout-panel" role="dialog" aria-label="Finalização da venda">
      <button type="button" className="checkout-close" onClick={onClose} aria-label="Fechar">
        ×
      </button>
      {handoff ? (
        <>
          <h3>Vendedor humano a caminho</h3>
          <p>
            Um atendente da loja foi notificado e vai finalizar com você. Seu contexto da conversa
            já está disponível para agilizar.
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
            Ir para pagamento
          </button>
          <p className="quote-hint">Pix, cartão ou link seguro — integrado ao checkout da loja.</p>
        </>
      ) : null}
    </aside>
  );
}
