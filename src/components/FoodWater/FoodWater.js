import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FoodWater.css';

function FoodWater() {
  const [entryType, setEntryType] = useState('water');
  const [waterAmount, setWaterAmount] = useState('');
  const [waterUnit, setWaterUnit] = useState('oz');
  const [foodSearch, setFoodSearch] = useState('');
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [foodAmount, setFoodAmount] = useState('');
  const [foodUnit, setFoodUnit] = useState('g');
  const [entries, setEntries] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    // Fetch the entries from local storage or an API
    const savedEntries = JSON.parse(localStorage.getItem('entries')) || [];
    setEntries(savedEntries);
  }, []);

  const handleEntryTypeChange = (e) => {
    setEntryType(e.target.value);
    setSelectedFood(null);
    setFoodSearch('');
  };

  const handleWaterAmountChange = (e) => {
    setWaterAmount(e.target.value);
  };

  const handleWaterUnitChange = (e) => {
    setWaterUnit(e.target.value);
  };

  const handleFoodSearchChange = (e) => {
    setFoodSearch(e.target.value);
  };

  const handleFoodSelectChange = (e) => {
    const food = foods.find(f => f.name === e.target.value);
    setSelectedFood(food);
  };

  const handleFoodAmountChange = (e) => {
    setFoodAmount(e.target.value);
  };

  const handleFoodUnitChange = (e) => {
    setFoodUnit(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEntry = {
      type: entryType,
      date: new Date().toLocaleString(),
    };

    if (entryType === 'water') {
      newEntry.amount = waterAmount;
      newEntry.unit = waterUnit;
    } else if (entryType === 'food' && selectedFood) {
      newEntry.food = selectedFood;
      newEntry.amount = foodAmount;
      newEntry.unit = foodUnit;
    }

    let updatedEntries;
    if (editingIndex !== null) {
      updatedEntries = entries.map((entry, index) =>
        index === editingIndex ? newEntry : entry
      );
      setEditingIndex(null);
    } else {
      updatedEntries = [...entries, newEntry];
    }

    setEntries(updatedEntries);
    localStorage.setItem('entries', JSON.stringify(updatedEntries));

    // Reset form
    setWaterAmount('');
    setWaterUnit('oz');
    setFoodSearch('');
    setSelectedFood(null);
    setFoodAmount('');
    setFoodUnit('g');
  };

  const handleEdit = (index) => {
    const entry = entries[index];
    setEntryType(entry.type);

    if (entry.type === 'water') {
      setWaterAmount(entry.amount);
      setWaterUnit(entry.unit);
    } else if (entry.type === 'food') {
      setSelectedFood(entry.food);
      setFoodSearch(entry.food.name);
      setFoodAmount(entry.amount);
      setFoodUnit(entry.unit);
    }

    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    localStorage.setItem('entries', JSON.stringify(updatedEntries));
  };

  useEffect(() => {
    if (foodSearch.length > 2) {
      axios.get(`http://localhost:3001/foods?search=${foodSearch}`)
        .then(response => {
          setFoods(response.data);
        })
        .catch(error => {
          console.error('Error fetching foods:', error);
        });
    }
  }, [foodSearch]);

  return (
    <div className="foodwater-container">
      <h1>Log Your Food and Water</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="entryType">Log:</label>
          <select id="entryType" value={entryType} onChange={handleEntryTypeChange}>
            <option value="water">Water</option>
            <option value="food">Food</option>
          </select>
        </div>

        {entryType === 'water' && (
          <div className="details-group">
            <div className="form-group">
              <label htmlFor="waterAmount">Amount:</label>
              <input
                type="text"
                id="waterAmount"
                value={waterAmount}
                onChange={handleWaterAmountChange}
                placeholder="e.g., 8"
              />
            </div>
            <div className="form-group">
              <label htmlFor="waterUnit">Unit:</label>
              <select id="waterUnit" value={waterUnit} onChange={handleWaterUnitChange}>
                <option value="oz">oz</option>
                <option value="cups">cups</option>
                <option value="ml">ml</option>
                <option value="gallons">gallons</option>
              </select>
            </div>
          </div>
        )}

        {entryType === 'food' && (
          <div className="details-group">
            <div className="form-group">
              <label htmlFor="foodSearch">Search for food:</label>
              <input
                type="text"
                id="foodSearch"
                value={foodSearch}
                onChange={handleFoodSearchChange}
                placeholder="e.g., Apple"
              />
            </div>
            <div className="form-group">
              <label htmlFor="foodSelect">Select food:</label>
              <select id="foodSelect" value={selectedFood?.name || ''} onChange={handleFoodSelectChange}>
                <option value="">Select a food</option>
                {foods.map((food, index) => (
                  <option key={index} value={food.name}>{food.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="foodAmount">Amount:</label>
              <input
                type="text"
                id="foodAmount"
                value={foodAmount}
                onChange={handleFoodAmountChange}
                placeholder="e.g., 100"
              />
            </div>
            <div className="form-group">
              <label htmlFor="foodUnit">Unit:</label>
              <select id="foodUnit" value={foodUnit} onChange={handleFoodUnitChange}>
                <option value="g">g</option>
                <option value="oz">oz</option>
                <option value="cups">cups</option>
                <option value="ml">ml</option>
              </select>
            </div>
          </div>
        )}

        <button type="submit">{editingIndex !== null ? 'Update Entry' : 'Add Entry'}</button>
      </form>

      <div className="entry-list">
        <h2>Your Entries</h2>
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
              <div className="entry-actions">
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

export default FoodWater;
