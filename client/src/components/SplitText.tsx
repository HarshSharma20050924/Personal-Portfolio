import React from "react";
import { motion } from "framer-motion";

interface SplitTextProps {
  children: React.ReactNode; // was string
  className?: string;
  delay?: number;
  wordDelay?: number;
}

function nodeToText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (React.isValidElement(node)) return nodeToText(node.props.children);
  return "";
}

export const SplitText: React.FC<SplitTextProps> = ({
  children,
  className,
  delay = 0,
  wordDelay = 0.05,
}) => {
  const text = nodeToText(children);
  const words = text.trim() ? text.trim().split(/\s+/) : [];

  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block whitespace-nowrap overflow-hidden mr-[0.25em]"
        >
          {Array.from(word).map((char, j) => (
            <motion.span
              key={j}
              className="inline-block"
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                delay: delay + i * wordDelay + j * 0.02,
              }}
            >
              {char}
            </motion.span>
          ))}
          {/* keep the space between words visually */}
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </span>
  );
};
