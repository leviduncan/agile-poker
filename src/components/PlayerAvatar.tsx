import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Check, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generatePlayerGradient, getPlayerInitials } from '@/lib/playerGradient';

interface PlayerAvatarProps {
  name: string;
  isHost?: boolean;
  hasVoted?: boolean;
  vote?: string | null;
  isRevealed?: boolean;
  isCurrentPlayer?: boolean;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  name,
  isHost = false,
  hasVoted = false,
  vote = null,
  isRevealed = false,
  isCurrentPlayer = false,
}) => {
  const gradient = generatePlayerGradient(name);
  const initials = getPlayerInitials(name);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={cn(
        "flex flex-col items-center gap-2 relative cursor-pointer",
        isCurrentPlayer && "ring-4 ring-primary rounded-2xl p-2",
        isCurrentPlayer && "shadow-[0_0_24px_hsl(var(--primary-glow)_/_0.6)]"
      )}
    >
      <motion.div
        animate={isCurrentPlayer ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative"
      >
        <Avatar 
          className={cn(
            "h-16 w-16 border-4 shadow-2xl relative",
            "border-white dark:border-white/90"
          )}
          style={{ background: gradient }}
        >
          <AvatarFallback 
            className="text-white font-bold text-lg drop-shadow-lg"
            style={{ background: 'transparent' }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Voting indicator */}
        {hasVoted && !isRevealed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1.5 shadow-lg border-2 border-white"
          >
            <Check className="h-3 w-3" />
          </motion.div>
        )}

        {/* Host crown */}
        {isHost && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute -top-1 -left-1 bg-gradient-to-br from-yellow-400 to-amber-500 text-amber-900 rounded-full p-1.5 shadow-lg border-2 border-white"
          >
            <Crown className="h-3 w-3" />
          </motion.div>
        )}
      </motion.div>

      <span className="text-sm font-semibold truncate max-w-[100px] text-foreground drop-shadow-md px-2 py-1 bg-background/80 backdrop-blur-sm rounded-full">
        {name}
      </span>

      {/* Revealed vote */}
      {isRevealed && vote && (
        <motion.div
          initial={{ scale: 0, rotateY: 180 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold rounded-lg h-10 w-10 flex items-center justify-center shadow-2xl border-2 border-white/50 text-lg"
        >
          {vote}
        </motion.div>
      )}
    </motion.div>
  );
};

export default PlayerAvatar;
