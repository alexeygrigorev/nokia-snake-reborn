import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from '@/components/GameBoard';
import ScoreBoard from '@/components/ScoreBoard';
import GameControls from '@/components/GameControls';
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

const GRID_SIZE = 15;
const INITIAL_SNAKE = [[7, 7]];
const INITIAL_DIRECTION = [0, 1];
const GAME_SPEED = 150;

const Index = () => {
  const [snake, setSnake] = useState<number[][]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<number[]>(INITIAL_DIRECTION);
  const [food, setFood] = useState<number[]>([5, 5]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameMode, setGameMode] = useState<'wrap' | 'wall'>('wrap');
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const generateFood = useCallback(() => {
    while (true) {
      const newFood = [
        Math.floor(Math.random() * GRID_SIZE),
        Math.floor(Math.random() * GRID_SIZE),
      ];
      if (!snake.some(([x, y]) => x === newFood[0] && y === newFood[1])) {
        return newFood;
      }
    }
  }, [snake]);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setScore(0);
    setIsPlaying(true);
  }, [generateFood]);

  const gameOver = useCallback(() => {
    setIsPlaying(false);
    if (score > highScore) {
      setHighScore(score);
    }
    toast({
      title: "Game Over!",
      description: `Final Score: ${score}`,
    });
  }, [score, highScore, toast]);

  const moveSnake = useCallback(() => {
    if (!isPlaying) return;

    const head = snake[0];
    let newHead = [
      head[0] + direction[0],
      head[1] + direction[1],
    ];

    // Handle wall collision based on game mode
    if (gameMode === 'wall') {
      if (
        newHead[0] < 0 ||
        newHead[0] >= GRID_SIZE ||
        newHead[1] < 0 ||
        newHead[1] >= GRID_SIZE
      ) {
        gameOver();
        return;
      }
    } else {
      // Wrap around mode
      newHead = [
        (newHead[0] + GRID_SIZE) % GRID_SIZE,
        (newHead[1] + GRID_SIZE) % GRID_SIZE,
      ];
    }

    // Check collision with self
    if (snake.some(([x, y]) => x === newHead[0] && y === newHead[1])) {
      gameOver();
      return;
    }

    const newSnake = [newHead, ...snake];
    
    // Check if food is eaten
    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setScore(s => s + 1);
      setFood(generateFood());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, isPlaying, generateFood, gameOver, gameMode]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      const keyDirections: { [key: string]: number[] } = {
        ArrowUp: [-1, 0],
        ArrowDown: [1, 0],
        ArrowLeft: [0, -1],
        ArrowRight: [0, 1],
      };

      const newDirection = keyDirections[e.key];
      if (newDirection) {
        // Prevent 180-degree turns
        if (
          !(direction[0] === -newDirection[0] && direction[1] === -newDirection[1])
        ) {
          setDirection(newDirection);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPlaying]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="space-y-4 w-full max-w-[400px]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-foreground text-2xl font-bold">Nokia Snake</h1>
          <div className="flex items-center gap-2">
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="border-2"
            />
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </div>
        </div>
        
        <div className="flex justify-center mb-4">
          <ToggleGroup type="single" value={gameMode} onValueChange={(value: 'wrap' | 'wall') => value && setGameMode(value)}>
            <ToggleGroupItem value="wrap" aria-label="Wrap Mode">
              Wrap Mode
            </ToggleGroupItem>
            <ToggleGroupItem value="wall" aria-label="Wall Mode">
              Wall Mode
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <GameBoard snake={snake} food={food} gridSize={GRID_SIZE} />
        <div className="flex justify-between items-center">
          <ScoreBoard score={score} highScore={highScore} />
          <GameControls onStart={resetGame} isPlaying={isPlaying} />
        </div>
      </div>
    </div>
  );
};

export default Index;