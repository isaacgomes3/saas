import Link from "next/link";
import { formatBRL, getStoreBySlug } from "@/lib/stores";

type PageProps = {
  params: Promise<{ quoteId: string }>;
  searchParams: Promise<{ loja?: string; total?: string }>;
};

export default async function PaymentPage({ params, searchParams }: PageProps) {
  const { quoteId } = await params;
  const query = await searchParams;
  const store = getStoreBySlug(query.loja ?? "casa-viva");
  const total = Number(query.total ?? 0);

  return (
    <div className="payment-page">
      <div className="payment-card">
        <p className="brand-mark">Presença</p>
        <h1>Pagamento</h1>
        <p>
          Orçamento <strong>{quoteId}</strong>
          {store ? ` · ${store.name}` : ""}
        </p>
        <p className="quote-total">
          Total <strong>{formatBRL(total || 0)}</strong>
        </p>
        <p>
          Em produção, este passo integra Pix, cartão ou link do gateway da loja. Nesta demo, o
          pedido fica pronto para finalização.
        </p>
        <div className="hero-cta" style={{ marginTop: "1.25rem" }}>
          <Link
            href={`/a/${store?.slug ?? "casa-viva"}/${store?.slug === "odonto-face" ? "recepcao" : "sofas"}`}
            className="btn-primary"
          >
            Voltar ao atendimento
          </Link>
          <Link href="/dashboard" className="btn-ghost">
            Painel do lojista
          </Link>
        </div>
      </div>
    </div>
  );
}
