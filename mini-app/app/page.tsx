"use client";
import { description, title } from "@/lib/metadata";
import { generateMetadata } from "@/lib/farcaster-embed";
import { useState } from "react";
import { Share } from "@/components/share";
import { Game2048 } from "@/components/2048-game";

export { generateMetadata };

export default function Home() {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  return (
    <main className="flex flex-col gap-3 place-items-center px-4">
      <span className="text-2xl">{title}</span>
      <span className="text-muted-foreground">{description}</span>
      <Game2048
        onScoreChange={setScore}
        onGameOver={() => setGameOver(true)}
      />
      {gameOver && (
        <Share
          text={`I scored ${score} in 2048!`}
          className="mt-4"
        />
      )}
    </main>
  );
}
