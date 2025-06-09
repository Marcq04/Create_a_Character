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
import Support from './pages/Support';
import Profile from './pages/profilePages/Profile';
import Community from './pages/Community';
import UserProfile from './pages/profilePages/UserProfile';
import Bounty_Details from './pages/bountyPages/Bounty_Details';
import User_Bounty_Details from './pages/bountyPages/User_Bounty_Details';
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
        <Route path="/support" element={<Support />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/bounties/:id" element={<Bounty_Details />} />
        <Route path="/user_bounties/:id" element={<User_Bounty_Details />} />
      </Routes>
    </Router>
  );
}

export default App;

