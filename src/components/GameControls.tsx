import React from 'react';
import { Button } from "@/components/ui/button";

interface GameControlsProps {
  onStart: () => void;
  isPlaying: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onStart, isPlaying }) => {
  return (
    <Button 
      onClick={onStart}
      className="bg-nokia-fg text-nokia-bg hover:bg-nokia-fg/90"
    >
      {isPlaying ? 'Restart' : 'Start Game'}
    </Button>
  );
};

export default GameControls;