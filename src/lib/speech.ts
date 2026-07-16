export type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

export type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
};

export type VoiceGender = "female" | "male";

const FEMALE_HINTS = [
  "female",
  "feminina",
  "woman",
  "maria",
  "francisca",
  "luciana",
  "fernanda",
  "helena",
  "joana",
  "rafaela",
  "vitória",
  "vitoria",
  "gina",
  "lucia",
  "lúcia",
  "amalia",
  "amália",
  "ines",
  "inês",
  "sara",
  "sofia",
  "ana",
  "camila",
  "julia",
  "júlia",
  "microsoft maria",
  "microsoft francisca",
];

const MALE_HINTS = [
  "male",
  "masculina",
  "man",
  "daniel",
  "antonio",
  "antônio",
  "felipe",
  "ricardo",
  "paulo",
  "joao",
  "joão",
  "microsoft antonio",
  "microsoft antônio",
  "microsoft daniel",
];

export function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return Promise.resolve([]);
  }

  const existing = window.speechSynthesis.getVoices();
  if (existing.length) return Promise.resolve(existing);

  return new Promise((resolve) => {
    const done = () => {
      window.speechSynthesis.onvoiceschanged = null;
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.onvoiceschanged = done;
    // Fallback caso o evento não dispare
    window.setTimeout(done, 350);
  });
}

function scoreVoice(voice: SpeechSynthesisVoice, lang: string, gender: VoiceGender) {
  const hay = `${voice.name} ${voice.lang}`.toLowerCase();
  let score = 0;

  if (voice.lang === lang) score += 12;
  else if (voice.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase())) score += 7;
  else if (voice.lang.toLowerCase().startsWith("pt")) score += 5;
  else return -100;

  const femaleHit = FEMALE_HINTS.some((hint) => hay.includes(hint));
  const maleHit = MALE_HINTS.some((hint) => hay.includes(hint));

  if (gender === "female") {
    if (femaleHit) score += 20;
    if (maleHit) score -= 25;
  } else {
    if (maleHit) score += 20;
    if (femaleHit) score -= 25;
  }

  // Prefere vozes locais quando disponíveis
  if (voice.localService) score += 2;

  return score;
}

export async function pickVoice(lang = "pt-BR", gender: VoiceGender = "female") {
  const voices = await loadVoices();
  if (!voices.length) return null;

  const ranked = [...voices]
    .map((voice) => ({ voice, score: scoreVoice(voice, lang, gender) }))
    .filter((item) => item.score > -50)
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.voice ?? null;
}

export async function speakText(
  text: string,
  lang = "pt-BR",
  gender: VoiceGender = "female",
) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return;
  }

  const voice = await pickVoice(lang, gender);

  return new Promise<void>((resolve) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0;

    if (voice) {
      utterance.voice = voice;
      const name = voice.name.toLowerCase();
      const looksMale = MALE_HINTS.some((hint) => name.includes(hint));
      // Se só houver voz masculina disponível, sobe o pitch para soar mais feminina.
      utterance.pitch = gender === "female" && looksMale ? 1.25 : gender === "female" ? 1.08 : 1;
    } else {
      utterance.pitch = gender === "female" ? 1.2 : 1;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
