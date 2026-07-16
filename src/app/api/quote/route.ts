import { NextResponse } from "next/server";
import { getStoreBySlug } from "@/lib/stores";
import type { Quote } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    storeSlug?: string;
    productIds?: string[];
  };

  const store = getStoreBySlug(body.storeSlug ?? "");
  if (!store) {
    return NextResponse.json({ error: "Loja não encontrada" }, { status: 404 });
  }

  const ids = body.productIds ?? [];
  const items = ids
    .map((id) => store.products.find((product) => product.id === id))
    .filter(Boolean)
    .map((product) => ({
      productId: product!.id,
      name: product!.name,
      price: product!.price,
      qty: 1,
    }));

  if (!items.length) {
    return NextResponse.json({ error: "Nenhum produto selecionado" }, { status: 400 });
  }

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const quoteId = `orc-${Date.now().toString(36)}`;

  const quote: Quote = {
    id: quoteId,
    storeId: store.id,
    items,
    total,
    paymentUrl: `/pagamento/${quoteId}?loja=${store.slug}&total=${total}`,
    createdAt: Date.now(),
  };

  return NextResponse.json({ quote });
}
