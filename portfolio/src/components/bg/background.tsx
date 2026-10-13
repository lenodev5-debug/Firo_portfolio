
import { useEffect, useRef } from "react";
import "./StarryNight.css";

export default function StarryNight() {
  const skyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sky = skyRef.current;

    if (!sky) return;

    const starCount = 220;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      star.className = "star";

      const size = Math.random() * 2.5 + 0.5;
      const duration = Math.random() * 4 + 2;
      const delay = Math.random() * 5;

      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.animationDuration = `${duration}s`;
      star.style.animationDelay = `${delay}s`;

      fragment.appendChild(star);
    }

    sky.appendChild(fragment);

    return () => {
      sky.querySelectorAll(".star").forEach((star) => star.remove());
    };
  }, []);

  return (
    <div className="night-sky" ref={skyRef} aria-hidden="true">
      <div className="moon" />

      <div
        className="shooting-star"
        style={
          {
            "--delay": "1s",
            "--top": "15%",
            "--left": "70%",
          } as React.CSSProperties
        }
      />

      <div
        className="shooting-star"
        style={
          {
            "--delay": "5s",
            "--top": "30%",
            "--left": "85%",
          } as React.CSSProperties
        }
      />

      <div
        className="shooting-star"
        style={
          {
            "--delay": "9s",
            "--top": "8%",
            "--left": "45%",
          } as React.CSSProperties
        }
      />
    </div>
  );
}
