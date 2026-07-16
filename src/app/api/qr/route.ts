import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getStoreBySlug } from "@/lib/stores";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeSlug = searchParams.get("store") ?? "casa-viva";
  const sector = searchParams.get("sector") ?? "geral";
  const origin = searchParams.get("origin");

  const store = getStoreBySlug(storeSlug);
  if (!store) {
    return NextResponse.json({ error: "Loja não encontrada" }, { status: 404 });
  }

  const base =
    origin ||
    process.env.NEXT_PUBLIC_APP_URL ||
    request.headers.get("origin") ||
    "http://localhost:3000";

  const url = `${base.replace(/\/$/, "")}/a/${store.slug}/${sector}`;
  const dataUrl = await QRCode.toDataURL(url, {
    margin: 1,
    width: 320,
    color: { dark: "#10231f", light: "#ffffff" },
  });

  return NextResponse.json({ url, qrDataUrl: dataUrl, store: store.name, sector });
}
