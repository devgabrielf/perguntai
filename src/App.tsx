import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Home } from "./pages/Home";
import { Room } from './pages/Room';

import { AuthContextProvider } from './contexts/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms/:id" element={<Room />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
