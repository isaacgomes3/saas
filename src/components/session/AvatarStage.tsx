"use client";

type AvatarMood = "idle" | "listening" | "speaking" | "thinking";

type AvatarStageProps = {
  name: string;
  mood: AvatarMood;
  storeName: string;
  sectorLabel?: string;
  roleLabel?: string;
};

export function AvatarStage({
  name,
  mood,
  storeName,
  sectorLabel,
  roleLabel = "Atendente virtual",
}: AvatarStageProps) {
  return (
    <div className="avatar-stage">
      <div className="avatar-frame" data-mood={mood}>
        <div className="avatar-glow" aria-hidden />
        <div className="avatar-face" aria-hidden>
          <div className="avatar-hair" />
          <div className="avatar-skin">
            <div className="avatar-eyes">
              <span />
              <span />
            </div>
            <div className={`avatar-mouth mood-${mood}`} />
          </div>
          <div className="avatar-shoulders" />
        </div>
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
