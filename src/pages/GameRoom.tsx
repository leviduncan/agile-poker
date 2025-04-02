
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import Header from '@/components/Header';
import PlayerList from '@/components/PlayerList';
import CurrentStory from '@/components/CurrentStory';
import VotingCards from '@/components/VotingCards';
import StoryList from '@/components/StoryList';

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
          <p>Loading game...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{game.name}</h1>
            <StoryList />
          </div>
          
          <PlayerList />
          
          <div className="my-8">
            <CurrentStory />
          </div>
          
          <div className="mt-auto">
            <VotingCards />
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameRoom;
