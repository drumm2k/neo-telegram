const fetch = require('node-fetch');
const config = require('./config.json');

module.exports.fetchWeather = function() {
  return fetch(`https://api.weather.yandex.ru/v1/forecast?lat=${config.lat}&lon=${config.lon}&${config.extra}`, {
    headers: {'X-Yandex-API-Key': config.yandexWatherToken}
  }).then(checkStatus)
    .then(response => response.json())
    .then(json => {
      return json;
    })
    .catch(error => {
      console.log('Weather fetch error: ' + error);
    });
};

function checkStatus(response) {
  if (response.ok) {
    return response;
  } else {
    throw console.log('Error Weather API response: ' + response.statusText);
  }
}
