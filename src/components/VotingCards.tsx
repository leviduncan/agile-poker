
import React from 'react';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const POKER_VALUES = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?'];

const VotingCards: React.FC = () => {
  const { castVote, isVoting, hasVoted, currentPlayer } = useGame();

  const handleSelectCard = (value: string) => {
    if (!isVoting) return;
    castVote(value);
  };

  // If not in voting mode, show a message
  if (!isVoting) {
    return (
      <div className="text-center text-gray-500 my-4">
        {hasVoted ? "Waiting for voting to start..." : "Voting not in progress"}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-6 md:grid-cols-12 gap-2 my-4">
        {POKER_VALUES.map((value) => (
          <Button
            key={value}
            variant="outline"
            className={cn(
              "h-16 text-xl font-bold transition-all hover:scale-105",
              currentPlayer?.vote === value ? "bg-poker-primary text-white border-transparent" : ""
            )}
            onClick={() => handleSelectCard(value)}
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default VotingCards;
