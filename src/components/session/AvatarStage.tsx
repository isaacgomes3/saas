"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type AvatarMood = "idle" | "listening" | "speaking" | "thinking";

type AvatarStageProps = {
  name: string;
  mood: AvatarMood;
  storeName: string;
  imageSrc: string;
  talkFrames?: string[];
  sectorLabel?: string;
  roleLabel?: string;
};

export function AvatarStage({
  name,
  mood,
  storeName,
  imageSrc,
  talkFrames = [],
  sectorLabel,
  roleLabel = "Atendente virtual",
}: AvatarStageProps) {
  const frames = useMemo(() => {
    const list = talkFrames.length ? talkFrames : [imageSrc];
    return Array.from(new Set([imageSrc, ...list]));
  }, [imageSrc, talkFrames]);

  const [frameIndex, setFrameIndex] = useState(0);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (mood !== "speaking" || frames.length < 2) {
      setFrameIndex(0);
      return;
    }

    let active = true;
    let timer: number;

    const tick = () => {
      if (!active) return;
      setFrameIndex((current) => {
        // Evita ficar no quadro neutro tempo demais enquanto fala
        if (frames.length <= 2) return (current + 1) % frames.length;
        const next = 1 + Math.floor(Math.random() * (frames.length - 1));
        return next === current ? (next % (frames.length - 1)) + 1 : next;
      });
      timer = window.setTimeout(tick, 85 + Math.floor(Math.random() * 130));
    };

    timer = window.setTimeout(tick, 80);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [mood, frames.length]);

  useEffect(() => {
    if (mood === "speaking") return;
    let active = true;
    let timer: number;

    const scheduleBlink = () => {
      if (!active) return;
      timer = window.setTimeout(
        () => {
          if (!active) return;
          setBlink(true);
          window.setTimeout(() => {
            if (active) setBlink(false);
            scheduleBlink();
          }, 140);
        },
        2800 + Math.floor(Math.random() * 3200),
      );
    };

    scheduleBlink();
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [mood]);

  const visibleIndex = mood === "speaking" ? frameIndex : 0;

  return (
    <div className="avatar-stage">
      <div
        className={`avatar-frame avatar-frame-human ${blink ? "is-blinking" : ""}`}
        data-mood={mood}
      >
        <div className="avatar-human-stack">
          {frames.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt={index === 0 ? `${name}, ${roleLabel} da ${storeName}` : ""}
              fill
              priority={index === 0}
              sizes="(max-width: 900px) 100vw, 40vw"
              className={`avatar-human-photo ${index === visibleIndex ? "is-visible" : ""}`}
            />
          ))}
          <div className="avatar-jaw-layer" aria-hidden>
            <Image
              src={frames[visibleIndex] ?? imageSrc}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              className="avatar-human-photo is-visible avatar-jaw-photo"
            />
          </div>
        </div>

        <div className="avatar-human-veil" aria-hidden />

        {mood === "speaking" ? (
          <div className="avatar-voice-meter" aria-hidden>
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        ) : null}

        <div className="avatar-status">
          <span className="status-dot" data-mood={mood} />
          {mood === "listening" && "Ouvindo você…"}
          {mood === "speaking" && "Falando…"}
          {mood === "thinking" && "Pensando…"}
          {mood === "idle" && "Pronta para atender"}
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
}
