import { useEffect, useRef } from "react";

function reducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(hover: none)").matches)
  );
}

function useTilt({ max = 14, lift = -10 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return undefined;

    let frame = 0;
    let rx = 0;
    let ry = 0;
    let mx = 50;
    let my = 50;
    let lifting = false;

    const paint = () => {
      frame = 0;
      el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      el.style.setProperty("--mx", `${mx.toFixed(2)}%`);
      el.style.setProperty("--my", `${my.toFixed(2)}%`);
      el.style.setProperty("--lift", lifting ? `${lift}px` : "0px");
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const handleMove = (event) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      ry = (px - 0.5) * 2 * max;
      rx = (0.5 - py) * 2 * max;
      mx = px * 100;
      my = py * 100;
      lifting = true;
      schedule();
    };

    const handleLeave = () => {
      rx = 0;
      ry = 0;
      mx = 50;
      my = 50;
      lifting = false;
      schedule();
    };

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    el.addEventListener("pointercancel", handleLeave);

    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
      el.removeEventListener("pointercancel", handleLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [max, lift]);

  return ref;
}

export default useTilt;
