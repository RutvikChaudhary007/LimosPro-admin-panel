import { useEffect, useRef, useState } from "react";

export function useIsTruncated(lines: number = 2) {
  const ref = useRef<HTMLElement | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      const style = globalThis.getComputedStyle(el);

      const lineHeight = parseFloat(style.lineHeight);
      if (!lineHeight) return;

      const maxHeight = lineHeight * lines;
      const actualHeight = el.clientHeight;

      setIsTruncated(actualHeight >= maxHeight - 1);
    };

    globalThis.requestAnimationFrame(check);

    globalThis.addEventListener("resize", check);
    return () => globalThis.removeEventListener("resize", check);
  }, [lines]);

  return { ref, isTruncated };
}
