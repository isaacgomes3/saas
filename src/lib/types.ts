export type StoreSector = {
  id: string;
  name: string;
  label: string;
  greeting: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  size: string;
  description: string;
  highlights: string[];
  imageGradient: string;
  suitableFor: string[];
};

export type StoreConfig = {
  id: string;
  slug: string;
  name: string;
  segment: string;
  city: string;
  attendantName: string;
  attendantTone: string;
  voiceLang: string;
  primaryColor: string;
  accentColor: string;
  sectors: StoreSector[];
  products: Product[];
  quickPrompts: string[];
  inputPlaceholder: string;
  experienceLabel?: string;
};

export type ChatRole = "customer" | "attendant" | "system";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  products?: Product[];
  actions?: SessionAction[];
  createdAt: number;
};

export type SessionAction =
  | { type: "show_products"; productIds: string[] }
  | { type: "quote"; productIds: string[] }
  | { type: "payment_link"; productIds: string[]; amount: number }
  | { type: "handoff_human" };

export type Quote = {
  id: string;
  storeId: string;
  items: Array<{ productId: string; name: string; price: number; qty: number }>;
  total: number;
  paymentUrl: string;
  createdAt: number;
};
