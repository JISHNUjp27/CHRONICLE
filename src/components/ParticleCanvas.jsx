import React, { useEffect, useRef } from "react";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function ParticleCanvas({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let mouse = { x: -1000, y: -1000, radius: 140 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Create 3D particles (x, y, z where z gives depth)
    const particleCount = Math.min(50, Math.floor((width * height) / 18000));
    const particles = [];
    const colors = ["#8b5cf6", "#22d3ee", "#f472b6", "#a78bfa", "#67e8f9"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.8 + 0.2, // Depth factor
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        baseRadius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handlePointerLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 130;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.18 * ((p1.z + p2.z) / 2);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        // Move with depth speed
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;
        p.pulse += 0.02;

        // Wrap edges smoothly
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Mouse interaction (gentle repulsion)
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {
          const force = (1 - dist / mouse.radius) * 1.5;
          p.x -= (dx / dist) * force * p.z;
          p.y -= (dy / dist) * force * p.z;
        }

        // Draw particle with glow
        const currentRadius = p.baseRadius * (1 + Math.sin(p.pulse) * 0.25) * p.z;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10 * p.z;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity: 0.85 }}
    />
  );
}

export default ParticleCanvas;
