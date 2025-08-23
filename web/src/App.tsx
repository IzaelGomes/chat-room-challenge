import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import NotFound from './pages/NotFound';
import RoomChat from './pages/RoomChat';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/rooms' element={<Rooms />} />
      <Route path='/rooms/:roomId' element={<RoomChat />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
