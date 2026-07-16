import type { Product, StoreConfig } from "./types";

const furnitureProducts: Product[] = [
  {
    id: "sofa-compacto-2m",
    name: "Sofá Compacto Aurora 2m",
    category: "Sofás",
    price: 3490,
    stock: 6,
    size: "2,00 × 0,90 × 0,85 m",
    description:
      "Sofá de 2 metros com chaise reversível, ideal para salas de 3×4 m. Estrutura reforçada e tecido antimancha.",
    highlights: ["Chaise reversível", "Tecido antimancha", "Entrega em 7 dias"],
    imageGradient: "linear-gradient(145deg, #2f5d50 0%, #8fbc8f 55%, #d9c4a5 100%)",
    suitableFor: ["apartamento pequeno", "sala compacta", "3x4", "3 por 4"],
  },
  {
    id: "sofa-modular-nest",
    name: "Sofá Modular Nest",
    category: "Sofás",
    price: 4290,
    stock: 4,
    size: "2,20 × 1,50 × 0,82 m (configurável)",
    description:
      "Módulos que se rearranjam conforme o espaço. Ótimo para quem quer flexibilidade sem abrir mão do conforto.",
    highlights: ["Modular", "Capa removível", "Base em madeira maciça"],
    imageGradient: "linear-gradient(145deg, #1f3a5f 0%, #6b8cae 50%, #e8dcc8 100%)",
    suitableFor: ["apartamento pequeno", "sala compacta", "flexível"],
  },
  {
    id: "sofa-loveseat-lino",
    name: "Loveseat Lino",
    category: "Sofás",
    price: 2790,
    stock: 9,
    size: "1,60 × 0,85 × 0,80 m",
    description:
      "Dois lugares com assento profundo. Cabe em salas estreitas e combina com poltrona auxiliar.",
    highlights: ["2 lugares", "Assento profundo", "Pés em metal fosco"],
    imageGradient: "linear-gradient(145deg, #5c4033 0%, #c4a484 50%, #f0e6d8 100%)",
    suitableFor: ["apartamento pequeno", "sala estreita", "studio"],
  },
  {
    id: "poltrona-curva",
    name: "Poltrona Curva Verde",
    category: "Poltronas",
    price: 1890,
    stock: 12,
    size: "0,78 × 0,82 × 0,90 m",
    description: "Poltrona de leitura com apoio lombar e giratório suave.",
    highlights: ["Giratória", "Apoio lombar", "Tecido bouclé"],
    imageGradient: "linear-gradient(145deg, #0d5c4d 0%, #3d8b7a 50%, #dce8e4 100%)",
    suitableFor: ["leitura", "canto", "complemento"],
  },
  {
    id: "mesa-centro-slim",
    name: "Mesa de Centro Slim",
    category: "Mesas",
    price: 990,
    stock: 15,
    size: "1,00 × 0,50 × 0,40 m",
    description: "Tampo em carvalho claro e estrutura metalizada leve para não pesar o visual.",
    highlights: ["Carvalho claro", "Visual leve", "Fácil de limpar"],
    imageGradient: "linear-gradient(145deg, #8b7355 0%, #d2b48c 45%, #f5f0e8 100%)",
    suitableFor: ["sala compacta", "apartamento pequeno"],
  },
];

