
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext";
import { GameProvider } from "./context/GameContext";
import Index from "./pages/Index";
import CreateGame from "./pages/CreateGame";
import GameRoom from "./pages/GameRoom";
import JoinGame from "./pages/JoinGame";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SocketProvider>
        <GameProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/create" element={<CreateGame />} />
              <Route path="/game/:gameId" element={<GameRoom />} />
              <Route path="/join/:gameId" element={<JoinGame />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </GameProvider>
      </SocketProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
