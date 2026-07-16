"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    id: "abertura",
    kind: "hero" as const,
    brand: "Presença",
    title: "O atendente virtual que vende na sua loja.",
    text: "Totem, robô com tablet ou o celular do cliente. Um QR Code e a conversa começa — em voz, com avatar, até o pagamento.",
    image: "/apresentacao/presenca-totem-loja.png",
    imageAlt: "Totem Presença na frente de uma loja de móveis",
    ctaPrimary: { href: "/a/casa-viva/sofas", label: "Ver demonstração" },
    ctaSecondary: { href: "/dashboard", label: "Painel do lojista" },
  },
  {
    id: "totem",
    kind: "story" as const,
    eyebrow: "Canal 01",
    title: "Totem na porta da loja",
    text: "Um ponto de presença na calçada ou na vitrine. O cliente escaneia o QR, abre a página no celular e já fala com o atendente virtual do setor.",
    points: [
      "Funciona 24 horas, mesmo com a loja fechada para consulta",
      "QR específico por entrada, corredor ou vitrine",
      "Sem instalar aplicativo",
    ],
    image: "/apresentacao/presenca-totem-loja.png",
    imageAlt: "Totem digital Presença diante da fachada da loja",
  },
  {
    id: "shopping",
    kind: "story" as const,
    eyebrow: "Canal 01 · escala",
    title: "Totens em shoppings e corredores",
    text: "Leve a Presença para o fluxo do shopping: captura atenção, qualifica interesse e leva o cliente até a loja ou direto ao orçamento.",
    points: [
      "Ideal para redes e franquias",
      "Mesma marca em todos os pontos",
      "Contexto do setor já no primeiro contato",
    ],
    image: "/apresentacao/presenca-shopping-totem.png",
    imageAlt: "Totem Presença em corredor de shopping",
  },
  {
    id: "robo",
    kind: "story" as const,
    eyebrow: "Canal 02",
    title: "Robô com tablet no corredor",
    text: "Um tablet sobre base móvel circula entre as gôndolas. O cliente conversa como em uma videochamada: a IA apresenta produtos, compara opções e conduz a venda.",
    points: [
      "Avatar humano com voz natural",
      "Catálogo, estoque e preços na hora",
      "Chama vendedor humano quando precisar",
    ],
    image: "/apresentacao/presenca-robo-tablet.png",
    imageAlt: "Robô com tablet Presença em showroom de móveis",
  },
  {
    id: "celular",
    kind: "story" as const,
    eyebrow: "Canal 03",
    title: "O celular do próprio cliente",
    text: "O caminho mais simples: aponta a câmera para o QR, autoriza microfone e conversa. A marca Presença aparece como uma videochamada de vendas no navegador.",
    points: [
      "Zero atrito de instalação",
      "Experiência íntima e imediata",
      "Do sofá ideal ao link de Pix ou cartão",
    ],
    image: "/apresentacao/presenca-cliente-celular.png",
    imageAlt: "Cliente usando o celular com o app web Presença",
  },
  {
    id: "jornada",
    kind: "journey" as const,
    brand: "Presença",
    title: "Da entrada ao pagamento",
    steps: [
      { label: "Escaneia", detail: "QR no totem, robô ou mesa" },
      { label: "Conversa", detail: "Voz + avatar em tempo real" },
      { label: "Escolhe", detail: "Produtos, medidas e comparações" },
      { label: "Fecha", detail: "Orçamento, Pix/cartão ou handoff" },
    ],
  },
  {
    id: "kit",
    kind: "story" as const,
    eyebrow: "Go-to-market",
    title: "Um kit, três formas de vender",
    text: "Totem de fachada, tablet no balcão e QR de mesa apontam para a mesma plataforma. Cada loja personaliza avatar, voz, tom, catálogo e regras.",
    points: [
      "SaaS multi-loja e multi-setor",
      "Integração com ERP, CRM e pagamentos",
      "Operação recorrente para redes",
    ],
    image: "/apresentacao/presenca-fechamento-kit.png",
    imageAlt: "Kit Presença com celular, QR e tablet",
  },
  {
    id: "fechamento",
    kind: "close" as const,
    brand: "Presença",
    title: "Seu cliente nunca mais espera por um atendente.",
    text: "Mostre a demo da Casa Viva ou configure o primeiro QR da sua loja hoje.",
    image: "/apresentacao/presenca-cliente-celular.png",
    imageAlt: "Cliente atendido pela Presença no celular",
    ctaPrimary: { href: "/a/casa-viva/sofas", label: "Abrir demo ao vivo" },
    ctaSecondary: { href: "/dashboard", label: "Gerar QR da loja" },
  },
];

export function SalesDeck() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        setIndex((current) => Math.min(current + 1, slides.length - 1));
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setIndex((current) => Math.max(current - 1, 0));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="deck">
      <header className="deck-chrome">
        <Link href="/" className="brand-lockup">
          Presença
        </Link>
        <div className="deck-progress" aria-hidden>
          {slides.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={i === index ? "is-active" : ""}
              onClick={() => setIndex(i)}
              aria-label={`Ir para slide ${i + 1}`}
            />
          ))}
        </div>
        <p className="deck-count">
          {index + 1} / {slides.length}
        </p>
      </header>

      <div key={slide.id} className={`deck-slide deck-slide-${slide.kind}`}>
        {slide.kind === "hero" || slide.kind === "close" ? (
          <section className="deck-hero-panel">
            <div className="deck-hero-media">
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                priority
                sizes="100vw"
                className="deck-hero-image"
              />
              <div className="deck-hero-veil" />
            </div>
            <div className="deck-hero-copy">
              <p className="brand-hero deck-brand">{slide.brand}</p>
              <h1>{slide.title}</h1>
              <p className="deck-support">{slide.text}</p>
              <div className="hero-cta">
                <Link href={slide.ctaPrimary.href} className="btn-primary">
                  {slide.ctaPrimary.label}
                </Link>
                <Link href={slide.ctaSecondary.href} className="btn-ghost deck-ghost-light">
                  {slide.ctaSecondary.label}
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        {slide.kind === "story" ? (
          <section className="deck-story">
            <div className="deck-story-copy">
              <p className="eyebrow">{slide.eyebrow}</p>
              <h2>{slide.title}</h2>
              <p className="deck-support">{slide.text}</p>
              <ul className="deck-points">
                {slide.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
            <div className="deck-story-media">
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                width={1600}
                height={900}
                className="deck-photo"
                sizes="(max-width: 900px) 100vw, 55vw"
                priority
              />
            </div>
          </section>
        ) : null}

        {slide.kind === "journey" ? (
          <section className="deck-journey">
            <p className="brand-hero deck-brand-inline">{slide.brand}</p>
            <h2>{slide.title}</h2>
            <ol className="deck-steps">
              {slide.steps.map((step, stepIndex) => (
                <li key={step.label}>
                  <span className="deck-step-num">0{stepIndex + 1}</span>
                  <strong>{step.label}</strong>
                  <span>{step.detail}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </div>

      <footer className="deck-nav">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setIndex((current) => Math.max(current - 1, 0))}
          disabled={index === 0}
        >
          Anterior
        </button>
        <p className="deck-hint">Use ← → ou espaço</p>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setIndex((current) => Math.min(current + 1, slides.length - 1))}
          disabled={index === slides.length - 1}
        >
          Próximo
        </button>
      </footer>
    </div>
  );
}
