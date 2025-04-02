
import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Simulate socket connection with localStorage
  useEffect(() => {
    // In a real app, we'd use something like:
    // const socketInstance = io('https://your-websocket-server.com');
    
    // For this demo, we'll simulate a socket with localStorage events
    const mockSocket = {
      id: `user-${Math.random().toString(36).substring(2, 9)}`,
      on: (event: string, callback: Function) => {
        const listener = (e: StorageEvent) => {
          if (e.key?.startsWith(`socket:${event}:`)) {
            try {
              const data = e.newValue ? JSON.parse(e.newValue) : null;
              callback(data);
            } catch (err) {
              console.error('Error parsing socket data', err);
            }
          }
        };
        window.addEventListener('storage', listener);
        return () => window.removeEventListener('storage', listener);
      },
      emit: (event: string, data: any) => {
        const key = `socket:${event}:${Date.now()}`;
        localStorage.setItem(key, JSON.stringify(data));
        // This triggers storage events in other tabs but not the current one
        // So we'll dispatch a custom event for the current tab
        window.dispatchEvent(new StorageEvent('storage', { 
          key, 
          newValue: JSON.stringify(data) 
        }));
      },
      disconnect: () => {
        setIsConnected(false);
      }
    } as unknown as Socket;

    setSocket(mockSocket);
    setIsConnected(true);

    return () => {
      mockSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
