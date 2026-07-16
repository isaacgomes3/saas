const BASE = process.env.BASE_URL || "http://localhost:3000";

async function chat(message, history) {
  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ storeSlug: "odonto-face", message, history }),
  });
  return res.json();
}

function print(role, text) {
  console.log(`\n${role}:\n  ${text}`);
}

async function main() {
  console.log("=== Demo Odonto Face (Presença) ===");
  const history = [];
  const turns = [
    "Oi, boa tarde.",
    "Estou com dor de dente e preciso de orientação.",
    "Desde ontem à noite, sem inchaço.",
    "Quero clarear meu sorriso. Como funciona?",
    "Quais serviços a clínica oferece?",
    "Pode montar um orçamento da avaliação?",
  ];

  for (const message of turns) {
    print("Paciente", message);
    history.push({
      id: `${Date.now()}`,
      role: "customer",
      text: message,
      createdAt: Date.now(),
    });
    const reply = await chat(message, history);
    print("Sofia (Odonto Face)", reply.reply);
    if (reply.products?.length) {
      console.log(
        "  Serviços:",
        reply.products.map((p) => `${p.name} (${p.price})`).join(" · "),
      );
    }
    if (reply.actions?.length) {
      console.log("  Ações:", reply.actions.map((a) => a.type).join(", "));
    }
    history.push({
      id: `${Date.now()}-a`,
      role: "attendant",
      text: reply.reply,
      products: reply.products,
      createdAt: Date.now(),
    });
  }
  console.log("\nAbra: " + BASE + "/a/odonto-face/recepcao");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
