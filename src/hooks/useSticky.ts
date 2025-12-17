import { useEffect, useRef } from "react";

export function useSticky(
  topOffset: number = 100,
  minWidth: number = 0,
  ...dependencies: any[]
) {
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stickyEl = stickyRef.current;
    const sentinelEl = sentinelRef.current;
    if (!stickyEl || !sentinelEl) return;

    stickyEl.style.transition = "top 0.3s ease";

    const updateWidth = () => {
      const rect = sentinelEl.getBoundingClientRect();
      stickyEl.style.width = `${rect.width}px`;
    };

    const resetSticky = () => {
      stickyEl.classList.remove("fixed");
      stickyEl.style.top = "auto";
      stickyEl.style.width = "auto";
      stickyEl.style.height = "auto";
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      if (minWidth > 0 && globalThis.innerWidth < minWidth) {
        resetSticky();
        return;
      }

      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          updateWidth();
          stickyEl.classList.add("fixed");
          stickyEl.style.top = `${topOffset}px`;
        } else {
          resetSticky();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: 0,
      rootMargin: `-${topOffset}px 0px 0px 0px`,
    });

    observer.observe(sentinelEl);

    const resizeObserver = new ResizeObserver(() => {
      if (minWidth > 0 && globalThis.innerWidth < minWidth) {
        resetSticky();
        return;
      }

      if (stickyEl.classList.contains("fixed")) {
        updateWidth();
      }
    });

    resizeObserver.observe(sentinelEl);

    // Also listen to window resize to handle the breakdown point dynamically
    const handleWindowResize = () => {
      if (minWidth > 0 && globalThis.innerWidth < minWidth) {
        resetSticky();
      } else {
        updateWidth();
      }
    };

    globalThis.addEventListener("resize", handleWindowResize);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      globalThis.removeEventListener("resize", handleWindowResize);
    };
  }, [...dependencies, topOffset, minWidth]);

  return { stickyRef, sentinelRef };
}
