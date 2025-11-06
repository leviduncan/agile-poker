
import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, Check, Loader2, Play, RotateCcw, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { triggerPerfectConsensus, triggerStrongConsensus, triggerEstimateFinalized } from '@/lib/confetti';

const CurrentStory: React.FC = () => {
  const { 
    game, 
    currentStory, 
    isHost, 
    isVoting,
    startVoting, 
    revealCards, 
    resetVoting,
    finalizeEstimate
  } = useGame();
  
  const [finalEstimate, setFinalEstimate] = useState<string>('');
  const [consensusLevel, setConsensusLevel] = useState<'none' | 'strong' | 'perfect'>('none');
  const [consensusPercentage, setConsensusPercentage] = useState<number>(0);
  const hasTriggeredConfetti = useRef(false);
  
  if (!game) return null;
  
  // No current story selected
  if (!currentStory) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">No Story Selected</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">
            {game.stories.length === 0 
              ? "Add a story to begin estimation" 
              : "Select a story to start voting"}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const isRevealed = currentStory.status === 'revealed';
  const allVoted = game.players.every(p => p.vote !== null);
  
  // Get the most common vote if cards are revealed
  let consensusVote = '';
  if (isRevealed) {
    const votes = game.players.map(p => p.vote).filter(Boolean) as string[];
    const voteCounts = votes.reduce((acc, vote) => {
      acc[vote] = (acc[vote] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    let maxCount = 0;
    Object.entries(voteCounts).forEach(([vote, count]) => {
      if (count > maxCount) {
        maxCount = count;
        consensusVote = vote;
      }
    });

    // Calculate consensus percentage
    const totalVotes = votes.length;
    if (totalVotes > 1) { // Only calculate consensus for 2+ players
      const percentage = Math.round((maxCount / totalVotes) * 100);
      setConsensusPercentage(percentage);
      
      if (percentage === 100) {
        setConsensusLevel('perfect');
      } else if (percentage >= 75) {
        setConsensusLevel('strong');
      } else {
        setConsensusLevel('none');
      }
    } else {
      setConsensusLevel('none');
      setConsensusPercentage(0);
    }
  }

  // Trigger confetti when cards are revealed and consensus is detected
  useEffect(() => {
    if (isRevealed && consensusLevel !== 'none' && !hasTriggeredConfetti.current) {
      hasTriggeredConfetti.current = true;
      
      // Small delay to let the card flip animations complete first
      setTimeout(() => {
        if (consensusLevel === 'perfect') {
          triggerPerfectConsensus();
        } else if (consensusLevel === 'strong') {
          triggerStrongConsensus();
        }
      }, 600);
    }
    
    // Reset confetti trigger when voting restarts
    if (!isRevealed) {
      hasTriggeredConfetti.current = false;
      setConsensusLevel('none');
      setConsensusPercentage(0);
    }
  }, [isRevealed, consensusLevel]);

  // Handle estimate finalization with confetti
  const handleFinalizeEstimate = () => {
    triggerEstimateFinalized();
    finalizeEstimate(currentStory.id, finalEstimate || consensusVote);
  };
  
  return (
    <Card className="max-w-md mx-auto shadow-lg border-2">
      <CardHeader>
        <CardTitle>{currentStory.title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        {currentStory.description && (
          <p className="text-gray-700 mb-4">{currentStory.description}</p>
        )}
        
        <div className="flex justify-center items-center gap-2 my-4 flex-wrap">
          {isVoting ? (
            <>
              <div className="text-sm font-medium text-muted-foreground">
                {allVoted ? 'Everyone has voted!' : 'Waiting for votes...'}
              </div>
              {!allVoted && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </>
          ) : isRevealed ? (
            <>
              <div className="bg-success/20 text-success px-3 py-1 rounded-full text-sm font-medium">
                Cards revealed
              </div>
              {consensusPercentage >= 75 && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-glow"
                >
                  <Sparkles className="h-3 w-3" />
                  {consensusPercentage}% Consensus!
                </motion.div>
              )}
            </>
          ) : (
            <div className="bg-warning/20 text-warning px-3 py-1 rounded-full text-sm font-medium">
              Ready to vote
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3">
        {isHost && (
          <>
            {!isVoting && !isRevealed && (
              <Button 
                className="w-full" 
                onClick={() => startVoting(currentStory.id)}
              >
                <Play className="mr-2 h-4 w-4" />
                Start Voting
              </Button>
            )}
            
            {isVoting && (
              <Button 
                className="w-full"
                onClick={revealCards}
                disabled={!allVoted}
              >
                Reveal Cards
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            {isRevealed && (
              <>
                <div className="flex w-full gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={resetVoting}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Vote Again
                  </Button>
                  
                  <motion.div 
                    className="flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="default" 
                      className="w-full bg-success hover:bg-success/90 shadow-lg"
                      onClick={handleFinalizeEstimate}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Accept {finalEstimate || consensusVote || 'Estimate'}
                    </Button>
                  </motion.div>
                </div>
                
                {consensusVote && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex items-center gap-2 mt-2"
                  >
                    <div className="text-sm font-medium">Consensus:</div>
                    <Input 
                      value={finalEstimate || consensusVote}
                      onChange={(e) => setFinalEstimate(e.target.value)}
                      className="flex-1 border-primary/50 focus:border-primary"
                    />
                  </motion.div>
                )}
              </>
            )}
          </>
        )}
        
        {!isHost && (
          <div className="text-center text-sm text-muted-foreground">
            {isVoting ? "Please select a card below" : "Waiting for host to start voting"}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default CurrentStory;
