import { useEffect, useRef } from "react";

export function useSticky(topOffset: number = 100, activeDependency?: any) {
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stickyEl = stickyRef.current;
    const sentinelEl = sentinelRef.current;
    if (!stickyEl || !sentinelEl) return;

    stickyEl.style.transition = "all 0.3s ease";

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          stickyEl.style.width = `${stickyEl.offsetWidth}px`;
          stickyEl.style.height = `${stickyEl.offsetHeight}px`;
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

    return () => observer.disconnect();
  }, [activeDependency, topOffset]);

  return { stickyRef, sentinelRef };
}
