
import React from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Timer, Square } from 'lucide-react';
import TimerComponent from './TimerComponent';

const Header: React.FC = () => {
  const { game, copyInviteLink } = useGame();

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold flex items-center gap-2 group">
          <Square className="h-6 w-6 fill-primary transition-transform group-hover:rotate-12" />
          <span className="gradient-text">Agile Poker</span>
        </Link>
        
        {game && (
          <div className="flex items-center gap-4">
            <TimerComponent />
            
            <Button 
              variant="outline" 
              onClick={copyInviteLink}
              className="hover-lift hover-glow"
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
