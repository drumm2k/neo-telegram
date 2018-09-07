const fetch = require('node-fetch');
const config = require('./config.json');

// Dictionary for conditions
const conditionDict = {
  'clear': '☀️',
  'partly-cloudy': '⛅️',
  'cloudy': '☁️',
  'overcast': '🌥',
  'partly-cloudy-and-light-rain': '🌦',
  'partly-cloudy-and-rain': '🌦',
  'overcast-and-rain': '🌧',
  'overcast-thunderstorms-with-rain': '⛈',
  'cloudy-and-light-rain': '🌧',
  'overcast-and-light-rain': '🌧',
  'cloudy-and-rain': '🌧',
  'overcast-and-wet-snow': '🌧🌨',
  'partly-cloudy-and-light-snow': '🌨',
  'partly-cloudy-and-snow': '🌨',
  'overcast-and-snow': '🌨',
  'cloudy-and-light-snow': '🌨',
  'overcast-and-light-snow': '🌨',
  'cloudy-and-snow': '🌨'
};

// Get weather and form reply
module.exports.getWeather = function(location, lat, lon) {
  return fetchWeather(lat, lon).then(response => {
    let wMarkup = (`🚩 ${location}:` +
                  `\n🌡 ${response.fact.temp}°C ` +
                  `${conditionDict[response.fact.condition]} ${response.fact.condition.replace(/-/g, ' ')}` +
                  `\n🌬 ${response.fact.wind_speed}m/s 💧 ${response.fact.humidity}%` +
                  `\n🌅 ${response.forecasts[0].sunrise} 🌇 ${response.forecasts[0].sunset}` +
                  `\n` +
                  `\n🗓️ Tomorrow: ` +
                  `\n🌡 ${response.forecasts[1].parts.night_short.temp} - ${response.forecasts[1].parts.day_short.temp}°C` +
                  `\n${conditionDict[response.forecasts[1].parts.day_short.condition]} ${response.forecasts[1].parts.day_short.condition.replace(/-/g, ' ')}`);
    return wMarkup;
  });
};

// Fetch weather
function fetchWeather(lat, lon) {
  return fetch(`https://api.weather.yandex.ru/v1/forecast?lat=${lat}&lon=${lon}`, {
    headers: {'X-Yandex-API-Key': config.weatherYandexAPI}
  }).then(response => response.json())
    .then(json => {
      return json;
    })
    .catch(error => {
      console.log('Weather fetch error: ' + error);
    });
};
