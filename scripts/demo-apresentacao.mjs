import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = "/opt/cursor/artifacts/apresentacao";

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    locale: "pt-BR",
  });

  await page.goto(`${BASE}/apresentacao`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, "slide-01-abertura.png") });

  for (let i = 2; i <= 8; i += 1) {
    await page.getByRole("button", { name: "Próximo" }).click();
    await page.waitForTimeout(700);
    await page.screenshot({
      path: path.join(OUT, `slide-0${i}.png`),
    });
  }

  await browser.close();
  console.log(`Slides salvos em ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
