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

  // Calculate player positions in an oval arrangement
  const getPlayerPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
    const radiusX = 42; // Horizontal radius percentage
    const radiusY = 35; // Vertical radius percentage
    const x = 50 + radiusX * Math.cos(angle);
    const y = 50 + radiusY * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto mb-8 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative"
        style={{
          width: '100%',
          paddingBottom: '62.5%', // 16:10 aspect ratio for oval
          minHeight: '300px'
        }}
      >
        {/* Players positioned in an oval */}
        <div className="absolute inset-0">
          {game.players.map((player, index) => {
            const { x, y } = getPlayerPosition(index, game.players.length);
            return (
              <motion.div
                key={player.id}
                variants={fadeIn}
                className="absolute"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)'
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
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default PlayerList;
