
import React from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Timer, Square } from 'lucide-react';
import TimerComponent from './TimerComponent';

const Header: React.FC = () => {
  const { game, copyInviteLink } = useGame();

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <Square className="h-6 w-6 text-white fill-blue-500" />
          Agile Poker
        </Link>
        
        {game && (
          <div className="flex items-center gap-4">
            <TimerComponent />
            
            <Button 
              variant="outline" 
              onClick={copyInviteLink}
              className="text-white border-white hover:bg-white/20"
            >
              Invite Players
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
