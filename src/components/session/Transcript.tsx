"use client";

import type { ChatMessage } from "@/lib/types";

type TranscriptProps = {
  messages: ChatMessage[];
  attendantName: string;
};

export function Transcript({ messages, attendantName }: TranscriptProps) {
  return (
    <div className="transcript" aria-live="polite">
      {messages.map((message) => (
        <div key={message.id} className={`bubble bubble-${message.role}`}>
          <span className="bubble-label">
            {message.role === "attendant" ? attendantName : "Você"}
          </span>
          <p>{message.text}</p>
        </div>
      ))}
    </div>
  );
}
