import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, Check, Loader2, Play, RotateCcw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerPerfectConsensus, triggerStrongConsensus, triggerEstimateFinalized } from '@/lib/confetti';
const StoryStack: React.FC = () => {
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
  const [consensusVote, setConsensusVote] = useState<string>('');
  const hasTriggeredConfetti = useRef(false);

  // Calculate consensus when cards are revealed
  useEffect(() => {
    if (!game || !currentStory || currentStory.status !== 'revealed') {
      setConsensusLevel('none');
      setConsensusPercentage(0);
      setConsensusVote('');
      return;
    }
    const votes = game.players.map(p => p.vote).filter(Boolean) as string[];
    const voteCounts = votes.reduce((acc, vote) => {
      acc[vote] = (acc[vote] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    let maxCount = 0;
    let topVote = '';
    Object.entries(voteCounts).forEach(([vote, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topVote = vote;
      }
    });
    setConsensusVote(topVote);
    const totalVotes = votes.length;
    if (totalVotes > 1) {
      const percentage = Math.round(maxCount / totalVotes * 100);
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
  }, [game, currentStory]);

  // Trigger confetti when cards are revealed and consensus is detected
  useEffect(() => {
    const isRevealed = currentStory?.status === 'revealed';
    if (isRevealed && consensusLevel !== 'none' && !hasTriggeredConfetti.current) {
      hasTriggeredConfetti.current = true;
      setTimeout(() => {
        if (consensusLevel === 'perfect') {
          triggerPerfectConsensus();
        } else if (consensusLevel === 'strong') {
          triggerStrongConsensus();
        }
      }, 600);
    }
    if (!isRevealed) {
      hasTriggeredConfetti.current = false;
    }
  }, [currentStory?.status, consensusLevel]);
  if (!game) return null;

  // Get pending stories (not completed)
  const pendingStories = game.stories.filter(s => s.status !== 'completed');

  // Sort: current story first, then others
  const sortedStories = [...pendingStories].sort((a, b) => {
    if (a.id === currentStory?.id) return -1;
    if (b.id === currentStory?.id) return 1;
    return 0;
  });

  // Limit visible stack to 4 cards
  const visibleStories = sortedStories.slice(0, 4);
  const remainingCount = sortedStories.length - visibleStories.length;

  // No stories
  if (pendingStories.length === 0) {
    return <div className="relative max-w-md mx-auto perspective-1000">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">No Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Add a story to begin estimation
            </p>
          </CardContent>
        </Card>
      </div>;
  }

  // No current story selected
  if (!currentStory) {
    return <div className="relative max-w-md mx-auto perspective-1000">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">No Story Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Select a story to start voting
            </p>
          </CardContent>
        </Card>
      </div>;
  }
  const handleFinalizeEstimate = () => {
    triggerEstimateFinalized();
    finalizeEstimate(currentStory.id, finalEstimate || consensusVote);
  };
  const isRevealed = currentStory.status === 'revealed';
  const allVoted = game.players.every(p => p.vote !== null);
  return <div className="relative max-w-md mx-auto perspective-1000" style={{
    minHeight: '400px'
  }}>
      <AnimatePresence mode="popLayout">
        {visibleStories.map((story, index) => {
        const isTopCard = index === 0;
        const offset = index * 20;
        const scale = 1 - index * 0.05;
        const opacity = 1 - index * 0.2;
        const rotate = index * 1 - 1;
        return <motion.div key={story.id} layoutId={story.id} initial={{
          opacity: 0,
          scale: 0.8,
          y: 100,
          rotateX: -20
        }} animate={{
          opacity: isTopCard ? 1 : opacity,
          scale: isTopCard ? 1 : scale,
          y: isTopCard ? 0 : offset,
          rotateX: 0,
          rotate: isTopCard ? 0 : rotate,
          zIndex: visibleStories.length - index
        }} exit={{
          x: '150%',
          opacity: 0,
          rotate: 8,
          transition: {
            duration: 0.5,
            ease: "easeInOut"
          }
        }} transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          opacity: {
            duration: 0.2
          }
        }} className="absolute inset-0" style={{
          transformStyle: 'preserve-3d',
          pointerEvents: isTopCard ? 'auto' : 'none'
        }}>
              {isTopCard ?
          // Full interactive card for current story
          <Card className="shadow-2xl border-2">
                  <CardHeader>
                    <CardTitle>{story.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    {story.description && <p className="text-muted-foreground mb-4">{story.description}</p>}
                    
                    <div className="flex justify-center items-center gap-2 my-4 flex-wrap">
                      {isVoting ? <>
                          <div className="text-sm font-medium text-muted-foreground">
                            {allVoted ? 'Everyone has voted!' : 'Waiting for votes...'}
                          </div>
                          {!allVoted && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                        </> : isRevealed ? <>
                          <div className="bg-success/20 text-success px-3 py-1 rounded-full text-sm font-medium">
                            Cards revealed
                          </div>
                          {consensusPercentage >= 75 && <motion.div initial={{
                    scale: 0,
                    rotate: -180
                  }} animate={{
                    scale: 1,
                    rotate: 0
                  }} transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }} className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-glow">
                              <Sparkles className="h-3 w-3" />
                              {consensusPercentage}% Consensus!
                            </motion.div>}
                        </> : <div className="bg-warning/20 text-warning px-3 py-1 rounded-full text-sm font-medium">
                          Ready to vote
                        </div>}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col gap-3">
                    {isHost && <>
                        {!isVoting && !isRevealed && <Button className="w-full" onClick={() => startVoting(story.id)}>
                            <Play className="mr-2 h-4 w-4" />
                            Start Voting
                          </Button>}
                        
                        {isVoting && <Button className="w-full" onClick={revealCards} disabled={!allVoted}>
                            Reveal Cards
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>}
                        
                        {isRevealed && <>
                            <div className="flex w-full gap-2">
                              <Button variant="outline" className="flex-1" onClick={resetVoting}>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Vote Again
                              </Button>
                              
                              <motion.div className="flex-1" whileHover={{
                      scale: 1.02
                    }} whileTap={{
                      scale: 0.98
                    }}>
                                <Button variant="default" onClick={handleFinalizeEstimate} className="w-full bg-success hover:bg-success/90 shadow-lg rounded-lg text-violet-600">
                                  <Check className="mr-2 h-4 w-4" />
                                  Accept {finalEstimate || consensusVote || 'Estimate'}
                                </Button>
                              </motion.div>
                            </div>
                            
                            {consensusVote && <motion.div initial={{
                    opacity: 0,
                    y: 10
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} className="w-full flex items-center gap-2 mt-2">
                                <div className="text-sm font-medium">Consensus:</div>
                                <Input value={finalEstimate || consensusVote} onChange={e => setFinalEstimate(e.target.value)} className="flex-1 border-primary/50 focus:border-primary" />
                              </motion.div>}
                          </>}
                      </>}
                    
                    {!isHost && <div className="text-center text-sm text-muted-foreground">
                        {isVoting ? "Please select a card below" : "Waiting for host to start voting"}
                      </div>}
                  </CardFooter>
                </Card> :
          // Simplified preview for stacked cards
          <Card className="shadow-lg border bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base truncate">{story.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    {story.description && <p className="text-sm text-muted-foreground line-clamp-2">
                        {story.description}
                      </p>}
                  </CardContent>
                </Card>}
            </motion.div>;
      })}
      </AnimatePresence>
      
      {remainingCount > 0 && <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} className="absolute -bottom-8 left-0 right-0 text-center text-sm text-muted-foreground">
          +{remainingCount} more {remainingCount === 1 ? 'story' : 'stories'}
        </motion.div>}
    </div>;
};
export default StoryStack;