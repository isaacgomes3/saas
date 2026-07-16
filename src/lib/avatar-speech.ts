/** Grapheme → Oculus viseme (aproximação para pt-BR). */
const CHAR_VISEME: Record<string, string> = {
  a: "aa",
  á: "aa",
  à: "aa",
  â: "aa",
  ã: "aa",
  e: "E",
  é: "E",
  ê: "E",
  i: "I",
  í: "I",
  o: "O",
  ó: "O",
  ô: "O",
  õ: "O",
  u: "U",
  ú: "U",
  p: "PP",
  b: "PP",
  m: "PP",
  f: "FF",
  v: "FF",
  t: "DD",
  d: "DD",
  n: "nn",
  l: "nn",
  r: "RR",
  s: "SS",
  c: "SS",
  z: "SS",
  x: "SS",
  ç: "SS",
  j: "CH",
  g: "kk",
  q: "kk",
  k: "kk",
  h: "aa",
  y: "I",
  w: "U",
};

export type AvatarSpeechPlan = {
  words: string[];
  wtimes: number[];
  wdurations: number[];
  visemes: string[];
  vtimes: number[];
  vdurations: number[];
  durationSec: number;
};

export function buildAvatarSpeechPlan(text: string): AvatarSpeechPlan {
  const words = text
    .replace(/[“”"']/g, "")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean);

  const wtimes: number[] = [];
  const wdurations: number[] = [];
  const visemes: string[] = [];
  const vtimes: number[] = [];
  const vdurations: number[] = [];

  let t = 160;
  for (const word of words) {
    const clean = word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
    const dur = Math.max(160, Math.min(720, clean.length * 68 + 90));
    wtimes.push(t);
    wdurations.push(dur);

    if (clean.length) {
      const step = dur / clean.length;
      [...clean].forEach((ch, index) => {
        const viseme = CHAR_VISEME[ch];
        if (!viseme) return;
        visemes.push(viseme);
        vtimes.push(t + index * step * 0.9);
        vdurations.push(Math.max(45, step));
      });
    } else {
      visemes.push("aa");
      vtimes.push(t);
      vdurations.push(dur * 0.7);
    }

    t += dur + 70;
  }

  if (!words.length) {
    words.push("…");
    wtimes.push(0);
    wdurations.push(400);
    visemes.push("aa");
    vtimes.push(0);
    vdurations.push(300);
    t = 500;
  }

  return {
    words,
    wtimes,
    wdurations,
    visemes,
    vtimes,
    vdurations,
    durationSec: (t + 280) / 1000,
  };
}

export function createSilentBuffer(
  audioContext: AudioContext,
  durationSec: number,
  sampleRate = 22050,
) {
  const frames = Math.max(1, Math.floor(sampleRate * durationSec));
  return audioContext.createBuffer(1, frames, sampleRate);
}
