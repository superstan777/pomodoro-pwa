import { useState, useEffect, useRef } from "react";

const POMODORO = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;

type Mode = "pomodoro" | "short" | "long";

const Timer = () => {
  const [secondsLeft, setSecondsLeft] = useState<number>(POMODORO);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [mode, setMode] = useState<Mode>("pomodoro");
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [wasStartedManually, setWasStartedManually] = useState<boolean>(false);

  const timeoutRef = useRef<number | null>(null);

  const tick = () => {
    setSecondsLeft((prev) => {
      if (prev > 1) {
        timeoutRef.current = window.setTimeout(tick, 1000);
        return prev - 1;
      } else {
        setIsRunning(false);
        handleSessionEnd();
        return 0;
      }
    });
  };

  const startTimer = () => {
    if (isRunning) return;
    setWasStartedManually(true);
    setIsRunning(true);
    timeoutRef.current = window.setTimeout(tick, 1000);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    setWasStartedManually(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const resetTimer = () => {
    pauseTimer();
    switch (mode) {
      case "pomodoro":
        setSecondsLeft(POMODORO);
        break;
      case "short":
        setSecondsLeft(SHORT_BREAK);
        break;
      case "long":
        setSecondsLeft(LONG_BREAK);
        break;
    }
  };

  const handleSessionEnd = () => {
    if (mode === "pomodoro") {
      const newCycle = cycleCount + 1;
      setCycleCount(newCycle);
      if (newCycle % 4 === 0) {
        setMode("long");
        setSecondsLeft(LONG_BREAK);
      } else {
        setMode("short");
        setSecondsLeft(SHORT_BREAK);
      }
    } else {
      setMode("pomodoro");
      setSecondsLeft(POMODORO);
    }
  };

  useEffect(() => {
    if (wasStartedManually && !isRunning && secondsLeft > 0) {
      timeoutRef.current = window.setTimeout(() => {
        startTimer();
      }, 500);
    }
  }, [secondsLeft, isRunning, wasStartedManually]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <p className="text-black">Cycle count: {cycleCount}</p>

      <div className="text-6xl font-mono dark:text-black">
        {formatTime(secondsLeft)}
      </div>
      <div className="space-x-2">
        <button onClick={startTimer} className="btn">
          Start
        </button>
        <button onClick={pauseTimer} className="btn">
          Pause
        </button>
        <button onClick={resetTimer} className="btn">
          Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;
