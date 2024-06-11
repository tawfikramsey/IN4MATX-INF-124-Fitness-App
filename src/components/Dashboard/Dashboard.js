import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // Fetch the workouts data from local storage
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts')) || [];
    setWorkouts(savedWorkouts);
    const totalCalories = savedWorkouts.reduce((total, workout) => total + workout.caloriesBurned, 0);
    setTotalCaloriesBurned(totalCalories);
  }, []);

  useEffect(() => {
    // Fetch the food and water entries from local storage
    const savedEntries = JSON.parse(localStorage.getItem('entries')) || [];
    setEntries(savedEntries);
  }, []);

  return (
    <div className="dashboard">
      <h1>Fitness App Dashboard</h1>
      <div className="feature-links">
        <div className="feature">
          <h2>Logging Workouts</h2>
          <p>Track your workout activities and progress.</p>
          <Link to="/workouts">Go to Workouts</Link>
        </div>
        <div className="feature">
          <h2>Logging Food and Water</h2>
          <p>Log your daily food and water intake.</p>
          <Link to="/food-water">Go to Food & Water</Link>
        </div>
        <div className="feature">
          <h2>Workout Recommendations</h2>
          <p>Get personalized workout recommendations.</p>
          <Link to="/workout-recommendations">Go to Recommendations</Link>
        </div>
        <div className="feature">
          <h2>Meal Recommendations</h2>
          <p>Get personalized meal plans and suggestions.</p>
          <Link to="/meal-recommendations">Go to Meal Recommendations</Link>
        </div>
      </div>
      <div className="workouts-summary">
        <h2>Weekly Workouts</h2>
        <ul>
          {workouts.map((workout, index) => (
            <li key={index}>
              <strong>{workout.movement}</strong>: 
              {workout.details.distance && ` Distance: ${workout.details.distance},`}
              {workout.details.duration && ` Duration: ${workout.details.duration},`}
              {workout.details.reps && ` Reps: ${workout.details.reps}`}
              <br />
              Calories Burned: {workout.caloriesBurned} ({((workout.caloriesBurned / 2000) * 100).toFixed(2)}% of daily intake)
              <br />
              Date: {workout.date}
            </li>
          ))}
        </ul>
        <div className="total-calories">
          <h3>Total Calories Burned: {totalCaloriesBurned}</h3>
          <p>That's {((totalCaloriesBurned / 2000) * 100).toFixed(2)}% of your daily 2000 calorie intake!</p>
        </div>
      </div>
      <div className="entries-summary">
        <h2>Food and Water Entries</h2>
        <ul>
          {entries.map((entry, index) => (
            <li key={index}>
              {entry.type === 'water' && (
                <>
                  <strong>Water</strong>: {entry.amount} {entry.unit}
                  <br />
                  Date: {entry.date}
                </>
              )}
              {entry.type === 'food' && entry.food && (
                <>
                  <strong>Food</strong>: {entry.food.name}, {entry.amount} {entry.unit}
                  <br />
                  Calories: {entry.food.calories}
                  <br />
                  Nutrients: {entry.food.nutrients}
                  <br />
                  Date: {entry.date}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
