import { Link } from "react-router-dom";

const Navbar = () => (
  <nav>
    <ul>
      <li><Link to="/home">Home</Link></li>
      <li><Link to="/create">Create</Link></li>
      <li><Link to="/community">Community</Link></li>
      <li><Link to="/leaderboard">Leaderboard</Link></li>
      <li><Link to="/support">Support</Link></li>
    </ul>
  </nav>
);

export default Navbar;
