import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fadeIn, scaleIn } from '@/lib/animations';
import heroBackground from '@/assets/hero-background.jpg';

const JoinGame: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { joinGame } = useGame();
  
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim() || !gameId) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const success = await joinGame(gameId, playerName);
      
      if (success) {
        navigate(`/game/${gameId}`);
      } else {
        setError('Unable to join game. It may no longer exist.');
      }
    } catch (error) {
      console.error('Error joining game', error);
      setError('An error occurred while joining the game.');
    } finally {
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
              <CardTitle className="text-center text-2xl gradient-text">Join Game</CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleJoinGame} className="space-y-6">
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
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
                
                <motion.div variants={fadeIn}>
                  <Button 
                    type="submit" 
                    className="w-full hover-lift hover-glow"
                    disabled={isLoading || !playerName.trim()}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Joining Game...
                      </>
                    ) : (
                      'Join Game'
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

export default JoinGame;
