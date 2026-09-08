"use client";

import { useEffect, useState } from "react";

/** Matches Tailwind `lg` (1024px) and up. */
export function useIsDesktop(query = "(min-width: 1024px)") {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}
