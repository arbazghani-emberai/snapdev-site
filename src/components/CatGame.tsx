"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

const WIDTH = 480;
const HEIGHT = 150;
const GROUND_Y = HEIGHT - 24;
const GRAVITY = 2600;
const JUMP_VELOCITY = -720;
const RUN_SPEED = 260;
const BEST_SCORE_KEY = "snapdev-cat-best";

const PALETTE = {
  light: { ink: "#131313", ink2: "#a3a3a3", line: "#e5e5e5", brand: "#3d6df2", surface: "#ffffff" },
  dark: { ink: "#f2f2f2", ink2: "#71717a", line: "#2c2d33", brand: "#5c85ff", surface: "#17181c" },
};

const CAT_W = 32;
const CAT_H = 28;

/** A blocky cat silhouette (body, a curled tail, a round head with pointed
 *  ears and an eye) with stepping legs while running and a tucked pose in
 *  the air - the Chrome-dino-game shorthand for "you're waiting for
 *  something", played with a cat instead of a T-rex. */
function drawCat(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  ink: string,
  surface: string,
  airborne: boolean,
  legPhase: 0 | 1,
) {
  const bodyTop = groundY - CAT_H;

  // Tail, curling up off the back.
  ctx.strokeStyle = ink;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x + 3, bodyTop + 14);
  ctx.quadraticCurveTo(x - 6, bodyTop + 10, x - 2, bodyTop + 2);
  ctx.quadraticCurveTo(x, bodyTop - 2, x + 4, bodyTop + 1);
  ctx.stroke();

  ctx.fillStyle = ink;

  // Body.
  ctx.fillRect(x + 4, bodyTop + 10, 18, 12);

  // Head, with pointed ears.
  ctx.fillRect(x + 18, bodyTop + 2, 12, 11);
  ctx.beginPath();
  ctx.moveTo(x + 19, bodyTop + 2);
  ctx.lineTo(x + 21, bodyTop - 4);
  ctx.lineTo(x + 24, bodyTop + 2);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 25, bodyTop + 2);
  ctx.lineTo(x + 27, bodyTop - 4);
  ctx.lineTo(x + 29, bodyTop + 2);
  ctx.closePath();
  ctx.fill();

  // Eye.
  ctx.fillStyle = surface;
  ctx.fillRect(x + 25, bodyTop + 6, 3, 3);

  // Legs: alternating stride while grounded, tucked together in the air.
  ctx.fillStyle = ink;
  const legTop = bodyTop + 22;
  if (airborne) {
    ctx.fillRect(x + 6, legTop, 6, 6);
    ctx.fillRect(x + 15, legTop, 6, 6);
  } else if (legPhase === 0) {
    ctx.fillRect(x + 5, legTop, 6, 6);
    ctx.fillRect(x + 16, legTop, 6, 3);
  } else {
    ctx.fillRect(x + 5, legTop, 6, 3);
    ctx.fillRect(x + 16, legTop, 6, 6);
  }
}

type Obstacle = { x: number; width: number; height: number };

type GameState = {
  status: "ready" | "running" | "over";
  catY: number;
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
export default function CatGame() {
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
      catY: GROUND_Y,
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
        state.catY = GROUND_Y;
        state.velocity = 0;
        state.obstacles = [];
        state.distance = 0;
        state.score = 0;
        state.nextSpawn = 900;
        return;
      }
      if (state.status === "running" && state.catY >= GROUND_Y) {
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
    const CAT_X = 40;

    const step = (time: number) => {
      const palette = PALETTE[themeRef.current];
      if (state.lastTime === null) state.lastTime = time;
      const dt = Math.min((time - state.lastTime) / 1000, 0.05);
      state.lastTime = time;

      if (state.status === "running") {
        state.velocity += GRAVITY * dt;
        state.catY += state.velocity * dt;
        if (state.catY > GROUND_Y) {
          state.catY = GROUND_Y;
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

        const catTop = state.catY - CAT_H;
        for (const ob of state.obstacles) {
          const obTop = GROUND_Y - ob.height;
          const overlapX = CAT_X + CAT_W * 0.7 > ob.x && CAT_X + CAT_W * 0.35 < ob.x + ob.width;
          const overlapY = state.catY > obTop + 4;
          if (overlapX && overlapY && catTop < GROUND_Y) {
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

      const airborne = state.catY < GROUND_Y;
      const legPhase: 0 | 1 = Math.floor(state.distance / 12) % 2 === 0 ? 0 : 1;
      drawCat(ctx, CAT_X, state.catY, palette.ink, palette.surface, airborne, legPhase);

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
      aria-label="Cat jump game — press space or tap to play while you wait"
      className="border-line bg-surface cursor-pointer touch-none rounded-lg border"
      style={{ width: "100%", maxWidth: WIDTH, height: "auto", aspectRatio: `${WIDTH} / ${HEIGHT}` }}
    />
  );
}
