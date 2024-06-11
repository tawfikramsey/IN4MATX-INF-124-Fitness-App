// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import Workouts from './components/Workouts/Workouts';
import FoodWater from './components/FoodWater/FoodWater';
import Navbar from './components/Navbar/Navbar';
import WorkoutRecommendations from './components/WorkoutRecommendations/WorkoutRecommendations';
import MealRecommendations from './components/MealRecommendations/MealRecommendations';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/*" element={<MainApp />} />
        </Routes>
      </div>
    </Router>
  );
}

function MainApp() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Dashboard />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/food-water" element={<FoodWater />} />
        <Route path="/workout-recommendations" element={<WorkoutRecommendations />} />
        <Route path="/meal-recommendations" element={<MealRecommendations />} />
      </Routes>
    </>
  );
}

export default App;
