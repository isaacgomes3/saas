"use client";

import Image from "next/image";

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
  sectorLabel,
  roleLabel = "Atendente virtual",
}: AvatarStageProps) {
  return (
    <div className="avatar-stage">
      <div className="avatar-frame avatar-frame-human" data-mood={mood}>
        <div className="avatar-human-stack">
          <Image
            src={imageSrc}
            alt={`${name}, ${roleLabel} da ${storeName}`}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 40vw"
            className="avatar-human-photo is-visible"
          />
        </div>

        <div className="avatar-human-veil" aria-hidden />

        {mood === "speaking" ? (
          <>
            <div className="avatar-speak-glow" aria-hidden />
            <div className="avatar-voice-meter" aria-hidden>
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </>
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
