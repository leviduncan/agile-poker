
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';

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
      const gameId = await createGame(gameName, playerName);
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error('Error creating game', error);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Create a New Game</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleCreateGame} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="gameName" className="text-sm font-medium">
                  Game Name
                </label>
                <Input
                  id="gameName"
                  placeholder="Enter game name"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="playerName" className="text-sm font-medium">
                  Your Name
                </label>
                <Input
                  id="playerName"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading || !gameName.trim() || !playerName.trim()}
              >
                {isLoading ? 'Creating Game...' : 'Create Game'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateGame;
