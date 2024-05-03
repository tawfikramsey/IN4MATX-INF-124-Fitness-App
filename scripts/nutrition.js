document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('food-search-form');
    const foodNameInput = document.getElementById('food-name');
    const foodAmountInput = document.getElementById('food-amount');
    const searchButton = document.getElementById('search-button');
    const foodInfo = document.getElementById('food-info');
    const addButton = document.getElementById('add-food');

    let consumedFoods = []; // Array to store consumed foods

    searchButton.addEventListener('click', async function () {
        const foodName = foodNameInput.value.trim();
        const foodAmount = foodAmountInput.value.trim();
        
        if (foodName === '') {
            alert('Please enter a food name');
            return;
        }

        if (foodAmount === '') {
            alert('Please enter the amount of food');
            return;
        }

        const amount = parseFloat(foodAmount);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        try {
            const apiKey = 'qBar29BOAaTFRebvaY9fYrQh1tfrBcbAw8kcogdj';
            const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(foodName)}&api_key=${apiKey}`);
            const data = await response.json();
            console.log(data); // Log the data to see what the API is returning
            if (data.foods && data.foods.length > 0) {
                const firstFood = data.foods[0]; // Assuming we want information about the first food in the response
                displayFoodInfo(firstFood, amount);
            } else {
                foodInfo.innerHTML = 'No nutritional information found for the specified food';
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            foodInfo.innerHTML = 'An error occurred while fetching data';
        }
    });

    function displayFoodInfo(food, amount) {
        const foodName = food.description;
        const nutrients = food.foodNutrients.reduce((acc, nutrient) => {
            acc[nutrient.nutrientName] = nutrient.value;
            return acc;
        }, {});
    
        const calories = nutrients['Energy'] || 'N/A';
        const protein = nutrients['Protein'] || 'N/A';
        const carbs = nutrients['Carbohydrate, by difference'] || 'N/A';
        const fat = nutrients['Total lipid (fat)'] || 'N/A';
        const fiber = nutrients['Fiber, total dietary'] || 'N/A';
        const sugar = nutrients['Sugars, total including NLEA'] || 'N/A';
        const sodium = nutrients['Sodium, Na'] || 'N/A';
        const calcium = nutrients['Calcium, Ca'] || 'N/A';
        const iron = nutrients['Iron, Fe'] || 'N/A';
        const potassium = nutrients['Potassium, K'] || 'N/A';
        const magnesium = nutrients['Magnesium, Mg'] || 'N/A';
        const vitaminC = nutrients['Vitamin C, total ascorbic acid'] || 'N/A';
        const vitaminD = nutrients['Vitamin D (D2 + D3)'] || 'N/A';
        const vitaminA = nutrients['Vitamin A, IU'] || 'N/A';
    
        foodInfo.innerHTML = `
            <h2>Nutritional Information for ${foodName}</h2>
            <p>Amount: ${amount} g</p>
            <p>Calories: ${calories * (amount/100)} kcal</p>
            <p>Protein: ${(protein * (amount/100)).toFixed(2)} g</p>
            <p>Carbohydrates: ${(carbs * (amount/100)).toFixed(2)} g</p>
            <p>Fat: ${(fat * (amount/100)).toFixed(2)} g</p>
            <p>Fiber: ${(fiber * (amount/100)).toFixed(2)} g</p>
            <p>Sugar: ${(sugar * (amount/100)).toFixed(2)} g</p>
            <p>Sodium: ${(sodium * (amount/100)).toFixed(2)} mg</p>
            <p>Calcium: ${(calcium * (amount/100)).toFixed(2)} mg</p>
            <p>Iron: ${(iron * (amount/100)).toFixed(2)} mg</p>
            <p>Potassium: ${(potassium * (amount/100)).toFixed(2)} mg</p>
            <p>Magnesium: ${(magnesium * (amount/100)).toFixed(2)} mg</p>
            <p>Vitamin C: ${(vitaminC * (amount/100)).toFixed(2)} mg</p>
            <p>Vitamin D: ${(vitaminD * (amount/100)).toFixed(2)} IU</p>
            <p>Vitamin A: ${(vitaminA * (amount/100)).toFixed(2)} IU</p>
        `;
    }

    addButton.addEventListener('click', function () {
        const amount = parseFloat(foodAmountInput.value);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        const foodName = foodNameInput.value.trim();
        if (foodName === '') {
            alert('Please search for a food first');
            return;
        }

        // Add the consumed food with its amount to the array
        const consumedFood = {
            name: foodName,
            amount: amount
        };
        consumedFoods.push(consumedFood);

        // Optionally, you can display the added food information or provide feedback to the user
        alert(`Added ${amount} g of ${foodName} to the list of consumed foods.`);
    });

    // Function to save consumed foods to a text file
    function saveConsumedFoodsToFile() {
        const text = JSON.stringify(consumedFoods, null, 2);
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'consumed_foods.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});
