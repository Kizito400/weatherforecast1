const apiKey = '1d834a1862f833d765dbbe8c111bc1c9';  // Replace with your actual API key
const searchBtn = document.getElementById('searchBtn');
const locationInput = document.getElementById('locationInput');
const forecastContainer = document.getElementById('forecastContainer');
const tempChart = document.getElementById('tempChart');
const errorContainer = document.getElementById('errorContainer');  // Error message container

searchBtn.addEventListener('click', () => {
    const location = locationInput.value;
    
    if (!location) {
        displayError("Please enter a location!"); // Show error if no location is entered
        return;
    }
    
    getWeatherForecast(location);
});

async function getWeatherForecast(location) {
    try {
        // Clear any previous error messages
        errorContainer.innerHTML = '';

        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`);
        
        if (!response.ok) {
            throw new Error(`City not found: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(data);  // Check the response from the API
        displayForecast(data);  // Display forecast
        drawChart(data);  // Draw chart
    } catch (error) {
        displayError(error.message);  // Show error message in the UI
    }
}

function displayForecast(data) {
    forecastContainer.innerHTML = '';  // Clear previous forecast

    const dailyData = data.list.filter(item => item.dt_txt.endsWith('12:00:00'));  // Filter for daily data at noon
    
    dailyData.forEach(day => {
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';

        const date = new Date(day.dt * 1000).toLocaleDateString();  // Convert UNIX timestamp to readable date
        const icon = day.weather[0].icon;
        const description = day.weather[0].description;
        const temperature = day.main.temp;

        forecastCard.innerHTML = `
            <h3>${date}</h3>
            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}">
            <p>Temperature: ${temperature} °C</p>
            <p>Conditions: ${description}</p>
        `;
        forecastContainer.appendChild(forecastCard);
    });
}

function drawChart(data) {
    const ctx = tempChart.getContext('2d');
    
    const dailyData = data.list.filter(item => item.dt_txt.endsWith('12:00:00'));  // Filter for daily data at noon
    
    const labels = dailyData.map(item => new Date(item.dt * 1000).toLocaleDateString());
    const temperatures = dailyData.map(item => item.main.temp);

    // Remove any existing chart before drawing a new one
    if (window.chart) {
        window.chart.destroy();
    }

    window.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to display error message in the UI
function displayError(message) {
    errorContainer.innerHTML = `<p class="error-message">${message}</p>`;
}
