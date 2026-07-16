import { NextResponse } from "next/server";
import { generateAttendantReplyWithLLM } from "@/lib/conversation";
import { getStoreBySlug } from "@/lib/stores";
import type { ChatMessage } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    storeSlug?: string;
    message?: string;
    history?: ChatMessage[];
  };

  const store = getStoreBySlug(body.storeSlug ?? "");
  if (!store) {
    return NextResponse.json({ error: "Loja não encontrada" }, { status: 404 });
  }

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Mensagem vazia" }, { status: 400 });
  }

  const result = await generateAttendantReplyWithLLM({
    store,
    message,
    history: body.history ?? [],
  });

  return NextResponse.json(result);
}
