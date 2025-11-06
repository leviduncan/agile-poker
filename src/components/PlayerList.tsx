import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import PlayerAvatar from '@/components/PlayerAvatar';
import { staggerContainer } from '@/lib/animations';
import emptyPlayersImage from '@/assets/empty-players.jpg';
import EmptyState from '@/components/EmptyState';

const PlayerList: React.FC = () => {
  const { game, currentPlayer } = useGame();

  if (!game) return null;

  if (game.players.length === 0) {
    return (
      <EmptyState
        image={emptyPlayersImage}
        title="No Players Yet"
        description="Waiting for players to join the game. Share the invite link to get started!"
      />
    );
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto mb-8 px-4">
      <div className="flex flex-wrap justify-center items-center gap-6">
        <AnimatePresence mode="popLayout">
          {game.players.map((player) => (
            <motion.div
              key={player.id}
              initial={{ 
                opacity: 0, 
                scale: 0.5,
                y: -50
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: 0
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.5,
                y: 50
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                opacity: { duration: 0.3 }
              }}
            >
              <PlayerAvatar
                name={player.name}
                isHost={player.isHost}
                hasVoted={!!player.vote && !game.revealCards}
                vote={player.vote}
                isRevealed={game.revealCards}
                isCurrentPlayer={player.id === currentPlayer?.id}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlayerList;
