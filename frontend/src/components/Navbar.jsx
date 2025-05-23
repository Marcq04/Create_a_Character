import { Link } from "react-router-dom";

const Navbar = () => (
  <nav>
    <ul>
      <li><Link to="/home">Home</Link></li>
      <li><Link to="/leaderboard">Leaderboard</Link></li>
    </ul>
  </nav>
);

export default Navbar;
