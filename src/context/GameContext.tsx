import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Player {
  id: string;
  name: string;
  vote: string | null;
  isHost: boolean;
  isActive: boolean;
}

export interface Story {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'voting' | 'revealed' | 'completed';
  finalEstimate?: string;
}

export interface Game {
  id: string;
  name: string;
  inviteCode: string;
  players: Player[];
  stories: Story[];
  currentStoryId: string | null;
  revealCards: boolean;
  timerEnabled: boolean;
  timerDuration: number;
  timerEndTime: number | null;
}

interface GameContextType {
  game: Game | null;
  currentPlayer: Player | null;
  isHost: boolean;
  currentStory: Story | null;
  isVoting: boolean;
  hasVoted: boolean;
  createGame: (name: string, playerName: string) => Promise<string>;
  joinGame: (inviteCode: string, playerName: string) => Promise<boolean>;
  addStory: (title: string, description?: string) => void;
  selectStory: (storyId: string) => void;
  startVoting: (storyId: string) => void;
  castVote: (value: string) => void;
  revealCards: () => void;
  resetVoting: () => void;
  finalizeEstimate: (storyId: string, estimate: string) => void;
  setTimer: (enabled: boolean, duration?: number) => void;
  startTimer: () => void;
  remainingTime: number | null;
  copyInviteLink: () => void;
}

const GameContext = createContext<GameContextType>({} as GameContextType);

export const useGame = () => useContext(GameContext);

