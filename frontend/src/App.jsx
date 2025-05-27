import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/homePage/Home';
import Leaderboard from './pages/Leaderboard';
import Characters from './pages/characterPages/Characters';
import Add_Character from './pages/characterPages/Add_Character';
import Update_Character from './pages/characterPages/Update_Character';
import Bounties from './pages/bountyPages/Bounties';
import Create_Bounties from './pages/bountyPages/Create_Bounties';
import Update_Bounties from './pages/bountyPages/Update_Bounties';
import Character_Details from './pages/characterPages/Character_Details';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/add_character" element={<Add_Character />} />
        <Route path="/update_character/:id" element={<Update_Character />} />
        <Route path="/bounties" element={<Bounties />} />
        <Route path="/create_bounties" element={<Create_Bounties />} />
        <Route path="/update_bounties/:id" element={<Update_Bounties />} />
        <Route path="/characters/:id" element={<Character_Details />} />
      </Routes>
    </Router>
  );
}

export default App;

