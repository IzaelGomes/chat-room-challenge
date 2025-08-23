import { useParams, Navigate } from 'react-router-dom';
import ChatLayout from '../components/layout/ChatLayout';
import ChatRoom from '../components/rooms/ChatRoom';
import { useRoom } from '../hooks/useRooms';

function RoomChat() {
  const { roomId } = useParams<{ roomId: string }>();
  const { data: room } = useRoom(roomId || '');

  if (!roomId) {
    return <Navigate to='/rooms' replace />;
  }

  return (
    <ChatLayout roomName={room?.name}>
      <ChatRoom roomId={roomId} />
    </ChatLayout>
  );
}

export default RoomChat;