const dentalServices: Product[] = [
  {
    id: "avaliacao-completa",
    name: "Avaliação odontológica completa",
    category: "Consultas",
    price: 120,
    stock: 40,
    size: "40–50 min",
    description:
      "Consulta acolhedora com exame clínico, orientação personalizada e plano de tratamento sem pressão. Ideal para quem está começando o cuidado ou voltando ao dentista.",
    highlights: ["Sem pressão de venda", "Plano claro", "Encaixe rápido"],
    imageGradient: "linear-gradient(145deg, #1f6f78 0%, #7ec8c9 55%, #f2ebe3 100%)",
    suitableFor: ["primeira consulta", "dor", "avaliacao", "check-up", "orientacao"],
  },
  {
    id: "limpeza-profilaxia",
    name: "Limpeza e profilaxia",
    category: "Prevenção",
    price: 220,
    stock: 35,
    size: "45–60 min",
    description:
      "Remoção de tártaro e placa, polimento e orientação de higiene. Deixa o sorriso mais limpo e ajuda a prevenir gengivite e cáries.",
    highlights: ["Confortável", "Prevenção", "Resultado imediato"],
    imageGradient: "linear-gradient(145deg, #0f766e 0%, #5eead4 50%, #ecfeff 100%)",
    suitableFor: ["limpeza", "tártaro", "sangramento", "manchas", "prevencao", "check-up"],
  },
  {
    id: "clareamento-dental",
    name: "Clareamento dental supervisionado",
    category: "Estética",
    price: 980,
    stock: 18,
    size: "1–2 sessões + moldeira",
    description:
      "Clareamento feito com acompanhamento profissional para clarear com segurança, respeitando a sensibilidade de cada pessoa.",
    highlights: ["Resultado natural", "Acompanhamento", "Protocolo seguro"],
    imageGradient: "linear-gradient(145deg, #0369a1 0%, #7dd3fc 50%, #f8fafc 100%)",
    suitableFor: ["clareamento", "estetica", "sorriso amarelado", "manchas", "autoestima"],
  },
  {
    id: "alinhadores",
    name: "Alinhadores transparentes",
    category: "Ortodontia",
    price: 6900,
    stock: 12,
    size: "plano personalizado",
    description:
      "Alinhamento discreto com placas transparentes. Avaliamos o caso, mostramos a previsão do sorriso e acompanhamos cada etapa.",
    highlights: ["Discreto no dia a dia", "Conforto", "Acompanhamento contínuo"],
    imageGradient: "linear-gradient(145deg, #155e75 0%, #67e8f9 45%, #f0f9ff 100%)",
    suitableFor: ["aparelho", "alinhador", "dente torto", "ortodontia", "estetico"],
  },
  {
    id: "implante-unitario",
    name: "Implante dentário unitário",
    category: "Implantes",
    price: 4200,
    stock: 10,
    size: "planejamento + cirurgia + coroa",
    description:
      "Substituição de um dente perdido com implante e coroa. Explicamos cada etapa com calma, prazos e cuidados pós-procedimento.",
    highlights: ["Função e estética", "Planejamento digital", "Equipe especializada"],
    imageGradient: "linear-gradient(145deg, #0e7490 0%, #99f6e4 50%, #f8fafc 100%)",
    suitableFor: ["implante", "dente perdido", "protese", "falta dente", "mastigacao"],
  },
  {
    id: "lente-faceta",
    name: "Lentes de contato dental / facetas",
    category: "Estética",
    price: 1800,
    stock: 14,
    size: "por dente · sob avaliação",
    description:
      "Harmonização do sorriso com lâminas finas que corrigem forma, cor e pequenos desalinhamentos, com resultado natural.",
    highlights: ["Sorriso harmonioso", "Alta estética", "Planejamento personalizado"],
    imageGradient: "linear-gradient(145deg, #0891b2 0%, #a5f3fc 50%, #fff7ed 100%)",
    suitableFor: ["lente", "faceta", "estetica", "sorriso", "formato dente"],
  },
];

