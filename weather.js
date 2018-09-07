const fetch = require('node-fetch');
const config = require('./config.json');

module.exports.fetchWeather = function(lat, lon) {
  return fetch(`https://api.weather.yandex.ru/v1/forecast?lat=${lat}&lon=${lon}`, {
    headers: {'X-Yandex-API-Key': config.weatherYandexAPI}
  }).then(checkWeatherStatus)
    .then(response => response.json())
    .then(json => {
      return json;
    })
    .catch(error => {
      console.log('Weather fetch error: ' + error);
    });
};

function checkWeatherStatus(response) {
  if (response.ok) {
    return response;
  } else {
    throw console.log('Error Weather API response: ' + response.statusText);
  }
}
