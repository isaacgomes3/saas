"use client";

import { useEffect, useRef, useState, useTransition, type CSSProperties } from "react";
import { AvatarStage } from "@/components/session/AvatarStage";
import { CheckoutPanel } from "@/components/session/CheckoutPanel";
import { ProductShelf } from "@/components/session/ProductShelf";
import { Transcript } from "@/components/session/Transcript";
import { buildGreeting } from "@/lib/conversation";
import {
  getSpeechRecognition,
  speakText,
  stopSpeaking,
  type SpeechRecognitionLike,
} from "@/lib/speech";
import { isDentalClinic } from "@/lib/stores";
import type { ChatMessage, Product, Quote, StoreConfig } from "@/lib/types";

type AttendantSessionProps = {
  store: StoreConfig;
  sectorId?: string;
};

type AvatarMood = "idle" | "listening" | "speaking" | "thinking";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AttendantSession({ store, sectorId }: AttendantSessionProps) {
  const sector =
    store.sectors.find((item) => item.id === sectorId) ??
    store.sectors.find((item) => item.id === "geral") ??
    store.sectors[0];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mood, setMood] = useState<AvatarMood>("idle");
  const [mediaReady, setMediaReady] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [draft, setDraft] = useState("");
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [handoff, setHandoff] = useState(false);
  const [pending, startTransition] = useTransition();
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const bootRef = useRef(false);

  useEffect(() => {
    if (bootRef.current) return;
    bootRef.current = true;
    const greeting = buildGreeting(store, sector.id);
    setMessages([greeting]);
    setMood("speaking");
    void speakText(greeting.text, store.voiceLang, store.voiceGender).finally(() =>
      setMood("idle"),
    );
  }, [store, sector.id]);

  async function enableMedia() {
    setMediaError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setMediaReady(true);
    } catch {
      setMediaError(
        "Não foi possível acessar câmera/microfone. Você ainda pode digitar ou usar só o microfone do navegador.",
      );
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMediaReady(true);
      } catch {
        setMediaReady(true);
      }
    }
  }

  async function sendMessage(text: string) {
    const cleaned = text.trim();
    if (!cleaned || pending) return;

    stopSpeaking();
    const customerMessage: ChatMessage = {
      id: uid(),
      role: "customer",
      text: cleaned,
      createdAt: Date.now(),
    };

    const nextHistory = [...messages, customerMessage];
    setMessages(nextHistory);
    setDraft("");
    setMood("thinking");

    startTransition(async () => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storeSlug: store.slug,
            message: cleaned,
            history: nextHistory,
          }),
        });
        const data = (await response.json()) as {
          reply: string;
          products?: Product[];
          actions?: Array<{
            type: string;
            productIds?: string[];
            amount?: number;
          }>;
        };

        const attendantMessage: ChatMessage = {
          id: uid(),
          role: "attendant",
          text: data.reply,
          products: data.products,
          createdAt: Date.now(),
        };

        setMessages((prev) => [...prev, attendantMessage]);
        if (data.products?.length) {
          setVisibleProducts(data.products);
        }

        for (const action of data.actions ?? []) {
          if (action.type === "handoff_human") setHandoff(true);
          if (action.type === "quote" || action.type === "payment_link") {
            const quoteResponse = await fetch("/api/quote", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                storeSlug: store.slug,
                productIds: action.productIds,
              }),
            });
            const quoteData = (await quoteResponse.json()) as { quote: Quote };
            setQuote(quoteData.quote);
          }
        }

        setMood("speaking");
        await speakText(data.reply, store.voiceLang, store.voiceGender);
        setMood("idle");
      } catch {
        setMood("idle");
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "attendant",
            text: "Tive um problema para responder agora. Pode repetir, por favor?",
            createdAt: Date.now(),
          },
        ]);
      }
    });
  }

  function toggleListen() {
    const Recognition = getSpeechRecognition();
    if (!Recognition) {
      setMediaError("Seu navegador não suporta reconhecimento de voz. Use o campo de texto.");
      return;
    }

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      setMood("idle");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = store.voiceLang;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) finalText += result[0].transcript;
      }
      if (finalText.trim()) {
        void sendMessage(finalText.trim());
      }
    };
    recognition.onerror = () => {
      setListening(false);
      setMood("idle");
    };
    recognition.onend = () => {
      setListening(false);
      if (mood === "listening") setMood("idle");
    };

    recognition.start();
    setListening(true);
    setMood("listening");
  }

  function onSelectProduct(product: Product) {
    void sendMessage(`Quero saber mais sobre o ${product.name} e ver se posso comprar.`);
  }

  const dental = isDentalClinic(store);

  return (
    <div
      className={`session-shell ${dental ? "session-dental" : ""}`}
      style={
        {
          "--store-brand": store.primaryColor,
          "--store-accent": store.accentColor,
        } as CSSProperties
      }
    >
      <header className="session-top">
        <div>
          <p className="brand-mark">Presença</p>
          <h1>{store.name}</h1>
        </div>
        <p className="sector-chip">{sector.label}</p>
      </header>

      <div className="session-grid">
        <section className="session-stage">
          <AvatarStage
            name={store.attendantName}
            mood={mood}
            storeName={store.name}
            imageSrc={store.attendantImage}
            talkFrames={store.attendantTalkFrames}
            sectorLabel={sector.label}
            roleLabel={store.experienceLabel}
          />

          <div className="customer-camera">
            <video ref={videoRef} muted playsInline autoPlay />
            {!mediaReady ? (
              <div className="media-gate">
                <p>Para conversar por voz como em uma videochamada, permita câmera e microfone.</p>
                <button type="button" className="btn-primary" onClick={() => void enableMedia()}>
                  Ativar câmera e microfone
                </button>
              </div>
            ) : null}
          </div>
          {mediaError ? <p className="media-error">{mediaError}</p> : null}
        </section>

        <section className="session-chat">
          <Transcript messages={messages} attendantName={store.attendantName} />
          <ProductShelf products={visibleProducts} onSelect={onSelectProduct} />

          <form
            className="composer"
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage(draft);
            }}
          >
            <button
              type="button"
              className={`mic-btn ${listening ? "is-live" : ""}`}
              onClick={toggleListen}
              aria-pressed={listening}
              aria-label={listening ? "Parar de ouvir" : "Falar com o atendente"}
            >
              <span className="mic-icon" aria-hidden>
                {listening ? "●" : "◉"}
              </span>
            </button>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={store.inputPlaceholder}
              aria-label="Mensagem para o atendente"
            />
            <button type="submit" className="btn-primary" disabled={pending || !draft.trim()}>
              Enviar
            </button>
          </form>

          <div className="quick-prompts">
            {store.quickPrompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => void sendMessage(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
        </section>
      </div>

      <CheckoutPanel
        quote={quote}
        handoff={handoff}
        dental={dental}
        onClose={() => {
          setQuote(null);
          setHandoff(false);
        }}
        onPay={() => {
          if (quote) window.location.href = quote.paymentUrl;
        }}
      />
    </div>
  );
}
