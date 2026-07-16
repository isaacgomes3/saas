import { formatBRL } from "./stores";
import type { ChatMessage, Product, SessionAction, StoreConfig } from "./types";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function findProductsForSmallSpace(products: Product[]) {
  return products.filter((product) =>
    product.suitableFor.some((tag) =>
      ["apartamento pequeno", "sala compacta", "3x4", "3 por 4", "studio", "sala estreita"].includes(
        tag,
      ),
    ),
  );
}

export function buildGreeting(store: StoreConfig, sectorId?: string): ChatMessage {
  const sector =
    store.sectors.find((item) => item.id === sectorId) ??
    store.sectors.find((item) => item.id === "geral") ??
    store.sectors[0];

  return {
    id: uid(),
    role: "attendant",
    text: sector.greeting,
    createdAt: Date.now(),
  };
}

export type ConversationResult = {
  reply: string;
  products?: Product[];
  actions?: SessionAction[];
};

/**
 * Motor conversacional de demonstração (sem chave de API).
 * Interpreta intenções em português para o fluxo de venda em loja física.
 * Pronto para ser substituído/combinado com um LLM via OPENAI_API_KEY.
 */
export function generateAttendantReply(params: {
  store: StoreConfig;
  message: string;
  history: ChatMessage[];
}): ConversationResult {
  const { store, message, history } = params;
  const text = normalize(message);
  // Histórico pode incluir a mensagem atual; contamos só os turnos anteriores.
  const previousCustomerTurns = Math.max(
    0,
    history.filter((item) => item.role === "customer").length -
      (history.at(-1)?.role === "customer" && history.at(-1)?.text === message ? 1 : 0),
  );

  const wantsBuy =
    /(comprar|fechar|pagamento|pagar|pix|cartao|orçamento|orcamento|pedido)/.test(text);
  const wantsHuman = /(humano|vendedor|pessoa|atendente real|falar com alguem)/.test(text);
  const mentionsSofa = /(sofa|sofá|estar|sala)/.test(text) || text.includes("sofa");
  const smallApartment =
    /(apartamento pequeno|apto pequeno|espaco pequeno|espaço pequeno|compacto|studio|kitnet)/.test(
      text,
    );
  const mentionsSize =
    /(3\s*(por|x|×)\s*4|3x4|tres por quatro|três por quatro|metros)/.test(text) ||
    /\b3\b.*\b4\b/.test(text);
  const wantsVisual =
    /(foto|fotos|imagem|imagens|mostrar|ver|medidas|simular|simulacao|simulação|3d)/.test(text);

  if (wantsHuman) {
    return {
      reply:
        "Claro. Vou chamar um vendedor humano agora. Enquanto isso, posso deixar o orçamento preparado para agilizar o atendimento.",
      actions: [{ type: "handoff_human" }],
    };
  }

  if (wantsBuy) {
    const recommended =
      history.flatMap((item) => item.products ?? []).find(Boolean) ??
      findProductsForSmallSpace(store.products)[0] ??
      store.products[0];

    const products = recommended ? [recommended] : [];
    const amount = products.reduce((sum, item) => sum + item.price, 0);

    return {
      reply: products.length
        ? `Perfeito. Separei o ${products[0].name} por ${formatBRL(products[0].price)}. Posso gerar seu orçamento agora ou te encaminhar direto para o pagamento via Pix ou cartão.`
        : "Posso gerar um orçamento assim que escolhermos o produto. Qual modelo você prefere?",
      products,
      actions: products.length
        ? [
            { type: "quote", productIds: products.map((item) => item.id) },
            {
              type: "payment_link",
              productIds: products.map((item) => item.id),
              amount,
            },
          ]
        : undefined,
    };
  }

  if (mentionsSize || (smallApartment && previousCustomerTurns >= 1)) {
    const picks = findProductsForSmallSpace(store.products).slice(0, 3);
    const top = picks[0];

    return {
      reply: top
        ? `Nesse caso, recomendo o ${top.name}. Ele tem ${top.size}, chaise reversível e costuma funcionar muito bem em salas de cerca de 3 por 4 metros. Posso mostrar fotos, medidas e até simular como ele ficaria na sua sala. Gostaria de ver?`
        : "Para salas de cerca de 3 por 4 metros, costumo indicar modelos de até 2 metros com chaise. Quer que eu filtre as opções?",
      products: picks,
      actions: picks.length
        ? [{ type: "show_products", productIds: picks.map((item) => item.id) }]
        : undefined,
    };
  }

  if (mentionsSofa || smallApartment) {
    const picks = findProductsForSmallSpace(store.products).slice(0, 3);
    return {
      reply:
        "Tenho três modelos que costumam funcionar muito bem em espaços compactos. Qual o tamanho aproximado da sua sala?",
      products: picks,
      actions: [{ type: "show_products", productIds: picks.map((item) => item.id) }],
    };
  }

  if (wantsVisual) {
    const picks =
      history.flatMap((item) => item.products ?? []).slice(0, 3) ||
      findProductsForSmallSpace(store.products).slice(0, 2);
    const unique = Array.from(new Map(picks.map((item) => [item.id, item])).values());

    return {
      reply: unique.length
        ? `Olha só: trouxe ${unique.map((item) => item.name).join(", ")} com medidas e detalhes. Se desejar, posso gerar seu orçamento agora ou encaminhar você diretamente para o pagamento.`
        : "Posso mostrar fotos e medidas assim que escolhermos um modelo. Me conta o que você busca?",
      products: unique,
      actions: unique.length
        ? [
            { type: "show_products", productIds: unique.map((item) => item.id) },
            { type: "quote", productIds: unique.slice(0, 1).map((item) => item.id) },
          ]
        : undefined,
    };
  }

  if (/(ola|olá|oi|bom dia|boa tarde|boa noite)/.test(text)) {
    return {
      reply: `Olá! Sou ${store.attendantName}, da ${store.name}. Posso te ajudar a escolher produtos, comparar opções e até gerar o pagamento. O que você procura?`,
    };
  }

  if (/(preco|preço|quanto custa|valor)/.test(text)) {
    const sample = store.products.slice(0, 3);
    return {
      reply: `Aqui vão algumas referências: ${sample
        .map((item) => `${item.name} por ${formatBRL(item.price)}`)
        .join("; ")}. Quer que eu filtre por orçamento?`,
      products: sample,
    };
  }

  return {
    reply: `Entendi. Na ${store.name} eu consigo apresentar produtos, comparar opções e conduzir a venda. Me diga o ambiente, o tamanho do espaço ou o produto que você busca — por exemplo, um sofá para apartamento pequeno.`,
  };
}

