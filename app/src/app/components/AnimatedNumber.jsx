"use client";

import { useState, useEffect } from "react";

export default function AnimatedNumber({ value, duration = 0.5, decimals = 0 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const end = Number(value);
    const totalFrames = duration * 60;
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const randomOffset = Math.random() * end * 0.1;
      const current =
        Math.floor(end * progress + randomOffset * (1 - progress) * 100) / 100;

      setDisplay(current);

      if (frame >= totalFrames) {
        setDisplay(end);
        clearInterval(interval);
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [value, duration]);

  return (
    <span>
      {display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
}