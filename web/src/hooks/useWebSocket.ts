import { useContext } from 'react';
import { WebSocketContext } from '@/contexts/WebSocketContext';

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error(
      'useWebSocket deve ser usado dentro de um WebSocketProvider'
    );
  }
  return context;
}
