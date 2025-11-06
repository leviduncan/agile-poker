import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import PlayerAvatar from '@/components/PlayerAvatar';
import { staggerContainer, fadeIn } from '@/lib/animations';
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="flex flex-wrap gap-6 justify-center mb-8"
    >
      {game.players.map((player) => (
        <motion.div key={player.id} variants={fadeIn}>
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
    </motion.div>
  );
};

export default PlayerList;