// Generate random invite code
const generateInviteCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [game, setGame] = useState<Game | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const channelRef = useRef<any>(null);

  // Fetch complete game data from database
  const fetchGameData = async (gameId: string) => {
    try {
      // Fetch game
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single();

      if (gameError) throw gameError;

      // Fetch players
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*')
        .eq('game_id', gameId)
        .order('created_at', { ascending: true });

      if (playersError) throw playersError;

      // Fetch stories
      const { data: storiesData, error: storiesError } = await supabase
        .from('stories')
        .select('*')
        .eq('game_id', gameId)
        .order('created_at', { ascending: true });

      if (storiesError) throw storiesError;

      // Map database format to app format
      const mappedGame: Game = {
        id: gameData.id,
        name: gameData.name,
        inviteCode: gameData.invite_code,
        currentStoryId: gameData.current_story_id,
        revealCards: gameData.reveal_cards,
        timerEnabled: gameData.timer_enabled,
        timerDuration: gameData.timer_duration,
        timerEndTime: gameData.timer_end_time,
        players: playersData.map(p => ({
          id: p.id,
          name: p.name,
          vote: p.current_vote,
          isHost: p.is_host,
          isActive: p.is_active
        })),
        stories: storiesData.map(s => ({
          id: s.id,
          title: s.title,
          description: s.description || undefined,
          status: s.status as 'pending' | 'voting' | 'revealed' | 'completed',
          finalEstimate: s.final_estimate || undefined
        }))
      };

      setGame(mappedGame);

      // Update current player if exists
      const storedPlayerId = localStorage.getItem('currentPlayerId');
      if (storedPlayerId) {
        const player = mappedGame.players.find(p => p.id === storedPlayerId);
        if (player) {
          setCurrentPlayer(player);
        }
      }
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  };

  // Handle timer countdown
  useEffect(() => {
    if (!game?.timerEndTime) {
      setRemainingTime(null);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const endTime = game.timerEndTime as number;
      
      if (now >= endTime) {
        setRemainingTime(0);
        clearInterval(interval);
        
        // Auto-reveal cards when timer ends (only host)
        if (game?.currentStoryId && !game.revealCards && isHost) {
          revealCards();
        }
      } else {
        setRemainingTime(Math.ceil((endTime - now) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [game?.timerEndTime]);

  // Set up Supabase Realtime subscriptions
  useEffect(() => {
    if (!game?.id) return;

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`game:${game.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'games', filter: `id=eq.${game.id}` },
        async () => {
          await fetchGameData(game.id);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players', filter: `game_id=eq.${game.id}` },
        async () => {
          await fetchGameData(game.id);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'stories', filter: `game_id=eq.${game.id}` },
        async () => {
          await fetchGameData(game.id);
        }
      )
      .on('broadcast', { event: 'confetti' }, (payload) => {
        window.dispatchEvent(new CustomEvent('triggerConfetti', { detail: payload.payload }));
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [game?.id]);

  // Helper function to get the current story
  const getCurrentStory = (): Story | null => {
    if (!game || !game.currentStoryId) return null;
    return game.stories.find(s => s.id === game.currentStoryId) || null;
  };

  // Create a new game
  const createGame = async (name: string, playerName: string): Promise<string> => {
    const inviteCode = generateInviteCode();
    
    try {
      // Insert game
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .insert({
          name,
          invite_code: inviteCode,
        })
        .select()
        .single();

      if (gameError) throw gameError;

      // Insert host player
      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .insert({
          game_id: gameData.id,
          name: playerName,
          is_host: true,
        })
        .select()
        .single();

      if (playerError) throw playerError;

      // Store player ID locally
      localStorage.setItem('currentPlayerId', playerData.id);
      localStorage.setItem('currentGameId', gameData.id);

      // Fetch and set complete game data
      await fetchGameData(gameData.id);

      return inviteCode;
    } catch (error) {
      console.error('Error creating game:', error);
      toast({
        title: "Error creating game",
        description: "There was a problem creating the game",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Join an existing game
  const joinGame = async (inviteCode: string, playerName: string): Promise<boolean> => {
    try {
      // Find game by invite code
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('id')
        .eq('invite_code', inviteCode.toUpperCase())
        .single();

      if (gameError || !gameData) {
        toast({
          title: "Game not found",
          description: "Invalid invite code",
          variant: "destructive"
        });
        return false;
      }

      // Insert player
      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .insert({
          game_id: gameData.id,
          name: playerName,
          is_host: false,
        })
        .select()
        .single();

      if (playerError) throw playerError;

      // Store player ID locally
      localStorage.setItem('currentPlayerId', playerData.id);
      localStorage.setItem('currentGameId', gameData.id);

      // Fetch and set complete game data
      await fetchGameData(gameData.id);

      return true;
    } catch (error) {
      console.error('Error joining game:', error);
      toast({
        title: "Error joining game",
        description: "There was a problem joining the game",
        variant: "destructive"
      });
      return false;
    }
  };

  // Add a new story
  const addStory = async (title: string, description?: string) => {
    if (!game || !isHost) return;

    try {
      const { data: storyData, error } = await supabase
        .from('stories')
        .insert({
          game_id: game.id,
          title,
          description: description || null,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // If this is the first story, set it as current
      if (game.stories.length === 0) {
        await supabase
          .from('games')
          .update({ current_story_id: storyData.id })
          .eq('id', game.id);
      }
    } catch (error) {
      console.error('Error adding story:', error);
    }
  };

  // Select a story for estimation
  const selectStory = async (storyId: string) => {
    if (!game || !isHost) return;

    try {
      // Update game's current story
      await supabase
        .from('games')
        .update({
          current_story_id: storyId,
          reveal_cards: false,
          timer_end_time: null
        })
        .eq('id', game.id);

      // Reset all votes
      await supabase
        .from('players')
        .update({ current_vote: null })
        .eq('game_id', game.id);
    } catch (error) {
      console.error('Error selecting story:', error);
    }
  };

  // Start voting on a story
  const startVoting = async (storyId: string) => {
    if (!game || !isHost) return;

    try {
      // Update story status
      await supabase
        .from('stories')
        .update({ status: 'voting' })
        .eq('id', storyId);

      // Reset all votes
      await supabase
        .from('players')
        .update({ current_vote: null })
        .eq('game_id', game.id);

      // Start timer if enabled
      const timerEndTime = game.timerEnabled ? Date.now() + (game.timerDuration * 1000) : null;

      await supabase
        .from('games')
        .update({
          current_story_id: storyId,
          reveal_cards: false,
          timer_end_time: timerEndTime
        })
        .eq('id', game.id);
    } catch (error) {
      console.error('Error starting voting:', error);
    }
  };

  // Cast a vote
  const castVote = async (value: string) => {
    if (!currentPlayer) return;

    try {
      await supabase
        .from('players')
        .update({ current_vote: value })
        .eq('id', currentPlayer.id);
    } catch (error) {
      console.error('Error casting vote:', error);
    }
  };

  // Reveal all cards
  const revealCards = async () => {
    if (!game || !isHost) return;

    try {
      await supabase
        .from('games')
        .update({
          reveal_cards: true,
          timer_end_time: null
        })
        .eq('id', game.id);

      // Update current story status
      if (game.currentStoryId) {
        await supabase
          .from('stories')
          .update({ status: 'revealed' })
          .eq('id', game.currentStoryId);
      }

      // Calculate consensus and broadcast confetti
      const votes = game.players.map(p => p.vote).filter(Boolean) as string[];
      if (votes.length > 1) {
        const voteCounts = votes.reduce((acc, vote) => {
          acc[vote] = (acc[vote] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const maxCount = Math.max(...Object.values(voteCounts));
        const percentage = Math.round((maxCount / votes.length) * 100);
        
        let confettiType: 'perfect' | 'strong' | null = null;
        if (percentage === 100) {
          confettiType = 'perfect';
        } else if (percentage >= 75) {
          confettiType = 'strong';
        }

        if (confettiType && channelRef.current) {
          channelRef.current.send({
            type: 'broadcast',
            event: 'confetti',
            payload: { type: confettiType }
          });
        }
      }
    } catch (error) {
      console.error('Error revealing cards:', error);
    }
  };

  // Reset voting for current story
  const resetVoting = async () => {
    if (!game || !isHost) return;

    try {
      // Reset all votes
      await supabase
        .from('players')
        .update({ current_vote: null })
        .eq('game_id', game.id);

      // Update story status back to voting
      if (game.currentStoryId) {
        await supabase
          .from('stories')
          .update({ status: 'voting' })
          .eq('id', game.currentStoryId);
      }

      // Reset timer if enabled
      const timerEndTime = game.timerEnabled ? Date.now() + (game.timerDuration * 1000) : null;

      await supabase
        .from('games')
        .update({
          reveal_cards: false,
          timer_end_time: timerEndTime
        })
        .eq('id', game.id);
    } catch (error) {
      console.error('Error resetting voting:', error);
    }
  };

  // Finalize the estimate for a story
  const finalizeEstimate = async (storyId: string, estimate: string) => {
    if (!game || !isHost) return;

    try {
      // Update story
      await supabase
        .from('stories')
        .update({
          status: 'completed',
          final_estimate: estimate
        })
        .eq('id', storyId);

      // Move to next story if available
      const pendingStories = game.stories.filter(s => s.status === 'pending' && s.id !== storyId);
      const nextStoryId = pendingStories.length > 0 ? pendingStories[0].id : null;

      await supabase
        .from('games')
        .update({
          current_story_id: nextStoryId,
          timer_end_time: null,
          reveal_cards: false
        })
        .eq('id', game.id);

      // Broadcast finalized confetti
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'confetti',
          payload: { type: 'finalized' }
        });
      }
    } catch (error) {
      console.error('Error finalizing estimate:', error);
    }
  };

  // Set timer settings
  const setTimer = async (enabled: boolean, duration?: number) => {
    if (!game || !isHost) return;

    try {
      await supabase
        .from('games')
        .update({
          timer_enabled: enabled,
          timer_duration: duration || game.timerDuration,
          timer_end_time: null
        })
        .eq('id', game.id);
    } catch (error) {
      console.error('Error setting timer:', error);
    }
  };

  // Start the timer
  const startTimer = async () => {
    if (!game || !isHost || !game.timerEnabled) return;

    try {
      await supabase
        .from('games')
        .update({
          timer_end_time: Date.now() + (game.timerDuration * 1000)
        })
        .eq('id', game.id);
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  // Copy invite link to clipboard
  const copyInviteLink = () => {
    if (!game) return;
    
    const inviteLink = `${window.location.origin}/join/${game.inviteCode}`;
    navigator.clipboard.writeText(inviteLink);
    
    toast({
      title: "Link copied!",
      description: "Share this link with your team to invite them",
    });
  };

  // Load game from localStorage on mount
  useEffect(() => {
    const storedGameId = localStorage.getItem('currentGameId');
    if (storedGameId) {
      fetchGameData(storedGameId);
    }
  }, []);

  // Derived state
  const isHost = !!currentPlayer?.isHost;
  const currentStory = getCurrentStory();
  const isVoting = currentStory?.status === 'voting';
  const hasVoted = !!currentPlayer?.vote;

  const contextValue: GameContextType = {
    game,
    currentPlayer,
    isHost,
    currentStory,
    isVoting,
    hasVoted,
    createGame,
    joinGame,
    addStory,
    selectStory,
    startVoting,
    castVote,
    revealCards,
    resetVoting,
    finalizeEstimate,
    setTimer,
    startTimer,
    remainingTime,
    copyInviteLink
  };

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};
