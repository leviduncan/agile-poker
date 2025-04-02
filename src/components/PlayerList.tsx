
import React from 'react';
import { useGame } from '@/context/GameContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Check, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const PlayerList: React.FC = () => {
  const { game, currentPlayer } = useGame();

  if (!game) return null;

  return (
    <div className="flex flex-wrap gap-4 justify-center mb-8">
      {game.players.map((player) => (
        <div 
          key={player.id} 
          className={cn(
            "flex flex-col items-center",
            player.id === currentPlayer?.id ? "ring-2 ring-poker-primary ring-offset-2 rounded-lg p-1" : ""
          )}
        >
          <Avatar className="h-16 w-16 bg-gray-200 relative">
            <AvatarFallback className="text-lg font-semibold">
              {player.name.charAt(0).toUpperCase()}
            </AvatarFallback>
            
            {/* Voting indicator */}
            {player.vote && !game.revealCards && (
              <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                <Check className="h-3 w-3" />
              </div>
            )}
            
            {/* Host crown */}
            {player.isHost && (
              <div className="absolute -top-1 -left-1 bg-amber-400 text-amber-800 rounded-full p-1">
                <Crown className="h-3 w-3" />
              </div>
            )}
          </Avatar>
          
          <span className="mt-2 text-sm font-medium">{player.name}</span>
          
          {/* Revealed vote */}
          {game.revealCards && player.vote && (
            <div className="mt-1 bg-poker-primary text-white font-bold rounded-full h-6 w-6 flex items-center justify-center">
              {player.vote}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlayerList;
