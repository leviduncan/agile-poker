import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { cn } from '@/lib/utils';
import { staggerContainer, fadeIn } from '@/lib/animations';

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-muted-foreground my-8"
      >
        {hasVoted ? "Waiting for voting to start..." : "Voting not in progress"}
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-6 md:grid-cols-12 gap-3 my-6"
      >
        {POKER_VALUES.map((value, index) => {
          const isSelected = currentPlayer?.vote === value;
          return (
            <motion.button
              key={value}
              variants={fadeIn}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectCard(value)}
              className={cn(
                "relative h-20 rounded-xl font-bold text-xl transition-all duration-300",
                "border-2 shadow-md",
                isSelected
                  ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-primary scale-105 shadow-glow"
                  : "bg-card hover:bg-accent border-border hover:border-primary/50 hover:shadow-lg"
              )}
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
              <span className="relative z-10">{value}</span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default VotingCards;
