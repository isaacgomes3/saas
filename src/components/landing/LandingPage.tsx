import Link from "next/link";

const pillars = [
  {
    title: "QR Code na loja",
    text: "Cada setor abre um atendimento contextualizado — sofás, eletrônicos, veículos ou imóveis.",
  },
  {
    title: "Avatar em vídeo",
    text: "O cliente conversa como em uma videochamada, com voz natural e presença imediata.",
  },
  {
    title: "Venda até o pagamento",
    text: "A IA apresenta produtos, compara opções, gera orçamento e envia link de Pix ou cartão.",
  },
];

const segments = [
  "Móveis",
  "Concessionárias",
  "Imobiliárias",
  "Eletrônicos",
  "Supermercados",
  "Museus",
  "Feiras",
  "Shoppings",
];

export function LandingPage() {
  return (
    <div className="landing">
      <div className="landing-atmosphere" aria-hidden />

      <header className="landing-nav">
        <Link href="/" className="brand-lockup">
          Presença
        </Link>
        <nav>
          <a href="#como-funciona">Como funciona</a>
          <Link href="/apresentacao">Apresentação</Link>
          <Link href="/dashboard">Painel</Link>
          <Link href="/a/casa-viva/sofas" className="btn-nav">
            Ver demonstração
          </Link>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="brand-hero">Presença</p>
            <h1>O atendente virtual que vende na sua loja — na hora, por QR Code.</h1>
            <p className="hero-support">
              O cliente aponta a câmera, abre a página no celular e conversa por voz com um avatar
              que apresenta produtos, tira dúvidas e conduz a venda 24 horas.
            </p>
            <div className="hero-cta">
              <Link href="/a/casa-viva/sofas" className="btn-primary">
                Experimentar atendimento
              </Link>
              <Link href="/dashboard" className="btn-ghost">
                Configurar minha loja
              </Link>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="section flow-section">
          <h2>Do QR Code à venda</h2>
          <p className="section-lead">
            Uma jornada simples no navegador — sem instalar aplicativo.
          </p>
          <ol className="flow-steps">
            <li>
              <strong>Escaneia</strong>
              <span>QR Code do setor abre a página web.</span>
            </li>
            <li>
              <strong>Autoriza</strong>
              <span>Câmera e microfone para a conversa em vídeo.</span>
            </li>
            <li>
              <strong>Conversa</strong>
              <span>A IA entende a fala e responde com voz natural.</span>
            </li>
            <li>
              <strong>Fecha</strong>
              <span>Orçamento, pagamento ou handoff para vendedor humano.</span>
            </li>
          </ol>
        </section>

        <section className="section pillars-section">
          <h2>Tudo que a loja precisa no mesmo fio</h2>
          <div className="pillars">
            {pillars.map((pillar) => (
              <article key={pillar.title}>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="plataforma" className="section platform-section">
          <h2>Uma plataforma, várias lojas</h2>
          <p className="section-lead">
            Cada empresa personaliza avatar, voz, tom, catálogo e regras de venda — e escala como
            SaaS recorrente.
          </p>
          <div className="platform-grid">
            <article>
              <h3>Catálogo vivo</h3>
              <p>Preços, estoque e especificações sincronizados com ERP ou planilha da loja.</p>
            </article>
            <article>
              <h3>Contexto por setor</h3>
              <p>QR Codes distintos reconhecem onde o cliente está e adaptam a conversa.</p>
            </article>
            <article>
              <h3>Multilíngue</h3>
              <p>Atende turistas e muda o discurso conforme o perfil do cliente.</p>
            </article>
            <article>
              <h3>Handoff humano</h3>
              <p>Quando a venda pede tato humano, um vendedor assume com o histórico pronto.</p>
            </article>
          </div>
        </section>

        <section className="section segments-section">
          <h2>Onde a Presença vende</h2>
          <ul className="segment-list">
            {segments.map((segment) => (
              <li key={segment}>{segment}</li>
            ))}
          </ul>
        </section>

        <section className="section demo-section">
          <h2>Veja a conversa acontecer</h2>
          <p className="section-lead">
            Experimente a loja de móveis ou a clínica odontológica com atendimento humanizado.
          </p>
          <div className="hero-cta">
            <Link href="/a/casa-viva/sofas" className="btn-primary">
              Demo Casa Viva
            </Link>
            <Link href="/a/odonto-face/recepcao" className="btn-ghost">
              Demo Odonto Face
            </Link>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>Presença — atendente virtual para lojas físicas.</p>
        <Link href="/dashboard">Painel do lojista</Link>
      </footer>
    </div>
  );
}
