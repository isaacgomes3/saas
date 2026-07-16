"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatBRL, stores } from "@/lib/stores";

type QrPayload = {
  url: string;
  qrDataUrl: string;
  sector: string;
};

export function DashboardView() {
  const [storeSlug, setStoreSlug] = useState(stores[0].slug);
  const store = stores.find((item) => item.slug === storeSlug) ?? stores[0];
  const [selectedSector, setSelectedSector] = useState(store.sectors[0].id);
  const [qr, setQr] = useState<QrPayload | null>(null);
  const [loadingQr, setLoadingQr] = useState(false);

  useEffect(() => {
    setSelectedSector(store.sectors[0].id);
  }, [store.slug, store.sectors]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadingQr(true);
      try {
        const origin = window.location.origin;
        const response = await fetch(
          `/api/qr?store=${store.slug}&sector=${selectedSector}&origin=${encodeURIComponent(origin)}`,
        );
        const data = (await response.json()) as QrPayload;
        if (!cancelled) setQr(data);
      } finally {
        if (!cancelled) setLoadingQr(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [store.slug, selectedSector]);

  return (
    <div className="dashboard">
      <header className="dashboard-nav">
        <Link href="/" className="brand-lockup">
          Presença
        </Link>
        <div className="dashboard-nav-right">
          <span>{store.name}</span>
          <Link href={`/a/${store.slug}/${selectedSector}`} className="btn-nav">
            Abrir atendimento
          </Link>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-hero">
          <p className="eyebrow">Painel do lojista</p>
          <h1>Personalize o atendente da sua loja</h1>
          <p>
            Escolha aparência, voz, tom, catálogo e regras. Cada QR Code abre uma sessão pronta para
            converter — inclusive clínicas com atendimento humanizado.
          </p>
          <div className="sector-picker" style={{ marginTop: "1rem" }}>
            {stores.map((item) => (
              <button
                key={item.slug}
                type="button"
                className={storeSlug === item.slug ? "is-active" : ""}
                onClick={() => setStoreSlug(item.slug)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </section>

        <section className="dashboard-grid">
          <article className="dash-panel">
            <h2>Atendente</h2>
            <div className="attendant-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={store.attendantImage} alt={store.attendantName} />
            </div>
            <dl className="meta-list">
              <div>
                <dt>Nome</dt>
                <dd>{store.attendantName}</dd>
              </div>
              <div>
                <dt>Tom</dt>
                <dd>{store.attendantTone}</dd>
              </div>
              <div>
                <dt>Idioma</dt>
                <dd>{store.voiceLang}</dd>
              </div>
              <div>
                <dt>Segmento</dt>
                <dd>{store.segment}</dd>
              </div>
            </dl>
          </article>

          <article className="dash-panel">
            <h2>QR Codes por setor</h2>
            <div className="sector-picker">
              {store.sectors.map((sector) => (
                <button
                  key={sector.id}
                  type="button"
                  className={selectedSector === sector.id ? "is-active" : ""}
                  onClick={() => setSelectedSector(sector.id)}
                >
                  {sector.label}
                </button>
              ))}
            </div>
            <div className="qr-box">
              {loadingQr ? <p>Gerando QR…</p> : null}
              {qr ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qr.qrDataUrl} alt={`QR Code para ${qr.url}`} />
                  <p className="qr-url">{qr.url}</p>
                  <Link href={qr.url} className="btn-primary">
                    Testar este QR
                  </Link>
                </>
              ) : null}
            </div>
          </article>

          <article className="dash-panel dash-wide">
            <h2>{store.slug === "odonto-face" ? "Serviços da clínica" : "Catálogo conectado"}</h2>
            <div className="catalog-table">
              {store.products.map((product) => (
                <div key={product.id} className="catalog-row">
                  <div>
                    <strong>{product.name}</strong>
                    <span>
                      {product.category} · {product.size}
                    </span>
                  </div>
                  <div className="catalog-metrics">
                    <span>{formatBRL(product.price)}</span>
                    <span>
                      {store.slug === "odonto-face"
                        ? `Vagas ${product.stock}`
                        : `Estoque ${product.stock}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="dash-panel">
            <h2>Integrações</h2>
            <ul className="integration-list">
              <li>ERP / estoque ou agenda</li>
              <li>CRM da loja/clínica</li>
              <li>Pagamentos Pix e cartão</li>
              <li>Handoff para equipe humana</li>
            </ul>
          </article>

          <article className="dash-panel">
            <h2>Modelo SaaS</h2>
            <p>
              Cada negócio é um tenant: avatar, voz, tom, catálogo e regras próprias. Ideal para
              redes de lojas e clínicas.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
