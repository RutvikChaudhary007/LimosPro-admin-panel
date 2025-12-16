import { useEffect, useRef } from "react";

export function useSticky(topOffset: number = 100, ...dependencies: any[]) {
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

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          updateWidth();
          stickyEl.classList.add("fixed");
          stickyEl.style.top = `${topOffset}px`;
        } else {
          stickyEl.classList.remove("fixed");
          stickyEl.style.top = "auto";
          stickyEl.style.width = "auto";
          stickyEl.style.height = "auto";
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
      if (stickyEl.classList.contains("fixed")) {
        updateWidth();
      }
    });

    resizeObserver.observe(sentinelEl);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [...dependencies, topOffset]);

  return { stickyRef, sentinelRef };
}
