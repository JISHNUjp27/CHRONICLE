import React from "react";
import useReveal from "../hooks/useReveal";

function Reveal({
  as,
  variant = "up",
  delay = 0,
  className = "",
  style,
  children,
  ...rest
}) {
  const [ref, visible] = useReveal();
  const revealClass = variant === "3d" ? "reveal-3d" : "reveal";
  const Component = as || "div";

  return (
    <Component
      ref={ref}
      className={`${revealClass} ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Component>
  );
}

export default Reveal;
