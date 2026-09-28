import { useEffect, useRef } from "react";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(hover: none)").matches)
  );
}

function GlowPointer() {
  const pointerRef = useRef(null);

  useEffect(() => {
    const el = pointerRef.current;
    if (!el || prefersReducedMotion()) return undefined;

    let targetX = -200;
    let targetY = -200;
    let currentX = -200;
    let currentY = -200;
    let rafId = 0;
    let isVisible = false;

    const onPointerMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        el.style.opacity = "1";
      }
    };

    const onPointerLeave = () => {
      isVisible = false;
      el.style.opacity = "0";
    };

    const loop = () => {
      // Smooth interpolation for luxury feel
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      el.style.transform = `translate3d(${currentX - 250}px, ${currentY - 250}px, 0)`;
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={pointerRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 -z-5 h-[500px] w-[500px] rounded-full opacity-0 transition-opacity duration-500 will-change-transform"
      style={{
        background:
          "radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(34, 211, 238, 0.06) 40%, transparent 70%)",
        filter: "blur(40px)",
      }}
    />
  );
}

export default GlowPointer;
