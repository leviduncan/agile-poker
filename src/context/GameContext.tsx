
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
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
  joinGame: (gameId: string, playerName: string) => Promise<boolean>;
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

const createInitialGameState = (): Game => ({
  id: '',
  name: '',
  players: [],
  stories: [],
  currentStoryId: null,
  revealCards: false,
  timerEnabled: false,
  timerDuration: 45,
  timerEndTime: null,
});

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { socket } = useSocket();
  const { toast } = useToast();
  const [game, setGame] = useState<Game | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  // Initialize or load stored game data
  useEffect(() => {
    const storedGameState = localStorage.getItem('agilePokerGameState');
    if (storedGameState) {
      try {
        const gameState = JSON.parse(storedGameState);
        setGame(gameState);
      } catch (err) {
        console.error('Error parsing stored game state', err);
      }
    }
  }, []);

  // Save game state to localStorage when it changes
  useEffect(() => {
    if (game) {
      localStorage.setItem('agilePokerGameState', JSON.stringify(game));
    }
  }, [game]);

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
        
        // Auto-reveal cards when timer ends
        if (game?.currentStoryId && !game.revealCards) {
          revealCards();
        }
      } else {
        setRemainingTime(Math.ceil((endTime - now) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [game?.timerEndTime]);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    const onGameUpdate = (updatedGame: Game) => {
      setGame(updatedGame);
      
      // Update current player
      if (currentPlayer) {
        const updatedPlayer = updatedGame.players.find(p => p.id === currentPlayer.id);
        if (updatedPlayer) {
          setCurrentPlayer(updatedPlayer);
        }
      }
    };

    socket.on('gameUpdate', onGameUpdate);

    return () => {
      socket.off('gameUpdate', onGameUpdate);
    };
  }, [socket, currentPlayer]);

  // Helper function to get the current story
  const getCurrentStory = (): Story | null => {
    if (!game || !game.currentStoryId) return null;
    return game.stories.find(s => s.id === game.currentStoryId) || null;
  };

  // Create a new game
  const createGame = async (name: string, playerName: string): Promise<string> => {
    if (!socket) throw new Error('Socket not connected');

    const gameId = `game-${Math.random().toString(36).substring(2, 9)}`;
    const playerId = socket.id;
    
    const newGame: Game = {
      id: gameId,
      name,
      players: [
        {
          id: playerId,
          name: playerName,
          vote: null,
          isHost: true,
          isActive: true
        }
      ],
      stories: [],
      currentStoryId: null,
      revealCards: false,
      timerEnabled: false,
      timerDuration: 45,
      timerEndTime: null
    };

    // Set game and player state
    setGame(newGame);
    setCurrentPlayer(newGame.players[0]);
    
    // Emit game created event
    socket.emit('gameCreated', newGame);
    
    return gameId;
  };

  // Join an existing game
  const joinGame = async (gameId: string, playerName: string): Promise<boolean> => {
    if (!socket) throw new Error('Socket not connected');

    // In a real app, we'd fetch game data from the server
    // For this demo, we'll use localStorage
    const storedGameState = localStorage.getItem('agilePokerGameState');
    if (!storedGameState) {
      toast({
        title: "Game not found",
        description: "The game you're trying to join doesn't exist",
        variant: "destructive"
      });
      return false;
    }

    try {
      const gameState = JSON.parse(storedGameState) as Game;
      if (gameState.id !== gameId) {
        toast({
          title: "Game not found",
          description: "The game you're trying to join doesn't exist",
          variant: "destructive"
        });
        return false;
      }

      // Create new player
      const newPlayer: Player = {
        id: socket.id,
        name: playerName,
        vote: null,
        isHost: false,
        isActive: true
      };

      // Add player to game
      const updatedGame = {
        ...gameState,
        players: [...gameState.players, newPlayer]
      };

      // Update state
      setGame(updatedGame);
      setCurrentPlayer(newPlayer);

      // Emit player joined event
      socket.emit('playerJoined', { gameId, player: newPlayer });
      
      return true;
    } catch (err) {
      console.error('Error joining game', err);
      toast({
        title: "Error joining game",
        description: "There was a problem joining the game",
        variant: "destructive"
      });
      return false;
    }
  };

  // Add a new story
  const addStory = (title: string, description?: string) => {
    if (!game || !socket || !isHost) return;

    const newStory: Story = {
      id: `story-${Math.random().toString(36).substring(2, 9)}`,
      title,
      description,
      status: 'pending'
    };

    const updatedGame = {
      ...game,
      stories: [...game.stories, newStory]
    };

    // If this is the first story, set it as current
    if (updatedGame.stories.length === 1) {
      updatedGame.currentStoryId = newStory.id;
    }

    setGame(updatedGame);
    socket.emit('gameUpdate', updatedGame);
  };

  // Select a story for estimation
  const selectStory = (storyId: string) => {
    if (!game || !socket || !isHost) return;

    const updatedGame = {
      ...game,
      currentStoryId: storyId,
      revealCards: false
    };

    // Reset all votes
    updatedGame.players = game.players.map(player => ({
      ...player,
      vote: null
    }));

    setGame(updatedGame);
    socket.emit('gameUpdate', updatedGame);
  };

  // Start voting on a story
  const startVoting = (storyId: string) => {
    if (!game || !socket || !isHost) return;

    const storyIndex = game.stories.findIndex(s => s.id === storyId);
    if (storyIndex === -1) return;

    const updatedStories = [...game.stories];
    updatedStories[storyIndex] = {
      ...updatedStories[storyIndex],
      status: 'voting'
    };

    const updatedGame = {
      ...game,
      stories: updatedStories,
      currentStoryId: storyId,
      revealCards: false
    };

    // Reset all votes
    updatedGame.players = game.players.map(player => ({
      ...player,
      vote: null
    }));

    // Start timer if enabled
    if (updatedGame.timerEnabled) {
      updatedGame.timerEndTime = Date.now() + (updatedGame.timerDuration * 1000);
    }

    setGame(updatedGame);
    socket.emit('gameUpdate', updatedGame);
  };

  // Cast a vote
  const castVote = (value: string) => {
    if (!game || !socket || !currentPlayer) return;

    const updatedPlayers = game.players.map(player =>
      player.id === currentPlayer.id
        ? { ...player, vote: value }
        : player
    );

    const updatedGame = {
      ...game,
      players: updatedPlayers
    };

    setGame(updatedGame);
    socket.emit('gameUpdate', updatedGame);
  };

  // Reveal all cards
  const revealCards = () => {
    if (!game || !socket || !isHost) return;

    const updatedGame = {
      ...game,
      revealCards: true
    };

    if (game.currentStoryId) {
      const storyIndex = game.stories.findIndex(s => s.id === game.currentStoryId);
      if (storyIndex !== -1) {
        const updatedStories = [...game.stories];
        updatedStories[storyIndex] = {
          ...updatedStories[storyIndex],
          status: 'revealed'
        };
        updatedGame.stories = updatedStories;
      }
    }

    setGame(updatedGame);
    socket.emit('gameUpdate', updatedGame);
  };

  // Reset voting for current story
  const resetVoting = () => {
    if (!game || !socket || !isHost) return;

    const updatedPlayers = game.players.map(player => ({
      ...player,
      vote: null
    }));

    const updatedGame = {
      ...game,
      players: updatedPlayers,
      revealCards: false
    };

    if (game.currentStoryId) {
      const storyIndex = game.stories.findIndex(s => s.id === game.currentStoryId);
      if (storyIndex !== -1) {
        const updatedStories = [...game.stories];
        updatedStories[storyIndex] = {
          ...updatedStories[storyIndex],
          status: 'voting'
        };
        updatedGame.stories = updatedStories;
      }
    }

    // Reset timer if enabled
    if (updatedGame.timerEnabled) {
      updatedGame.timerEndTime = Date.now() + (updatedGame.timerDuration * 1000);
    } else {
      updatedGame.timerEndTime = null;
    }

    setGame(updatedGame);
    socket.emit('gameUpdate', updatedGame);
  };

  // Finalize the estimate for a story
  const finalizeEstimate = (storyId: string, estimate: string) => {
    if (!game || !socket || !isHost) return;

    const storyIndex = game.stories.findIndex(s => s.id === storyId);
    if (storyIndex === -1) return;

    const updatedStories = [...game.stories];
    updatedStories[storyIndex] = {
      ...updatedStories[storyIndex],
      status: 'completed',
      finalEstimate: estimate
    };

    const updatedGame = {
      ...game,
      stories: updatedStories
    };

    // Move to next story if available
    if (updatedGame.currentStoryId === storyId) {
      const pendingStories = updatedGame.stories.filter(s => s.status === 'pending');
      if (pendingStories.length > 0) {
        updatedGame.currentStoryId = pendingStories[0].id;
      } else {
        updatedGame.currentStoryId = null;
      }
    }

    setGame(updatedGame);
    socket.emit('gameUpdate', updatedGame);
  };

  // Set timer settings
  const setTimer = (enabled: boolean, duration?: number) => {
    if (!game || !socket || !isHost) return;

    const updatedGame = {
      ...game,
      timerEnabled: enabled,
      timerDuration: duration || game.timerDuration,
      timerEndTime: null
    };

    setGame(updatedGame);
    socket.emit('gameUpdate', updatedGame);
  };

  // Start the timer
  const startTimer = () => {
    if (!game || !socket || !isHost || !game.timerEnabled) return;

    const updatedGame = {
      ...game,
      timerEndTime: Date.now() + (game.timerDuration * 1000)
    };

    setGame(updatedGame);
    socket.emit('gameUpdate', updatedGame);
  };

  // Copy invite link to clipboard
  const copyInviteLink = () => {
    if (!game) return;
    
    const inviteLink = `${window.location.origin}/join/${game.id}`;
    navigator.clipboard.writeText(inviteLink);
    
    toast({
      title: "Link copied!",
      description: "Share this link with your team to invite them",
    });
  };

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
