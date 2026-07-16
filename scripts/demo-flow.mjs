/**
 * Demonstração do fluxo Presença: QR → conversa → orçamento → pagamento
 */
const BASE = process.env.BASE_URL || "http://localhost:3000";

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

function line(role, text) {
  const label = role === "cliente" ? "Cliente" : "Lia (atendente)";
  console.log(`\n${label}:\n  ${text}`);
}

async function main() {
  console.log("=== Demonstração Presença ===");
  console.log(`Base: ${BASE}\n`);

  const qr = await get("/api/qr?store=casa-viva&sector=sofas&origin=" + encodeURIComponent(BASE));
  console.log("1) Cliente escaneia QR do setor Sofás");
  console.log(`   URL aberta: ${qr.url}`);

  const history = [];
  const turns = [
    "Estou procurando um sofá para apartamento pequeno.",
    "Cerca de 3 por 4 metros.",
    "Quero ver fotos e medidas.",
    "Pode gerar o orçamento agora.",
  ];

  console.log("\n2) Página web ativa o atendimento com a Lia");
  console.log("\n3) Conversa por voz/texto:");

  for (const message of turns) {
    line("cliente", message);
    history.push({
      id: `${Date.now()}-${Math.random()}`,
      role: "customer",
      text: message,
      createdAt: Date.now(),
    });

    const reply = await post("/api/chat", {
      storeSlug: "casa-viva",
      message,
      history,
    });

    line("atendente", reply.reply);

    if (reply.products?.length) {
      console.log("  Produtos sugeridos:");
      for (const p of reply.products) {
        console.log(
          `    • ${p.name} — R$ ${p.price.toLocaleString("pt-BR")} (${p.size}) · estoque ${p.stock}`,
        );
      }
    }

    if (reply.actions?.length) {
      console.log(
        `  Ações: ${reply.actions.map((a) => a.type).join(", ")}`,
      );
    }

    history.push({
      id: `${Date.now()}-${Math.random()}`,
      role: "attendant",
      text: reply.reply,
      products: reply.products,
      createdAt: Date.now(),
    });
  }

  const quote = await post("/api/quote", {
    storeSlug: "casa-viva",
    productIds: ["sofa-compacto-2m"],
  });

  console.log("\n4) Orçamento gerado");
  console.log(`   ID: ${quote.quote.id}`);
  for (const item of quote.quote.items) {
    console.log(`   • ${item.name}: R$ ${item.price.toLocaleString("pt-BR")}`);
  }
  console.log(`   Total: R$ ${quote.quote.total.toLocaleString("pt-BR")}`);
  console.log(`   Link de pagamento: ${BASE}${quote.quote.paymentUrl}`);

  console.log("\n5) Se o cliente pedir, a IA também pode chamar um vendedor humano.");
  const handoff = await post("/api/chat", {
    storeSlug: "casa-viva",
    message: "Prefiro falar com um vendedor humano.",
    history,
  });
  line("cliente", "Prefiro falar com um vendedor humano.");
  line("atendente", handoff.reply);
  console.log(`  Ações: ${(handoff.actions || []).map((a) => a.type).join(", ") || "—"}`);

  console.log("\n=== Fim da demonstração ===");
}

main().catch((err) => {
  console.error("Falha na demo:", err);
  process.exit(1);
});
