import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MealRecommendations.css';

function MealRecommendations() {
  const [mealType, setMealType] = useState('breakfast');
  const [mealOptions, setMealOptions] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/meals?mealType=${mealType}`)
      .then(response => {
        console.log('Fetched meals:', response.data); // Logging fetched meals
        setMealOptions(response.data);
      })
      .catch(error => {
        console.error('Error fetching meals:', error);
      });
  }, [mealType]);

  const handleMealTypeChange = (e) => {
    setMealType(e.target.value);
  };

  return (
    <div className="meal-recommendations-container">
      <h1>Meal Recommendations</h1>
      <div className="form-group">
        <label htmlFor="mealType">Select Meal:</label>
        <select id="mealType" value={mealType} onChange={handleMealTypeChange}>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </select>
      </div>
      <div className="meal-options">
        <h2>{mealType.charAt(0).toUpperCase() + mealType.slice(1)} Options</h2>
        <ul>
          {mealOptions.map((meal, index) => (
            <li key={index}>
              <strong>{meal.name}</strong>: {meal.calories} calories
              <br />
              Nutrients: {meal.nutrients}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MealRecommendations;
