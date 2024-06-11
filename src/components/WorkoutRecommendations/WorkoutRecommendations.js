import React, { useState } from 'react';
import axios from 'axios';
import './WorkoutRecommendations.css';

function WorkoutRecommendations() {
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [recommendedWorkouts, setRecommendedWorkouts] = useState([]);

  // Function to handle body part selection
  const handleBodyPartChange = async (event) => {
    const bodyPart = event.target.value;
    setSelectedBodyPart(bodyPart);
    if (bodyPart) {
      try {
        const response = await axios.get(`http://localhost:3001/movements?search=${bodyPart.toLowerCase()}`);
        setRecommendedWorkouts(response.data);
      } catch (error) {
        console.error('Error fetching recommended workouts:', error);
      }
    } else {
      setRecommendedWorkouts([]); // Clear recommended workouts if no body part is selected
    }
  };

  return (
    <div className="workout-recommendations">
      <h1>Workout Recommendations</h1>
      <form>
        <label htmlFor="bodyPart">Choose a body part:</label>
        <select id="bodyPart" value={selectedBodyPart} onChange={handleBodyPartChange}>
          <option value="">Select</option>
          <option value="Chest">Chest</option>
          <option value="Back">Back</option>
          <option value="Leg">Legs</option>
          <option value="Arm">Arms</option>
          {/* Add more options as needed */}
        </select>
      </form>
      <div className="recommended-workouts">
        <h2>Recommended Workouts</h2>
        <ul>
          {recommendedWorkouts.map((workout, index) => (
            <li key={index}>{workout.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default WorkoutRecommendations;
