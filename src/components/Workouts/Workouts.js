import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Workouts.css';

function Workouts() {
  const [search, setSearch] = useState('');
  const [movements, setMovements] = useState([]);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [details, setDetails] = useState({
    distance: '',
    duration: '',
    reps: '',
  });
  const [workouts, setWorkouts] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts')) || [];
    setWorkouts(savedWorkouts);
  }, []);

  useEffect(() => {
    if (search.length > 2) {
      axios.get(`http://localhost:3001/movements?search=${search}`)
        .then(response => {
          setMovements(response.data);
        })
        .catch(error => {
          console.error('Error fetching movements:', error);
        });
    } else {
      setMovements([]);
    }
  }, [search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleMovementChange = (e) => {
    const movement = movements.find(movement => movement.name === e.target.value);
    setSelectedMovement(movement);
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const calculateCalories = () => {
    if (!selectedMovement) return 0;

    const { caloriesPerMinute, caloriesPerRep } = selectedMovement;
    const { duration, reps } = details;

    let caloriesBurned = 0;
    if (caloriesPerMinute && duration) {
      caloriesBurned += caloriesPerMinute * parseFloat(duration);
    }
    if (caloriesPerRep && reps) {
      caloriesBurned += caloriesPerRep * parseInt(reps, 10);
    }
    return caloriesBurned;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const caloriesBurned = calculateCalories();
    const newWorkout = {
      movement: selectedMovement.name,
      details: { ...details },
      caloriesBurned,
      date: new Date().toLocaleString(),
    };

    let updatedWorkouts;
    if (editingIndex !== null) {
      updatedWorkouts = workouts.map((workout, index) =>
        index === editingIndex ? newWorkout : workout
      );
      setEditingIndex(null);
    } else {
      updatedWorkouts = [...workouts, newWorkout];
    }

    setWorkouts(updatedWorkouts);
    localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    setSelectedMovement(null);
    setDetails({
      distance: '',
      duration: '',
      reps: '',
    });
  };

  const handleEdit = (index) => {
    const workout = workouts[index];
    setSelectedMovement(
      movements.find((movement) => movement.name === workout.movement)
    );
    setDetails(workout.details);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updatedWorkouts = workouts.filter((_, i) => i !== index);
    setWorkouts(updatedWorkouts);
    localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
  };

  return (
    <div className="workouts-container">
      <h1>Log Your Workouts</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="search">Search for a movement:</label>
          <input
            type="text"
            id="search"
            value={search}
            onChange={handleSearchChange}
            placeholder="e.g., Running, Pushups"
          />
        </div>
        <div className="form-group">
          <label htmlFor="movement">Select a movement:</label>
          <select id="movement" value={selectedMovement?.name || ''} onChange={handleMovementChange}>
            <option value="">Select a movement</option>
            {movements.map((movement, index) => (
              <option key={index} value={movement.name}>{movement.name}</option>
            ))}
          </select>
        </div>
        {selectedMovement && (
          <div className="details-group">
            {selectedMovement.caloriesPerMinute && (
              <div className="form-group">
                <label htmlFor="duration">Duration (minutes):</label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={details.duration}
                  onChange={handleDetailsChange}
                  placeholder="e.g., 30"
                />
              </div>
            )}
            {selectedMovement.caloriesPerRep && (
              <div className="form-group">
                <label htmlFor="reps">Reps:</label>
                <input
                  type="text"
                  id="reps"
                  name="reps"
                  value={details.reps}
                  onChange={handleDetailsChange}
                  placeholder="e.g., 20"
                />
              </div>
            )}
          </div>
        )}
        <button type="submit">{editingIndex !== null ? 'Update Workout' : 'Add Workout'}</button>
      </form>
      <div className="workout-list">
        <h2>Your Workouts</h2>
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
              <div className="workout-actions">
                <button onClick={() => handleEdit(index)}>✏️ Edit</button>
                <button onClick={() => handleDelete(index)}>🗑️ Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Workouts;
