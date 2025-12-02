interface MessageProps {
  msg: {
    id: string | number;
    role: "user" | "assistant";
    text: string;
    sources?: Array<{ id: string; score: number }>;
  };
}

export default function Message({ msg }: MessageProps) {
  return (
    <div className={msg.role === "user" ? "text-right" : "text-left"}>
      <div
        className={`inline-block p-4 rounded-lg max-w-[85%] ${
          msg.role === "user"
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-muted rounded-bl-none"
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{msg.text}</div>
        {msg.sources && msg.sources.length > 0 && (
          <div className="mt-3 pt-2 border-t border-opacity-20 text-xs text-muted-foreground">
            <span className="font-medium">Sources:</span>{" "}
            {msg.sources
              .map((s) => `${s.id}${s.score ? ` (score: ${s.score.toFixed(2)})` : ""}`)
              .join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}