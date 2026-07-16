declare module "@met4citizen/talkinghead" {
  export class TalkingHead {
    constructor(node: HTMLElement, options?: Record<string, unknown>);
    showAvatar(avatar: Record<string, unknown>, onprogress?: unknown): Promise<void>;
    speakAudio(audio: Record<string, unknown>, opt?: Record<string, unknown>): void;
    speakText(text: string, opt?: Record<string, unknown>): void;
    stopSpeaking(): void;
    setMood(mood: string): void;
    lookAtCamera(duration?: number): void;
  }
}
