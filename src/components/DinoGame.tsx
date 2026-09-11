"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

const WIDTH = 480;
const HEIGHT = 150;
const GROUND_Y = HEIGHT - 24;
const GRAVITY = 2600;
const JUMP_VELOCITY = -720;
const RUN_SPEED = 260;
const BEST_SCORE_KEY = "snapdev-dino-best";

const PALETTE = {
  light: { ink: "#131313", ink2: "#a3a3a3", line: "#e5e5e5", brand: "#3d6df2" },
  dark: { ink: "#f2f2f2", ink2: "#71717a", line: "#2c2d33", brand: "#5c85ff" },
};

type Obstacle = { x: number; width: number; height: number };

type GameState = {
  status: "ready" | "running" | "over";
  dinoY: number;
  velocity: number;
  obstacles: Obstacle[];
  distance: number;
  score: number;
  best: number;
  nextSpawn: number;
  lastTime: number | null;
};

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_SCORE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeBest(value: number) {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(value));
  } catch {
    // best-effort only
  }
}

/** A tiny Chrome-dino-style jump game to pass the time while an engineer connects. */
export default function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = WIDTH * dpr;
    canvas.height = HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    const state: GameState = {
      status: "ready",
      dinoY: GROUND_Y,
      velocity: 0,
      obstacles: [],
      distance: 0,
      score: 0,
      best: readBest(),
      nextSpawn: 900,
      lastTime: null,
    };

    const jump = () => {
      if (state.status === "ready") {
        state.status = "running";
      } else if (state.status === "over") {
        state.status = "running";
        state.dinoY = GROUND_Y;
        state.velocity = 0;
        state.obstacles = [];
        state.distance = 0;
        state.score = 0;
        state.nextSpawn = 900;
        return;
      }
      if (state.status === "running" && state.dinoY >= GROUND_Y) {
        state.velocity = JUMP_VELOCITY;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    const onPointerDown = (e: Event) => {
      e.preventDefault();
      jump();
    };

    window.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("pointerdown", onPointerDown);

    let raf = 0;
    const DINO_SIZE = 26;
    const DINO_X = 40;

    const step = (time: number) => {
      const palette = PALETTE[themeRef.current];
      if (state.lastTime === null) state.lastTime = time;
      const dt = Math.min((time - state.lastTime) / 1000, 0.05);
      state.lastTime = time;

      if (state.status === "running") {
        state.velocity += GRAVITY * dt;
        state.dinoY += state.velocity * dt;
        if (state.dinoY > GROUND_Y) {
          state.dinoY = GROUND_Y;
          state.velocity = 0;
        }

        state.distance += RUN_SPEED * dt;
        state.score = Math.floor(state.distance / 10);

        state.nextSpawn -= RUN_SPEED * dt;
        if (state.nextSpawn <= 0) {
          const height = 22 + Math.random() * 18;
          state.obstacles.push({ x: WIDTH + 10, width: 14 + Math.random() * 10, height });
          state.nextSpawn = 180 + Math.random() * 220;
        }

        for (const ob of state.obstacles) ob.x -= RUN_SPEED * dt;
        state.obstacles = state.obstacles.filter((ob) => ob.x + ob.width > -10);

        const dinoTop = state.dinoY - DINO_SIZE;
        for (const ob of state.obstacles) {
          const obTop = GROUND_Y - ob.height;
          const overlapX = DINO_X + DINO_SIZE * 0.75 > ob.x && DINO_X + DINO_SIZE * 0.25 < ob.x + ob.width;
          const overlapY = state.dinoY > obTop + 4;
          if (overlapX && overlapY && dinoTop < GROUND_Y) {
            state.status = "over";
            if (state.score > state.best) {
              state.best = state.score;
              writeBest(state.best);
            }
          }
        }
      }

      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      ctx.strokeStyle = palette.line;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y + 2);
      ctx.lineTo(WIDTH, GROUND_Y + 2);
      ctx.stroke();

      ctx.fillStyle = palette.ink;
      const dinoTop = state.dinoY - DINO_SIZE;
      const squash = state.status === "running" && state.dinoY >= GROUND_Y ? Math.abs(Math.sin(state.distance / 12)) * 3 : 0;
      ctx.fillRect(DINO_X, dinoTop + squash, DINO_SIZE, DINO_SIZE - squash);

      ctx.fillStyle = palette.brand;
      for (const ob of state.obstacles) {
        ctx.fillRect(ob.x, GROUND_Y - ob.height, ob.width, ob.height);
      }

      ctx.fillStyle = palette.ink2;
      ctx.font = "12px ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`Score ${state.score}  ·  Best ${state.best}`, WIDTH - 4, 16);

      ctx.textAlign = "center";
      if (state.status === "ready") {
        ctx.fillText("Press Space or tap to jump", WIDTH / 2, HEIGHT / 2);
      } else if (state.status === "over") {
        ctx.fillStyle = palette.ink;
        ctx.font = "600 13px ui-sans-serif, system-ui, sans-serif";
        ctx.fillText("Game over — tap or press Space to retry", WIDTH / 2, HEIGHT / 2);
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="button"
      tabIndex={0}
      aria-label="Dino jump game — press space or tap to play while you wait"
      className="border-line bg-surface cursor-pointer touch-none rounded-lg border"
      style={{ width: "100%", maxWidth: WIDTH, height: "auto", aspectRatio: `${WIDTH} / ${HEIGHT}` }}
    />
  );
}
