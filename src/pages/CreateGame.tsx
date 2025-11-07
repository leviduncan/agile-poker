import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fadeIn, scaleIn } from '@/lib/animations';
import heroBackground from '@/assets/hero-background.jpg';

const CreateGame: React.FC = () => {
  const navigate = useNavigate();
  const { createGame } = useGame();
  
  const [gameName, setGameName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gameName.trim() || !playerName.trim()) return;
    
    setIsLoading(true);
    
    try {
      const inviteCode = await createGame(gameName, playerName);
      navigate(`/game/${inviteCode}`);
    } catch (error) {
      console.error('Error creating game', error);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBackground})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/80" />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={scaleIn}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="glass shadow-glow border-primary/20">
            <CardHeader>
              <CardTitle className="text-center text-2xl gradient-text">Create a New Game</CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleCreateGame} className="space-y-6">
                <motion.div variants={fadeIn} className="space-y-2">
                  <label htmlFor="gameName" className="text-sm font-medium">
                    Game Name
                  </label>
                  <Input
                    id="gameName"
                    placeholder="Enter game name"
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    required
                    className="transition-all focus:ring-2 focus:ring-primary"
                  />
                </motion.div>
                
                <motion.div variants={fadeIn} className="space-y-2">
                  <label htmlFor="playerName" className="text-sm font-medium">
                    Your Name
                  </label>
                  <Input
                    id="playerName"
                    placeholder="Enter your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    required
                    className="transition-all focus:ring-2 focus:ring-primary"
                  />
                </motion.div>
                
                <motion.div variants={fadeIn}>
                  <Button 
                    type="submit" 
                    className="w-full hover-lift hover-glow"
                    disabled={isLoading || !gameName.trim() || !playerName.trim()}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Creating Game...
                      </>
                    ) : (
                      'Create Game'
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateGame;
