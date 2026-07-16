import { formatBRL, isDentalClinic } from "./stores";
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

function previousCustomerTurns(history: ChatMessage[], message: string) {
  return Math.max(
    0,
    history.filter((item) => item.role === "customer").length -
      (history.at(-1)?.role === "customer" && history.at(-1)?.text === message ? 1 : 0),
  );
}

function findByTags(products: Product[], tags: string[]) {
  return products.filter((product) =>
    product.suitableFor.some((tag) => tags.some((needle) => tag.includes(needle) || needle.includes(tag))),
  );
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
    store.sectors.find((item) => item.id === "geral" || item.id === "recepcao") ??
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

function generateDentalReply(params: {
  store: StoreConfig;
  message: string;
  history: ChatMessage[];
}): ConversationResult {
  const { store, message, history } = params;
  const text = normalize(message);
  const turns = previousCustomerTurns(history, message);

  const wantsHuman =
    /(humano|dentista|pessoa|recepcao|recepção|falar com alguem|atendente real)/.test(text);
  const wantsQuote =
    /(orçamento|orcamento|pagamento|pagar|pix|cartao|agendar|marcar|consulta)/.test(text);
  const listsServices =
    /(quais serviços|quais servicos|o que voces fazem|o que vocês fazem|servicos|serviços|opcoes|opções)/.test(
      text,
    );
  const pain =
    /(dor de dente|estou com dor|to com dor|doendo|sensibilidade forte|emergencia|emergencia)/.test(
      text,
    ) ||
    (/\binchaco\b/.test(text) && !/sem\s+inchaco/.test(text));
  const whitening = /(clarear|clareamento|amarelo|amarelado|mancha)/.test(text);
  const aligners = /(aparelho|alinhador|dente torto|ortodontia|apertado)/.test(text);
  const implant = /(implante|perdi um dente|dente perdido|falta (um )?dente|protese|prótese)/.test(
    text,
  );
  const veneers = /(lente|faceta|harmonizar|estetica|estética do sorriso)/.test(text);
  const cleaning = /(limpeza|tartaro|tártaro|sangra|gengiva|profilaxia)/.test(text);
  const fear = /(medo|ansiedade|nervos|odio de dentista|ódio de dentista)/.test(text);
  const greeting = /(ola|olá|oi|bom dia|boa tarde|boa noite)/.test(text);

  if (wantsHuman) {
    return {
      reply:
        "Claro. Vou chamar alguém da equipe da Odonto Face para continuar com você. Enquanto isso, posso deixar um resumo do que conversamos e um orçamento pronto para facilitar.",
      actions: [{ type: "handoff_human" }],
    };
  }

  if (pain) {
    const service = store.products.find((item) => item.id === "avaliacao-completa");
    return {
      reply:
        "Sinto muito que você esteja com dor — isso precisa de cuidado com carinho e prioridade. Não vou te deixar sozinho nisso. O ideal é uma avaliação rápida para entender a causa com segurança. Pode me dizer há quanto tempo dói e se tem inchaço ou febre?",
      products: service ? [service] : undefined,
      actions: service
        ? [{ type: "show_products", productIds: [service.id] }]
        : undefined,
    };
  }

  if (fear) {
    return {
      reply:
        "Obrigada por falar isso. Muita gente chega com medo, e aqui o ritmo é o seu. Explicamos cada passo antes de qualquer procedimento, sem pressão. Quer começar só conversando sobre o que te preocupa, ou prefere conhecer um serviço mais suave, como limpeza ou avaliação?",
      products: store.products.filter((item) =>
        ["avaliacao-completa", "limpeza-profilaxia"].includes(item.id),
      ),
    };
  }

  if (listsServices || (greeting && turns === 0)) {
    const sample = store.products.slice(0, 4);
    return {
      reply: greeting
        ? `Oi! Que bom te receber na ${store.name}. Posso te explicar com calma nossos serviços — limpeza, clareamento, alinhadores, implantes e avaliação. O que faz mais sentido para você agora?`
        : `Na ${store.name} cuidamos de prevenção, estética e reabilitação. Destaco: ${sample
            .map((item) => item.name)
            .join("; ")}. Quer que eu explique algum deles com mais detalhe?`,
      products: sample,
      actions: [{ type: "show_products", productIds: sample.map((item) => item.id) }],
    };
  }

  if (whitening) {
    const service = store.products.find((item) => item.id === "clareamento-dental")!;
    return {
      reply: `O clareamento na Odonto Face é supervisionado: avaliamos se o seu esmalte e a gengiva estão bem, escolhemos o protocolo e acompanhamos a sensibilidade. O ${service.name} custa a partir de ${formatBRL(service.price)} e costuma trazer um resultado natural, sem exageros. Você busca um clareamento mais suave no dia a dia ou um resultado mais intenso para alguma data?`,
      products: [service],
      actions: [{ type: "show_products", productIds: [service.id] }],
    };
  }

  if (aligners) {
    const service = store.products.find((item) => item.id === "alinhadores")!;
    return {
      reply: `Os alinhadores transparentes são uma forma discreta de organizar o sorriso. Na prática: fazemos a avaliação, mostramos a previsão do movimento e acompanhamos cada troca de placa. O plano de ${service.name} começa em torno de ${formatBRL(service.price)}, conforme o caso. O que mais te incomoda hoje — dentes tortos, espaço ou mordida?`,
      products: [service],
      actions: [{ type: "show_products", productIds: [service.id] }],
    };
  }

  if (implant) {
    const service = store.products.find((item) => item.id === "implante-unitario")!;
    return {
      reply: `Entendo — perder um dente muda mastigação e confiança. O implante devolve função e estética em etapas que a gente explica sem susto: planejamento, cirurgia e coroa. O ${service.name} fica a partir de ${formatBRL(service.price)}. Quer que eu te conte o passo a passo completo ou prefere já reservar uma avaliação?`,
      products: [service],
      actions: [{ type: "show_products", productIds: [service.id] }],
    };
  }

  if (veneers) {
    const service = store.products.find((item) => item.id === "lente-faceta")!;
    return {
      reply: `Lentes e facetas ajudam a harmonizar cor, forma e pequenos desalinhamentos com um resultado bem natural. Cada caso é planejado no sorriso da pessoa — não usamos “receita pronta”. O ${service.name} sai a partir de ${formatBRL(service.price)} por dente, após avaliação. Me conta: você quer mudar cor, formato ou os dois?`,
      products: [service],
      actions: [{ type: "show_products", productIds: [service.id] }],
    };
  }

  if (cleaning) {
    const service = store.products.find((item) => item.id === "limpeza-profilaxia")!;
    return {
      reply: `A limpeza é um ótimo cuidado de rotina: tiramos tártaro e placa, polimos e orientamos a higiene em casa. É confortável e ajuda a prevenir sangramento e mau hálito. A ${service.name} custa ${formatBRL(service.price)}. Faz quanto tempo que você não faz uma limpeza profissional?`,
      products: [service],
      actions: [{ type: "show_products", productIds: [service.id] }],
    };
  }

  if (wantsQuote) {
    const recommended =
      history.flatMap((item) => item.products ?? []).find(Boolean) ??
      store.products.find((item) => item.id === "avaliacao-completa") ??
      store.products[0];
    const products = recommended ? [recommended] : [];
    const amount = products.reduce((sum, item) => sum + item.price, 0);

    return {
      reply: products.length
        ? `Perfeito. Separei o serviço ${products[0].name} por ${formatBRL(products[0].price)}. Posso gerar seu orçamento agora ou te encaminhar para o pagamento/reserva da avaliação. Se preferir, também chamo a recepção humana.`
        : "Posso montar o orçamento assim que escolhermos o serviço. Qual caminho você prefere: avaliação, limpeza ou estética?",
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

  if (/(preco|preço|quanto custa|valor)/.test(text)) {
    const sample = store.products.slice(0, 4);
    return {
      reply: `Com prazer. Valores de referência na Odonto Face: ${sample
        .map((item) => `${item.name} a partir de ${formatBRL(item.price)}`)
        .join("; ")}. O valor final sempre respeita a avaliação do seu caso. Quer que eu detalhe algum serviço?`,
      products: sample,
    };
  }

  if (/(como funciona|me explica|explica|duvida|dúvida)/.test(text)) {
    const recent = history.flatMap((item) => item.products ?? [])[0] ?? store.products[0];
    return {
      reply: recent
        ? `Claro. Sobre ${recent.name}: ${recent.description} Em média dura ${recent.size} e custa a partir de ${formatBRL(recent.price)}. Ficou alguma parte que você quer que eu explique de outro jeito?`
        : "Claro — me diga qual serviço quer entender e eu explico em linguagem simples.",
      products: recent ? [recent] : undefined,
    };
  }

  // Continuidade após dor: paciente responde duração
  if (
    turns >= 1 &&
    history.some((item) => /dor/i.test(item.text)) &&
    /(dia|hora|semana|ontem|hoje|sim|nao|não|inchado)/.test(text)
  ) {
    const service = store.products.find((item) => item.id === "avaliacao-completa")!;
    return {
      reply: `Obrigada por me contar. Com esse quadro, o melhor passo é a ${service.name} (${formatBRL(service.price)}) para avaliar com segurança e aliviar o desconforto o quanto antes. Posso gerar o orçamento da avaliação agora ou chamar a recepção para encaixar um horário. O que você prefere?`,
      products: [service],
      actions: [
        { type: "show_products", productIds: [service.id] },
        { type: "quote", productIds: [service.id] },
      ],
    };
  }

  const matched = findByTags(store.products, text.split(/\s+/).filter((w) => w.length > 3));
  if (matched.length) {
    const top = matched.slice(0, 2);
    return {
      reply: `Entendi. Pelo que você contou, faz sentido olharmos ${top
        .map((item) => item.name)
        .join(" e ")}. ${top[0].description} Quer que eu compare as opções ou já monte um orçamento?`,
      products: top,
      actions: [{ type: "show_products", productIds: top.map((item) => item.id) }],
    };
  }

  return {
    reply: `Estou aqui com você. Na ${store.name} posso explicar limpeza, clareamento, alinhadores, implantes, lentes e a avaliação inicial — sempre no seu ritmo. Me conta o que está sentindo ou o que gostaria de melhorar no sorriso?`,
  };
}

function generateFurnitureReply(params: {
  store: StoreConfig;
  message: string;
  history: ChatMessage[];
}): ConversationResult {
  const { store, message, history } = params;
  const text = normalize(message);
  const previousTurns = previousCustomerTurns(history, message);

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

  if (mentionsSize || (smallApartment && previousTurns >= 1)) {
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
    const picks = history.flatMap((item) => item.products ?? []).slice(0, 3);
    const fallback = findProductsForSmallSpace(store.products).slice(0, 2);
    const unique = Array.from(
      new Map((picks.length ? picks : fallback).map((item) => [item.id, item])).values(),
    );

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

/**
 * Motor conversacional de demonstração (sem chave de API).
 * Interpreta intenções em português conforme o tipo de loja/clínica.
 */
export function generateAttendantReply(params: {
  store: StoreConfig;
  message: string;
  history: ChatMessage[];
}): ConversationResult {
  if (isDentalClinic(params.store)) {
    return generateDentalReply(params);
  }
  return generateFurnitureReply(params);
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
        `- ${product.id}: ${product.name} | ${formatBRL(product.price)} | ${product.size} | ${product.description}`,
    )
    .join("\n");

  const dental = isDentalClinic(params.store);
  const system = dental
    ? `Você é ${params.store.attendantName}, atendente virtual humanizada da clínica ${params.store.name} (${params.store.segment}, ${params.store.city}).
Tom: ${params.store.attendantTone}.
Fale em português do Brasil, com empatia, validando sentimentos (dor, medo, vergonha). Explique serviços com clareza, sem jargão desnecessário e sem pressionar.
Nunca invente diagnóstico médico definitivo; oriente avaliação presencial quando houver dor ou risco.
Use o catálogo abaixo. Quando recomendar, cite no máximo 3 serviços.
Se o paciente quiser orçamento/agendar, ofereça orçamento ou pagamento.
Se pedir humano/dentista, ofereça transferir.
Responda SOMENTE com JSON válido:
{"reply":"texto","productIds":["id?"],"actions":[{"type":"show_products|quote|payment_link|handoff_human","productIds":["id?"],"amount":0}]}

Catálogo:
${catalog}`
    : `Você é ${params.store.attendantName}, atendente virtual de vídeo da loja ${params.store.name} (${params.store.segment}, ${params.store.city}).
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
