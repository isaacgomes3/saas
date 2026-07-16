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

export const demoStore: StoreConfig = {
  id: "store_casa_viva",
  slug: "casa-viva",
  name: "Casa Viva Móveis",
  segment: "Móveis e decoração",
  city: "São Paulo",
  attendantName: "Lia",
  attendantTone: "consultiva, calorosa e objetiva",
  voiceLang: "pt-BR",
  primaryColor: "#0d5c4d",
  accentColor: "#e8a838",
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

export const stores: StoreConfig[] = [demoStore];

export function getStoreBySlug(slug: string): StoreConfig | undefined {
  return stores.find((store) => store.slug === slug);
}

export function getSector(store: StoreConfig, sectorId?: string) {
  return (
    store.sectors.find((sector) => sector.id === sectorId) ??
    store.sectors.find((sector) => sector.id === "geral") ??
    store.sectors[0]
  );
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
