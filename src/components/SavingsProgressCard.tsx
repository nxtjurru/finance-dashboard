import { useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Target, Trophy, TrendingUp, ChevronUp, ChevronDown } from "lucide-react";
import { useStore } from "../store/useStore";
import AnimatedNumber from "./AnimatedNumber";

export default function SavingsProgressCard() {
  const theme = useStore((s) => s.theme);
  const role = useStore((s) => s.role);
  const userProfile = useStore((s) => s.userProfile);
  const setUserProfile = useStore((s) => s.setUserProfile);
  const { currencySymbol } = useStore((s) => s.appSettings);

  const { savingsGoal, savedThisMonth } = userProfile;
  const effectiveGoal = savingsGoal;
  const effectiveSaved = savedThisMonth;
  const percentage = effectiveGoal > 0 ? (effectiveSaved / effectiveGoal) * 100 : 0;
  const isOverGoal = percentage > 100;
  const isAtGoal = percentage >= 100;

  const textPrimary = theme === "dark" ? "text-on-surface" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-on-surface-variant" : "text-gray-500";

  // Drag to change savedThisMonth
  const barRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handleBarMouseDown = useCallback((e: React.MouseEvent) => {
    if (role !== "admin") return;
    dragging.current = true;
    e.preventDefault();

    const updateFromMouse = (clientX: number) => {
      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const fraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const maxValue = effectiveGoal * 1.5;
      const newSaved = Math.round(fraction * maxValue);
      setUserProfile({ savedThisMonth: newSaved });
    };

    updateFromMouse(e.clientX);

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      updateFromMouse(ev.clientX);
    };
    const onMouseUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [role, effectiveGoal, setUserProfile]);

  return (
    <div
      className={`rounded-3xl p-6 relative overflow-hidden transition-all duration-500 ${
        isOverGoal
          ? "mesh-gradient-rainbow"
          : theme === "dark"
            ? "bg-surface-container-low"
            : "bg-white shadow-sm"
      } ${isAtGoal ? "animate-pulse-glow" : ""}`}
    >
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors duration-500 ${
                isOverGoal
                  ? "bg-black/20"
                  : isAtGoal
                    ? "bg-primary-dim/20"
                    : theme === "dark"
                      ? "bg-surface-container-high"
                      : "bg-gray-100"
              }`}
            >
              {isOverGoal ? (
                <Trophy size={18} className={isOverGoal ? "text-black/70" : "text-primary-dim"} />
              ) : isAtGoal ? (
                <Target size={18} className="text-primary-dim" />
              ) : (
                <TrendingUp size={18} className={textSecondary} />
              )}
            </div>
            <div>
              <h3
                className={`text-sm font-bold transition-colors duration-500 ${
                  isOverGoal ? "text-black" : textPrimary
                }`}
              >
                Monthly Savings Goal
              </h3>
              <p
                className={`text-xs transition-colors duration-500 ${
                  isOverGoal ? "text-black/60" : textSecondary
                }`}
              >
                {isOverGoal
                  ? "Outstanding performance!"
                  : isAtGoal
                    ? "Goal reached!"
                    : `${currencySymbol}${effectiveSaved.toLocaleString()} of ${currencySymbol}${effectiveGoal.toLocaleString()}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Saved This Month up/down */}
            {role === "admin" && (
              <div className={`flex flex-col items-center gap-0.5 rounded-xl p-1.5 ${
                isOverGoal ? "bg-black/10" : theme === "dark" ? "bg-surface-container-high" : "bg-gray-100"
              }`}>
                <p className={`text-[9px] uppercase tracking-wider font-semibold mb-0.5 ${
                  isOverGoal ? "text-black/50" : textSecondary
                }`}>Saved</p>
                <button
                  onClick={() => setUserProfile({ savedThisMonth: effectiveSaved + 500 })}
                  className={`p-0.5 rounded hover:opacity-70 transition-opacity ${
                    isOverGoal ? "text-black/70" : "text-primary-dim"
                  }`}
                  title="Increase saved amount by ₹500"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => setUserProfile({ savedThisMonth: Math.max(0, effectiveSaved - 500) })}
                  className={`p-0.5 rounded hover:opacity-70 transition-opacity ${
                    isOverGoal ? "text-black/70" : "text-primary-dim"
                  }`}
                  title="Decrease saved amount by ₹500"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
            )}

            {/* Goal up/down */}
            {role === "admin" && (
              <div className={`flex flex-col items-center gap-0.5 rounded-xl p-1.5 ${
                isOverGoal ? "bg-black/10" : theme === "dark" ? "bg-surface-container-high" : "bg-gray-100"
              }`}>
                <p className={`text-[9px] uppercase tracking-wider font-semibold mb-0.5 ${
                  isOverGoal ? "text-black/50" : textSecondary
                }`}>Goal</p>
                <button
                  onClick={() => setUserProfile({ savingsGoal: effectiveGoal + 500 })}
                  className={`p-0.5 rounded hover:opacity-70 transition-opacity ${
                    isOverGoal ? "text-black/70" : textSecondary
                  }`}
                  title="Increase goal by ₹500"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => setUserProfile({ savingsGoal: Math.max(500, effectiveGoal - 500) })}
                  className={`p-0.5 rounded hover:opacity-70 transition-opacity ${
                    isOverGoal ? "text-black/70" : textSecondary
                  }`}
                  title="Decrease goal by ₹500"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
            )}

            <div className="text-right">
              <AnimatedNumber
                value={percentage}
                suffix="%"
                decimals={0}
                className={`text-2xl font-extrabold transition-colors duration-500 ${
                  isOverGoal ? "text-black" : isAtGoal ? "text-primary-dim" : textPrimary
                }`}
              />
            </div>
          </div>
        </div>

        {/* Drag hint for admin */}
        {role === "admin" && (
          <p className={`text-[10px] mb-1.5 ${isOverGoal ? "text-black/50" : textSecondary}`}>
            Drag the bar to adjust saved amount
          </p>
        )}

        {/* Progress Bar — draggable for admin */}
        <div className="relative">
          <div
            ref={barRef}
            onMouseDown={handleBarMouseDown}
            className={`w-full rounded-full overflow-hidden transition-all duration-500 ${
              isOverGoal
                ? "bg-black/15"
                : theme === "dark"
                  ? "bg-surface-container-high"
                  : "bg-gray-200"
            } ${role === "admin" ? "cursor-ew-resize" : ""}`}
            style={{ height: isOverGoal ? 20 : isAtGoal ? 16 : 12 }}
          >
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: isOverGoal
                  ? "rgba(255,255,255,0.7)"
                  : "#a6ef27",
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{
                boxShadow: isOverGoal
                  ? "0 0 24px rgba(255, 255, 255, 0.6)"
                  : isAtGoal
                    ? "0 0 15px rgba(166, 239, 39, 0.4)"
                    : "none",
              }}
            />
          </div>

          {/* Overflow indicator for >100% */}
          {isOverGoal && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: `${Math.min(percentage - 100, 100)}%`, opacity: 1 }}
              transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, rgba(255,215,0,0.3), rgba(255,165,0,0.6))",
                boxShadow: "0 0 25px rgba(255, 165, 0, 0.4)",
              }}
            />
          )}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: isOverGoal ? "#FFD700" : "#a6ef27" }}
              />
              <span
                className={`text-xs ${isOverGoal ? "text-black/60" : textSecondary}`}
              >
                Saved
              </span>
              <span
                className={`text-xs font-semibold ${isOverGoal ? "text-black" : textPrimary}`}
              >
                {currencySymbol}{effectiveSaved.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${
                  isOverGoal
                    ? "bg-black/30"
                    : theme === "dark"
                      ? "bg-outline-variant"
                      : "bg-gray-300"
                }`}
              />
              <span
                className={`text-xs ${isOverGoal ? "text-black/60" : textSecondary}`}
              >
                Goal
              </span>
              <span
                className={`text-xs font-semibold ${isOverGoal ? "text-black" : textPrimary}`}
              >
                {currencySymbol}{effectiveGoal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Celebration badge */}
          <AnimatePresence>
            {isOverGoal && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm"
              >
                <Sparkles size={12} className="text-yellow-300" />
                <span className="text-xs font-bold text-black">
                  +{currencySymbol}{(effectiveSaved - effectiveGoal).toLocaleString()} over goal!
                </span>
              </motion.div>
            )}
            {isAtGoal && !isOverGoal && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-dim/20"
              >
                <Target size={12} className="text-primary-dim" />
                <span className="text-xs font-bold text-primary-dim">Goal reached!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
