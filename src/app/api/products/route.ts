import { NextResponse } from "next/server";
import { getStoreBySlug } from "@/lib/stores";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("store") ?? "casa-viva";
  const store = getStoreBySlug(slug);

  if (!store) {
    return NextResponse.json({ error: "Loja não encontrada" }, { status: 404 });
  }

  return NextResponse.json({
    store: {
      id: store.id,
      slug: store.slug,
      name: store.name,
      attendantName: store.attendantName,
      sectors: store.sectors,
    },
    products: store.products,
  });
}
