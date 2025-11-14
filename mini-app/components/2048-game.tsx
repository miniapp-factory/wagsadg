"use client";

import { useEffect, useState } from "react";

const SIZE = 4;
const TILE_VALUES = [2, 4];
const TILE_PROBABILITIES = [0.9, 0.1];

function getRandomTile() {
  return Math.random() < TILE_PROBABILITIES[0] ? 2 : 4;
}

function emptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

export function Game2048({
  onScoreChange,
  onGameOver,
}: {
  onScoreChange: (score: number) => void;
  onGameOver: () => void;
}) {
  const [board, setBoard] = useState<number[][]>(emptyBoard());
  const [score, setScore] = useState(0);

  useEffect(() => {
    const b = emptyBoard();
    addRandomTile(b);
    addRandomTile(b);
    setBoard(b);
  }, []);

  useEffect(() => {
    onScoreChange(score);
  }, [score, onScoreChange]);

  function addRandomTile(b: number[][]) {
    const empty: [number, number][] = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (b[r][c] === 0) empty.push([r, c]);
      }
    }
    if (empty.length === 0) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    b[r][c] = getRandomTile();
  }

  function compress(line: number[]) {
    const newLine = line.filter((v) => v !== 0);
    while (newLine.length < SIZE) newLine.push(0);
    return newLine;
  }

  function merge(line: number[]) {
    let merged = [...line];
    for (let i = 0; i < SIZE - 1; i++) {
      if (merged[i] !== 0 && merged[i] === merged[i + 1]) {
        merged[i] *= 2;
        merged[i + 1] = 0;
        setScore((s) => s + merged[i]);
      }
    }
    return merged;
  }

  function move(direction: "up" | "down" | "left" | "right") {
    let changed = false;
    let newBoard = board.map((row) => [...row]);

    const iterate = (index: number, get: (b: number[][], i: number) => number[], set: (b: number[][], i: number, val: number[]) => void) => {
      const line = get(newBoard, index);
      const compressed = compress(line);
      const merged = merge(compressed);
      const final = compress(merged);
      if (!changed && !arraysEqual(line, final)) changed = true;
      set(newBoard, index, final);
    };

    const arraysEqual = (a: number[], b: number[]) => a.every((v, i) => v === b[i]);

    if (direction === "left") {
      for (let r = 0; r < SIZE; r++) {
        iterate(r, (b, i) => b[i], (b, i, val) => (b[i] = val));
      }
    } else if (direction === "right") {
      for (let r = 0; r < SIZE; r++) {
        iterate(r, (b, i) => [...b[i].reverse()], (b, i, val) => (b[i] = val.reverse()));
      }
    } else if (direction === "up") {
      for (let c = 0; c < SIZE; c++) {
        iterate(c, (b, i) => b.map((row) => row[i]), (b, i, val) => b.forEach((row, idx) => (row[i] = val[idx])));
      }
    } else if (direction === "down") {
      for (let c = 0; c < SIZE; c++) {
        iterate(c, (b, i) => b.map((row) => row[i]).reverse(), (b, i, val) => b.forEach((row, idx) => (row[i] = val[idx].reverse())));
      }
    }

    if (changed) {
      addRandomTile(newBoard);
      setBoard(newBoard);
      if (isGameOver(newBoard)) onGameOver();
    }
  }

  function isGameOver(b: number[][]) {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (b[r][c] === 0) return false;
        if (c < SIZE - 1 && b[r][c] === b[r][c + 1]) return false;
        if (r < SIZE - 1 && b[r][c] === b[r + 1][c]) return false;
      }
    }
    return true;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-4 gap-1">
        {board.flat().map((v, idx) => (
          <div
            key={idx}
            className="w-12 h-12 flex items-center justify-center bg-gray-200 text-gray-800 font-bold rounded"
          >
            {v !== 0 ? v : null}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <button onClick={() => move("up")} className="p-2 bg-gray-300 rounded">
          ↑
        </button>
        <div className="flex gap-1">
          <button onClick={() => move("left")} className="p-2 bg-gray-300 rounded">
            ←
          </button>
          <button onClick={() => move("right")} className="p-2 bg-gray-300 rounded">
            →
          </button>
        </div>
        <button onClick={() => move("down")} className="p-2 bg-gray-300 rounded">
          ↓
        </button>
      </div>
      <div className="text-lg">Score: {score}</div>
    </div>
  );
}
