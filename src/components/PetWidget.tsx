/**
 * PetWidget — animated emoji companion.
 *
 * Behaviour
 * ─────────
 * • Sits still between animations.
 * • Every 5–6.5 s it plays a one-shot animation, then returns to rest.
 * • When `clickable` is true (admin mode), clicking immediately plays
 *   the animation and resets the idle timer.
 */

import { memo, useEffect, useRef, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import type { PetId } from "../store/useStore";

// ── Per-pet animation config ──────────────────────────────────────────────

type Frames = Record<string, number[]>;

interface PetConfig {
  emoji: string;
  name: string;
  frames: Frames;
  /** Total duration of one animation cycle in seconds */
  duration: number;
}

/**
 * All keyframe arrays must start AND end at the neutral value (0 / 1)
 * so the emoji naturally returns to its resting pose after each play.
 */
const PET_CONFIG: Record<PetId, PetConfig> = {
  cat: {
    emoji: "🐱",
    name: "Cat",
    // Slow blink (scaleY dip) → head tilt left then right → gentle stretch
    frames: {
      y:      [0,  0,  -3,  -3,  -2,   0,   0,  0],
      rotate: [0, -6,   0,   6,   0,  -3,   0,  0],
      scaleY: [1,  1,   1, 0.80,  1,   1,   1,  1],
      scaleX: [1, 1.06, 1,   1, 1.06,  1,   1,  1],
    },
    duration: 2.0,
  },

  dog: {
    emoji: "🐶",
    name: "Dog",
    // Triple excited bounce + rotate (simulates tail wag / spin)
    frames: {
      y:      [0, -14,  0,  -9,  0,  -5,  0, 0],
      rotate: [0,   9, -9,   5, -5,   2,  0, 0],
      scale:  [1, 1.09,  1, 1.05, 1, 1.02, 1, 1],
    },
    duration: 1.5,
  },

  bird: {
    emoji: "🐦",
    name: "Bird",
    // Rapid head-bob sequence + slight sway — mimics chirping / pecking
    frames: {
      y:      [0,  -9,  0,  -7,  0,  -5,  0, 0],
      x:      [0,   2, -2,   1, -1,   0,  0, 0],
      rotate: [0,  -8,  8,  -5,  5,   0,  0, 0],
    },
    duration: 1.1,
  },

  fish: {
    emoji: "🐠",
    name: "Fish",
    // Sinusoidal swim arc — left then right, fading to rest
    frames: {
      x:      [0, -11,  9,  -7,  5,  -2,  0, 0],
      rotate: [0, -11,  9,  -6,  5,  -2,  0, 0],
    },
    duration: 2.2,
  },
};

// ── Component ─────────────────────────────────────────────────────────────

interface Props {
  petId: PetId;
  size?: number;
  /** When true, clicking triggers the animation immediately */
  clickable?: boolean;
  /** Min ms between auto-plays (default 5 000) */
  idleMin?: number;
  /** Max ms between auto-plays (default 6 500) */
  idleMax?: number;
  className?: string;
}

export const PetWidget = memo(function PetWidget({
  petId,
  size = 72,
  clickable = false,
  idleMin = 5000,
  idleMax = 6500,
  className = "",
}: Props) {
  const cfg = PET_CONFIG[petId] ?? PET_CONFIG.cat;
  const controls = useAnimation();

  // Refs let the click handler reach into the effect's closures
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playRef   = useRef<() => Promise<void>>(async () => {});
  const resetRef  = useRef<() => void>(() => {});
  const busyRef   = useRef(false);

  // ── Core animation loop ───────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    /** Play one animation cycle, snap back to neutral when done. */
    const playOnce = async () => {
      if (cancelled || busyRef.current) return;
      busyRef.current = true;
      await controls.start({
        ...cfg.frames,
        transition: { duration: cfg.duration, ease: "easeInOut" },
      });
      if (!cancelled) {
        // Ensure neutral pose regardless of floating-point drift
        controls.set({ y: 0, x: 0, rotate: 0, scale: 1, scaleX: 1, scaleY: 1 });
      }
      busyRef.current = false;
    };

    /** Queue the next idle period, then play. */
    const scheduleNext = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      const delay = idleMin + Math.random() * (idleMax - idleMin);
      timerRef.current = setTimeout(async () => {
        await playOnce();
        if (!cancelled) scheduleNext();
      }, delay);
    };

    // Expose to click handler
    playRef.current  = playOnce;
    resetRef.current = scheduleNext;

    scheduleNext();

    return () => {
      cancelled = true;
      busyRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      controls.stop();
    };
  // Only re-run when the pet or timing changes — controls is stable
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petId, idleMin, idleMax]);

  // ── Click handler ─────────────────────────────────────────────────────
  const handleClick = useCallback(() => {
    if (!clickable) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    busyRef.current = false; // allow re-trigger mid-animation
    playRef.current().then(() => resetRef.current());
  }, [clickable]);

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div
      onClick={handleClick}
      style={{ width: size, height: size, cursor: clickable ? "pointer" : "default" }}
      className={`flex items-center justify-center select-none ${className}`}
      title={clickable ? `Click to play!` : undefined}
    >
      <motion.span
        animate={controls}
        style={{ display: "inline-block", fontSize: Math.round(size * 0.68) }}
      >
        {cfg.emoji}
      </motion.span>
    </div>
  );
});

export default PetWidget;
