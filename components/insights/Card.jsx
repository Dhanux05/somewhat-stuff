import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const PARTICLE_POSITIONS = [
  [8, 18],
  [15, 72],
  [22, 35],
  [34, 84],
  [41, 21],
  [52, 67],
  [63, 29],
  [71, 80],
  [79, 43],
  [86, 16],
  [92, 58],
  [96, 34],
];

export default function Card({
  title,
  description,
  gradientColor = "from-cyan-400/35 via-cyan-300/10 to-transparent",
  index = 1,
  label = "STRATEGY",
  cta = "Read more ->",
}) {
  const [isTouch] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: none), (pointer: coarse)").matches;
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const showBack = isTouch ? isFlipped : isHovered;

  const particles = useMemo(
    () =>
      PARTICLE_POSITIONS.map((position, i) => ({
        id: i,
        left: position[0],
        top: position[1],
        delay: (i + index) * 0.22,
        duration: 7 + ((i + index) % 4),
      })),
    [index],
  );

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * 100;
    const py = ((event.clientY - rect.top) / rect.height) * 100;
    const offsetX = px - 50;
    const offsetY = py - 50;

    setSpotlight({ x: px, y: py });
    setTilt({ x: -offsetY / 8, y: offsetX / 8 });
  };

  const resetInteractiveState = () => {
    setTilt({ x: 0, y: 0 });
    setSpotlight({ x: 50, y: 50 });
  };

  return (
    <motion.article
      className="group relative isolate h-[360px] w-full [perspective:1300px]"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 8 + index, repeat: Infinity, ease: "easeInOut" }}
      onMouseEnter={() => !isTouch && setIsHovered(true)}
      onMouseLeave={() => {
        if (!isTouch) setIsHovered(false);
        resetInteractiveState();
      }}
      onMouseMove={handlePointerMove}
      onClick={() => isTouch && setIsFlipped((prev) => !prev)}
    >
      <motion.div
        className={`pointer-events-none absolute -inset-2 -z-10 rounded-[1.75rem] bg-gradient-to-br ${gradientColor} blur-2xl`}
        animate={{
          opacity: showBack ? 0.85 : 0.55,
          scale: showBack ? 1.06 : 1,
        }}
        transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
      />

      <motion.div
        className="absolute inset-0 rounded-[1.75rem] border border-white/10 bg-slate-950/30"
        style={{
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 24px 50px rgba(0,0,0,0.45)",
        }}
      />

      <motion.div
        className="relative h-full w-full rounded-[1.75rem] [transform-style:preserve-3d]"
        animate={{
          rotateY: showBack ? 180 : 0,
          rotateX: tilt.x,
          rotateYOrigin: "50% 50%",
        }}
        transition={{
          duration: 0.6,
          ease: [0.2, 0.8, 0.2, 1],
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-0 overflow-hidden rounded-[1.75rem] border border-white/15 bg-slate-900/45 p-7 backdrop-blur-xl [backface-visibility:hidden]"
          style={{
            backgroundImage: `radial-gradient(560px circle at ${spotlight.x}% ${spotlight.y}%, rgba(255,255,255,0.14), transparent 45%)`,
          }}
        >
          <div className="pointer-events-none absolute inset-0">
            {particles.map((particle) => (
              <motion.span
                key={particle.id}
                className="absolute h-1 w-1 rounded-full bg-white/35"
                style={{ left: `${particle.left}%`, top: `${particle.top}%` }}
                animate={{ y: [0, -12, 0], opacity: [0.2, 0.7, 0.2] }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="relative flex h-full items-end">
            <h3 className="max-w-[12ch] text-3xl font-semibold tracking-tight text-white md:text-4xl">
              {title}
            </h3>
          </div>
        </div>

        <div
          className="absolute inset-0 overflow-hidden rounded-[1.75rem] border border-white/15 bg-slate-900/70 p-7 [transform:rotateY(180deg)] [backface-visibility:hidden]"
          style={{
            backgroundImage: "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(2,8,23,0.86))",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="mb-4 text-xs font-semibold tracking-[0.2em] text-cyan-200/80">
            {label} {String(index).padStart(2, "0")}
          </div>

          <h3 className="mb-3 text-2xl font-semibold text-white">{title}</h3>
          <p className="mb-6 max-w-[32ch] text-sm leading-6 text-slate-300">{description}</p>

          <button
            type="button"
            className="inline-flex items-center text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200"
          >
            {cta}
          </button>

          <div className="absolute inset-x-7 bottom-6">
            <svg viewBox="0 0 240 60" className="h-12 w-full">
              <motion.path
                d="M2 44 C 35 10, 70 55, 102 30 C 130 10, 155 45, 192 20 C 210 9, 225 16, 238 6"
                fill="none"
                stroke="rgba(45,212,191,0.95)"
                strokeWidth="2.2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0.2 }}
                animate={{ pathLength: 1, opacity: [0.2, 1, 0.35] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

