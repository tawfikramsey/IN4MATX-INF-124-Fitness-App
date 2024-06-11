// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/home" className="nav-link">Dashboard</Link>
      <Link to="/workouts" className="nav-link">Workouts</Link>
      <Link to="/food-water" className="nav-link">Food & Water</Link>
      <Link to="/workout-recommendations" className="nav-link">Workout Recommendations</Link>
      <Link to="/meal-recommendations" className="nav-link">Meal Recommendations</Link>
    </nav>
  );
}

export default Navbar;
