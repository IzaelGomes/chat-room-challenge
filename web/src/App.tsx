import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import NotFound from './pages/NotFound';
import RoomChat from './pages/RoomChat';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/auth/signin' element={<SignIn />} />
      <Route path='/auth/signup' element={<SignUp />} />
      <Route
        path='/rooms'
        element={
          <ProtectedRoute>
            <Rooms />
          </ProtectedRoute>
        }
      />
      <Route
        path='/rooms/:roomId'
        element={
          <ProtectedRoute>
            <RoomChat />
          </ProtectedRoute>
        }
      />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
