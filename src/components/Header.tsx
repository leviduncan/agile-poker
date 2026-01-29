import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Copy, Check } from "lucide-react";
import TimerComponent from "./TimerComponent";
import Logo from "./Logo";

const Header: React.FC = () => {
  const { game } = useGame();
  const [copied, setCopied] = useState(false);

  const copyInviteCode = () => {
    if (!game) return;
    navigator.clipboard.writeText(game.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-lg shadow-sm bg-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold flex items-center gap-3 group">
          <Logo size="sm" animated />
          <span className="gradient-text">Agile Poker</span>
        </Link>

        {game && (
          <div className="flex items-center gap-4">
            <TimerComponent />

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="hover-lift hover-glow border-white">
                  Invite Players
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="end">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Share this code with your team:</p>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-4 py-2 rounded-md font-mono text-2xl tracking-widest font-bold">
                      {game.inviteCode}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyInviteCode}
                      className="shrink-0"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    They can join at <span className="font-medium">agilepoker.darrinduncan.com/join</span>
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

