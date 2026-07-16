"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { buildAvatarSpeechPlan, createSilentBuffer } from "@/lib/avatar-speech";
import { speakText, stopSpeaking, type VoiceGender } from "@/lib/speech";

export type HumanAvatarHandle = {
  speak: (text: string) => Promise<void>;
  stop: () => void;
};

type HumanAvatarProps = {
  name: string;
  storeName: string;
  roleLabel?: string;
  sectorLabel?: string;
  mood: "idle" | "listening" | "speaking" | "thinking";
  voiceLang?: string;
  voiceGender?: VoiceGender;
  avatarUrl?: string;
  onReadyChange?: (ready: boolean) => void;
};

type TalkingHeadInstance = {
  showAvatar: (avatar: Record<string, unknown>) => Promise<void>;
  speakAudio: (audio: Record<string, unknown>, opt?: Record<string, unknown>) => void;
  stopSpeaking?: () => void;
  setMood?: (mood: string) => void;
  lookAtCamera?: (duration?: number) => void;
};

export const HumanAvatar = forwardRef<HumanAvatarHandle, HumanAvatarProps>(
  function HumanAvatar(
    {
      name,
      storeName,
      roleLabel = "Atendente virtual",
      sectorLabel,
      mood,
      voiceLang = "pt-BR",
      voiceGender = "female",
      avatarUrl = "/avatars3d/sofia.glb",
      onReadyChange,
    },
    ref,
  ) {
    const mountRef = useRef<HTMLDivElement>(null);
    const headRef = useRef<TalkingHeadInstance | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      let disposed = false;
      let head: TalkingHeadInstance | null = null;

      async function boot() {
        if (!mountRef.current) return;
        try {
          // Carrega fora do bundler (TalkingHead usa import() dinâmico incompatível com Turbopack).
          const moduleUrl = "/vendor/talkinghead/talkinghead.mjs";
          const mod = (await (0, eval)(`import("${moduleUrl}")`)) as {
            TalkingHead: new (
              node: HTMLElement,
              opt?: Record<string, unknown>,
            ) => TalkingHeadInstance;
          };

          head = new mod.TalkingHead(mountRef.current, {
            // Visemes vêm do nosso plano pt-BR; não precisamos carregar módulos dinâmicos.
            lipsyncModules: [],
            cameraView: "head",
            cameraDistance: 0,
            cameraZoomEnable: false,
            cameraPanEnable: false,
            cameraRotateEnable: false,
            lightAmbientIntensity: 2.2,
            lightDirectIntensity: 18,
            modelFPS: 30,
            avatarIdleEyeContact: 0.6,
            avatarIdleHeadMove: 0.4,
            avatarSpeakingEyeContact: 0.75,
            avatarSpeakingHeadMove: 0.5,
          }) as TalkingHeadInstance;

          await head.showAvatar({
            url: avatarUrl,
            body: "F",
            avatarMood: "happy",
            lipsyncLang: "en",
          });

          if (disposed) return;
          headRef.current = head;
          setReady(true);
          setLoading(false);
          onReadyChange?.(true);
          head.lookAtCamera?.(500);
        } catch (err) {
          console.error(err);
          if (!disposed) {
            setError("Não foi possível carregar o avatar humanizado.");
            setLoading(false);
            onReadyChange?.(false);
          }
        }
      }

      void boot();

      return () => {
        disposed = true;
        try {
          head?.stopSpeaking?.();
        } catch {
          /* ignore */
        }
        headRef.current = null;
        if (mountRef.current) mountRef.current.innerHTML = "";
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [avatarUrl]);

    useEffect(() => {
      const head = headRef.current;
      if (!head?.setMood) return;
      if (mood === "speaking") head.setMood("happy");
      else head.setMood("neutral");
    }, [mood]);

    useImperativeHandle(ref, () => ({
      async speak(text: string) {
        const head = headRef.current;
        if (!head) {
          await speakText(text, voiceLang, voiceGender);
          return;
        }

        const plan = buildAvatarSpeechPlan(text);
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContext({ sampleRate: 22050 });
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") await ctx.resume();

        const buffer = createSilentBuffer(ctx, plan.durationSec, 22050);
        head.stopSpeaking?.();
        stopSpeaking();

        head.speakAudio(
          {
            audio: buffer,
            words: plan.words,
            wtimes: plan.wtimes,
            wdurations: plan.wdurations,
            visemes: plan.visemes,
            vtimes: plan.vtimes,
            vdurations: plan.vdurations,
          },
          { lipsyncLang: "en" },
        );

        await speakText(text, voiceLang, voiceGender);
        // Garante que a animação labial acompanhe o fim da voz
        await new Promise((resolve) => window.setTimeout(resolve, 180));
      },
      stop() {
        stopSpeaking();
        headRef.current?.stopSpeaking?.();
      },
    }));

    return (
      <div className="avatar-stage">
        <div className="avatar-frame avatar-frame-3d" data-mood={mood}>
          <div ref={mountRef} className="avatar-3d-mount" />
          {loading ? <div className="avatar-3d-loading">Carregando avatar humanizado…</div> : null}
          {error ? <div className="avatar-3d-loading">{error}</div> : null}
          <div className="avatar-status">
            <span className="status-dot" data-mood={mood} />
            {mood === "listening" && "Ouvindo você…"}
            {mood === "speaking" && "Falando…"}
            {mood === "thinking" && "Pensando…"}
            {mood === "idle" && (ready ? "Em videochamada" : "Preparando…")}
          </div>
        </div>
        <div className="avatar-meta">
          <p className="avatar-name">{name}</p>
          <p className="avatar-role">
            {roleLabel} · {storeName}
            {sectorLabel ? ` · ${sectorLabel}` : ""}
          </p>
        </div>
      </div>
    );
  },
);
