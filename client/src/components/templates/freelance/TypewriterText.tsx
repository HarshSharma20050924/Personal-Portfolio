import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  startDelay?: number;
  showCursor?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 10,
  startDelay = 0,
  showCursor = true,
}) => {
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");
    setIsComplete(false);

    const start = () => {
      const tick = () => {
        indexRef.current += 1;

        setDisplayed(text.slice(0, indexRef.current));

        if (indexRef.current >= text.length) {
          setIsComplete(true);
          return;
        }

        timeoutRef.current = window.setTimeout(tick, speed);
      };

      tick();
    };

    const delayTimer = window.setTimeout(start, startDelay);

    return () => {
      clearTimeout(delayTimer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed, startDelay]);

  return (
    <span className="relative inline-block">
      <ReactMarkdown>{displayed}</ReactMarkdown>

      {showCursor && !isComplete && (
        <span
          className="inline-block ml-[2px] w-[2px] h-[1em] bg-blue-400 align-middle animate-pulse"
          style={{
            animationDuration: "1s",
          }}
        />
      )}
    </span>
  );
};
