import './App.css';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import LogIn from './pages/LogIn';
import UserTracks from './pages/UserTracks';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <AnimatePresence>
        <Routes>
          <Route exact path="/" element={<LogIn />} />
          <Route exact path="/tracks/:id" element={<UserTracks />} />
          <Route exact path="/home" element={<Home />} />
          <Route path="*" element={<LogIn />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
