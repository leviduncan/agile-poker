
import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, Check, Loader2, Play, RotateCcw } from 'lucide-react';

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
  }
  
  return (
    <Card className="max-w-md mx-auto shadow-lg border-2">
      <CardHeader>
        <CardTitle>{currentStory.title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        {currentStory.description && (
          <p className="text-gray-700 mb-4">{currentStory.description}</p>
        )}
        
        <div className="flex justify-center items-center gap-2 my-4">
          {isVoting ? (
            <>
              <div className="text-sm font-medium text-gray-500">
                {allVoted ? 'Everyone has voted!' : 'Waiting for votes...'}
              </div>
              {!allVoted && <Loader2 className="h-4 w-4 animate-spin text-gray-500" />}
            </>
          ) : isRevealed ? (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Cards revealed
            </div>
          ) : (
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
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
                  
                  <Button 
                    variant="default" 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => finalizeEstimate(currentStory.id, finalEstimate || consensusVote)}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Accept {finalEstimate || consensusVote || 'Estimate'}
                  </Button>
                </div>
                
                {consensusVote && (
                  <div className="w-full flex items-center gap-2 mt-2">
                    <div className="text-sm">Consensus:</div>
                    <Input 
                      value={finalEstimate || consensusVote}
                      onChange={(e) => setFinalEstimate(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
        
        {!isHost && (
          <div className="text-center text-sm text-gray-500">
            {isVoting ? "Please select a card below" : "Waiting for host to start voting"}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default CurrentStory;
