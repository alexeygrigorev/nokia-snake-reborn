import React from 'react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, highScore }) => {
  return (
    <div className="text-nokia-fg font-mono space-y-1">
      <div>Score: {score}</div>
      <div>High Score: {highScore}</div>
    </div>
  );
};

export default ScoreBoard;