export async function generateAttendantReplyWithLLM(params: {
  store: StoreConfig;
  message: string;
  history: ChatMessage[];
}): Promise<ConversationResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return generateAttendantReply(params);
  }

  const catalog = params.store.products
    .map(
      (product) =>
        `- ${product.id}: ${product.name} | ${formatBRL(product.price)} | estoque ${product.stock} | ${product.size} | ${product.description}`,
    )
    .join("\n");

  const system = `Você é ${params.store.attendantName}, atendente virtual de vídeo da loja ${params.store.name} (${params.store.segment}, ${params.store.city}).
Tom: ${params.store.attendantTone}.
Fale em português do Brasil, de forma natural e consultiva, como um vendedor presencial.
Use o catálogo abaixo. Quando recomendar produtos, cite no máximo 3.
Se o cliente quiser comprar, ofereça orçamento ou link de pagamento.
Se pedir humano, ofereça transferir para vendedor.
Responda SOMENTE com JSON válido neste formato:
{"reply":"texto","productIds":["id?"],"actions":[{"type":"show_products|quote|payment_link|handoff_human","productIds":["id?"],"amount":0}]}

Catálogo:
${catalog}`;

  const messages = [
    { role: "system", content: system },
    ...params.history.slice(-8).map((item) => ({
      role: item.role === "attendant" ? "assistant" : "user",
      content: item.text,
    })),
    { role: "user", content: params.message },
  ];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.6,
        response_format: { type: "json_object" },
        messages,
      }),
    });

    if (!response.ok) {
      return generateAttendantReply(params);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return generateAttendantReply(params);

    const parsed = JSON.parse(raw) as {
      reply?: string;
      productIds?: string[];
      actions?: SessionAction[];
    };

    const products = (parsed.productIds ?? [])
      .map((id) => params.store.products.find((product) => product.id === id))
      .filter(Boolean) as Product[];

    return {
      reply: parsed.reply ?? generateAttendantReply(params).reply,
      products: products.length ? products : undefined,
      actions: parsed.actions,
    };
  } catch {
    return generateAttendantReply(params);
  }
}
