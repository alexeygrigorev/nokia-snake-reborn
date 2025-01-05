import React from 'react';
import { cn } from "@/lib/utils";

interface GameBoardProps {
  snake: number[][];
  food: number[];
  gridSize: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ snake, food, gridSize }) => {
  return (
    <div className="aspect-square w-full max-w-[400px] bg-nokia-bg p-1 rounded-lg">
      <div 
        className="w-full h-full grid gap-[1px]"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const x = Math.floor(index / gridSize);
          const y = index % gridSize;
          const isSnake = snake.some(([sX, sY]) => sX === x && sY === y);
          const isFood = food[0] === x && food[1] === y;

          return (
            <div
              key={index}
              className={cn(
                "aspect-square",
                isSnake && "bg-nokia-fg",
                isFood && "bg-nokia-food animate-food-pulse"
              )}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GameBoard;