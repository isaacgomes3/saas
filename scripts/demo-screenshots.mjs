import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = process.env.OUT_DIR || "/opt/cursor/artifacts/demo";

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
    locale: "pt-BR",
  });

  // Landing
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, "01-landing.png"), fullPage: true });

  // Dashboard + QR
  await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, "02-dashboard-qr.png"), fullPage: true });

  // Attendant session - mobile-like
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    locale: "pt-BR",
  });

  // Grant media permissions (camera/mic may still be synthetic)
  const context = mobile.context();
  await context.grantPermissions(["camera", "microphone"], { origin: BASE });

  await mobile.goto(`${BASE}/a/casa-viva/sofas`, { waitUntil: "networkidle" });
  await mobile.waitForTimeout(1200);
  await mobile.screenshot({ path: path.join(OUT, "03-atendimento-inicio.png"), fullPage: true });

  // Skip media gate if present and run conversation via quick prompts
  const mediaBtn = mobile.getByRole("button", { name: /Ativar câmera e microfone/i });
  if (await mediaBtn.count()) {
    await mediaBtn.click().catch(() => {});
    await mobile.waitForTimeout(500);
  }

  const prompts = [
    "Estou procurando um sofá para apartamento pequeno.",
    "Cerca de 3 por 4 metros.",
    "Quero ver fotos e medidas.",
    "Pode gerar o orçamento agora.",
  ];

  for (const [index, prompt] of prompts.entries()) {
    // Fecha painel de orçamento se estiver cobrindo os atalhos
    const closePanel = mobile.getByRole("button", { name: "Fechar" });
    if (await closePanel.count()) {
      await closePanel.click().catch(() => {});
      await mobile.waitForTimeout(200);
    }

    const button = mobile.getByRole("button", { name: prompt, exact: true });
    await button.click({ force: true });
    await mobile.waitForTimeout(2200);
    await mobile.screenshot({
      path: path.join(OUT, `04-conversa-passo-${index + 1}.png`),
      fullPage: true,
    });
  }

  // Captura final com painel de orçamento aberto, se existir
  const checkout = mobile.locator(".checkout-panel");
  if (await checkout.count()) {
    await mobile.screenshot({
      path: path.join(OUT, "04-conversa-orcamento.png"),
      fullPage: true,
    });
  }

  // Payment page from quote total of recommended sofa
  await page.goto(`${BASE}/pagamento/orc-demo?loja=casa-viva&total=3490`, {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, "05-pagamento.png"), fullPage: true });

  await browser.close();
  console.log(`Screenshots salvos em ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
