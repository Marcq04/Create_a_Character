import { Link } from "react-router-dom";
import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav>
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/characters">Characters</Link></li>
        <li><Link to="/bounties">Bounties</Link></li>

        <li
          className="dropdown"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <Link to="/community">Community</Link>
          {showDropdown && (
            <ul className="dropdown-content">
              <li><Link to="/profile">View My Profile</Link></li>
            </ul>
          )}
        </li>

        <li><Link to="/leaderboard">Leaderboard</Link></li>
        <li><Link to="/support">Support</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