export const demoStore: StoreConfig = {
  id: "store_casa_viva",
  slug: "casa-viva",
  name: "Casa Viva Móveis",
  segment: "Móveis e decoração",
  city: "São Paulo",
  attendantName: "Lia",
  attendantTone: "consultiva, calorosa e objetiva",
  attendantImage: "/avatars/lia-casa-viva.png",
  voiceLang: "pt-BR",
  voiceGender: "female",
  primaryColor: "#0d5c4d",
  accentColor: "#e8a838",
  experienceLabel: "Atendente virtual",
  quickPrompts: [
    "Estou procurando um sofá para apartamento pequeno.",
    "Cerca de 3 por 4 metros.",
    "Quero ver fotos e medidas.",
    "Pode gerar o orçamento agora.",
  ],
  inputPlaceholder: "Fale ou digite: Estou procurando um sofá para apartamento pequeno",
  sectors: [
    {
      id: "sofas",
      name: "Sofás e estar",
      label: "Setor Sofás",
      greeting:
        "Oi! Sou a Lia, atendente virtual da Casa Viva. Vi que você está no setor de sofás. Posso te ajudar a encontrar o modelo certo para o seu espaço?",
    },
    {
      id: "mesas",
      name: "Mesas e jantar",
      label: "Setor Mesas",
      greeting:
        "Bem-vindo ao setor de mesas! Sou a Lia. Quer montar um canto de jantar compacto ou algo para receber visitas?",
    },
    {
      id: "geral",
      name: "Entrada da loja",
      label: "Entrada",
      greeting:
        "Olá! Sou a Lia, atendente virtual da Casa Viva. Estou disponível agora — o que você está procurando hoje?",
    },
  ],
  products: furnitureProducts,
};

export const odontoFaceStore: StoreConfig = {
  id: "store_odonto_face",
  slug: "odonto-face",
  name: "Odonto Face",
  segment: "Clínica odontológica",
  city: "São Paulo",
  attendantName: "Sofia",
  attendantTone:
    "humanizado, acolhedor, claro e sem pressão — explica com calma e valida o sentimento do paciente",
  attendantImage: "/avatars/sofia-odonto-face.png",
  voiceLang: "pt-BR",
  voiceGender: "female",
  primaryColor: "#0e7490",
  accentColor: "#f59e0b",
  experienceLabel: "Atendimento humanizado",
  quickPrompts: [
    "Estou com dor de dente e preciso de orientação.",
    "Quero clarear meu sorriso. Como funciona?",
    "Quais serviços a clínica oferece?",
    "Pode montar um orçamento da avaliação?",
  ],
  inputPlaceholder: "Fale ou digite: Estou com dor de dente / Quero clarear o sorriso",
  sectors: [
    {
      id: "recepcao",
      name: "Recepção",
      label: "Recepção",
      greeting:
        "Olá! Eu sou a Sofia, da Odonto Face. Estou aqui para te acolher com calma, explicar nossos serviços e te ajudar a escolher o melhor próximo passo. Como você está se sentindo hoje?",
    },
    {
      id: "estetica",
      name: "Estética do sorriso",
      label: "Estética",
      greeting:
        "Oi! Sou a Sofia, da Odonto Face. Vi que você chegou pela área de estética. Quer conversar sobre clareamento, lentes ou um sorriso mais harmônico? Me conta o que você imagina.",
    },
    {
      id: "ortodontia",
      name: "Ortodontia",
      label: "Ortodontia",
      greeting:
        "Olá! Sou a Sofia. Aqui na ortodontia da Odonto Face a gente explica alinhadores e aparelhos sem pressa. O que mais te incomoda no alinhamento do sorriso?",
    },
    {
      id: "implantes",
      name: "Implantes",
      label: "Implantes",
      greeting:
        "Oi! Sou a Sofia, da Odonto Face. Se você perdeu um dente ou está avaliando implante, posso explicar o caminho com linguagem simples e sem susto. Quer que eu comece pelo básico?",
    },
  ],
  products: dentalServices,
};

export const stores: StoreConfig[] = [demoStore, odontoFaceStore];

export function getStoreBySlug(slug: string): StoreConfig | undefined {
  return stores.find((store) => store.slug === slug);
}

export function getSector(store: StoreConfig, sectorId?: string) {
  return (
    store.sectors.find((sector) => sector.id === sectorId) ??
    store.sectors.find((sector) => sector.id === "geral" || sector.id === "recepcao") ??
    store.sectors[0]
  );
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function isDentalClinic(store: StoreConfig) {
  return store.slug === "odonto-face" || /odont|cl[ií]nica/i.test(store.segment);
}
