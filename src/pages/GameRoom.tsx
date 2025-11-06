import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import Header from '@/components/Header';
import PlayerList from '@/components/PlayerList';
import StoryStack from '@/components/StoryStack';
import VotingCards from '@/components/VotingCards';
import StoryList from '@/components/StoryList';
import LoadingSpinner from '@/components/LoadingSpinner';
import { staggerContainer, fadeIn } from '@/lib/animations';

const GameRoom: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { game, currentPlayer } = useGame();
  
  // Redirect if no game or current player
  useEffect(() => {
    if (!game || game.id !== gameId || !currentPlayer) {
      navigate('/');
    }
  }, [game, gameId, currentPlayer, navigate]);
  
  if (!game || !currentPlayer) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      
      <main className="flex-1 p-4 md:p-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeIn} className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold gradient-text">{game.name}</h1>
            <StoryList />
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <PlayerList />
          </motion.div>
          
          <motion.div variants={fadeIn} className="my-8">
            <StoryStack />
          </motion.div>
          
          <motion.div variants={fadeIn} className="mt-auto">
            <VotingCards />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default GameRoom;
