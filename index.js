const apiKey = '1d834a1862f833d765dbbe8c111bc1c9';
const weatherIcon = document.getElementById('weatherIcon');
const cityName = document.getElementById('cityName');
const weatherDesc = document.getElementById('weatherDesc');
const tempValue = document.getElementById('tempValue');
const searchBtn = document.getElementById('searchBtn');
const toggleTempBtn = document.getElementById('toggleTemp');
const clearHistoryBtn = document.getElementById('clearHistory');
const historyList = document.getElementById('historyList');
let currentUnit = 'metric'; // Default to Celsius
let currentTemp;

searchBtn.addEventListener('click', () => {
  const city = document.getElementById('cityInput').value;
  if (city) {
    getWeatherData(city);
  }
});

toggleTempBtn.addEventListener('click', () => {
  toggleTemperatureUnit();
});

clearHistoryBtn.addEventListener('click', () => {
  localStorage.removeItem('searchHistory');
  updateHistory();
});

function getWeatherData(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${currentUnit}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      updateWeather(data);
      saveSearchHistory(city);
      updateHistory();
    });
}

function updateWeather(data) {
  cityName.innerText = data.name;
  weatherDesc.innerText = data.weather[0].description;
  currentTemp = data.main.temp;
  displayTemperature();

  // Get the weather icon from the API and update the HTML
  const iconCode = data.weather[0].icon;
  weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather icon">`;

  // Change the background based on weather type
  const weatherType = data.weather[0].main.toLowerCase();
  changeBackground(weatherType);
}

function displayTemperature() {
  tempValue.innerText = `${Math.round(currentTemp)}° ${currentUnit === 'metric' ? 'C' : 'F'}`;
  tempValue.classList.toggle('temp-celsius', currentUnit === 'metric');
  tempValue.classList.toggle('temp-fahrenheit', currentUnit === 'imperial');
}

function toggleTemperatureUnit() {
  currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
  getWeatherData(cityName.innerText);
}

function changeBackground(weatherType) {
    document.body.classList.remove('sunny', 'rainy', 'cloudy');
    document.body.classList.add(weatherType);
  }
  
function saveSearchHistory(city) {
  let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
  if (!history.includes(city)) {
    history.push(city);
  }
  localStorage.setItem('searchHistory', JSON.stringify(history));
}

function updateHistory() {
  const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
  historyList.innerHTML = '';
  history.forEach(city => {
    const li = document.createElement('li');
    li.innerText = city;
    historyList.appendChild(li);
  });
}

updateHistory();
