import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Timer, Play } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
const TimerComponent: React.FC = () => {
  const {
    game,
    isHost,
    isVoting,
    remainingTime,
    setTimer,
    startTimer
  } = useGame();
  const [duration, setDuration] = useState(game?.timerDuration || 45);
  const handleSaveSettings = () => {
    setTimer(!!game?.timerEnabled, duration);
  };
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // If timer is not enabled, show the timer settings button
  if (!game?.timerEnabled) {
    return isHost ? <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="text-gray-900 hover-lift hover-glow border-white">
            <Timer className="h-4 w-4 mr-2" />
            Timer
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h3 className="font-medium">Timer Settings</h3>
            
            <div className="flex items-center space-x-2">
              <Switch id="timer-enabled" onCheckedChange={checked => setTimer(checked, duration)} />
              <Label htmlFor="timer-enabled">Enable Timer</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} min={5} max={600} className="w-20" />
              <Label>seconds</Label>
            </div>
            
            <Button onClick={handleSaveSettings} className="w-full">
              Save Settings
            </Button>
          </div>
        </PopoverContent>
      </Popover> : null;
  }

  // Show the timer with current time remaining
  if (remainingTime === null) {
    return <div className="flex items-center gap-2">
        {isHost && isVoting ? <Button variant="outline" onClick={startTimer} className="text-white border-white hover:bg-white/20">
            <Play className="h-4 w-4 mr-2" />
            Start Timer ({game?.timerDuration}s)
          </Button> : <Button variant="outline" disabled className="pulse">
            <Timer className="h-4 w-4 mr-2" />
            Waiting for host
          </Button>}
      </div>;
  }

  // Active timer display with progress bar
  const progress = ((game?.timerDuration || 0) - remainingTime) / (game?.timerDuration || 1) * 100;
  const isLowTime = remainingTime < 10;
  
  return <div className="flex flex-col gap-2 min-w-[200px]">
      <div className="flex items-center justify-between">
        <Badge variant={isLowTime ? "destructive" : "default"} className="animate-pulse">
          <Timer className="h-4 w-4 mr-2" />
          {isLowTime ? "Time Running Out!" : "Timer Active"}
        </Badge>
        <span className={`font-mono text-lg font-bold ${isLowTime ? 'text-red-500 animate-pulse' : ''}`}>
          {formatTime(remainingTime)}
        </span>
      </div>
      <Progress value={progress} className={isLowTime ? 'bg-red-500/20' : ''} />
    </div>;
};
export default TimerComponent;