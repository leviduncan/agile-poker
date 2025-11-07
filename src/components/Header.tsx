import React from "react";
import { Link } from "react-router-dom";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import TimerComponent from "./TimerComponent";
import Logo from "./Logo";

const Header: React.FC = () => {
  const { game, copyInviteLink } = useGame();

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50 backdrop-blur-lg shadow-sm bg-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold flex items-center gap-3 group">
          <Logo size="sm" animated />
          <span className="gradient-text">Agile Poker</span>
        </Link>

        {game && (
          <div className="flex items-center gap-4">
            <TimerComponent />

            <Button variant="outline" onClick={copyInviteLink} className="hover-lift hover-glow">
              Invite Players
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
