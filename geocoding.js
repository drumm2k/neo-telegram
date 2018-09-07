const fetch = require('node-fetch');

module.exports.fetchCoordinates = function(location) {
  return fetch(`https://geocode-maps.yandex.ru/1.x/?format=json&geocode=${location}&lang=en_US`)
    .then(checkGeoStatus)
    .then(response => response.json())
    .then(json => {
      const jsonPath = json.response.GeoObjectCollection.featureMember[0];

      // If can not find this place
      if (jsonPath === undefined) {
        return;
      }

      // Parse location
      const loc = jsonPath.GeoObject.Point.pos.split(' ');
      const geo = [jsonPath.GeoObject.name, loc[0], loc[1]]; // [name, lon, lat]

      return geo;
    })
    .catch(error => {
      console.log('Geolocation fetch error: ' + error);
    });
};

function checkGeoStatus(response) {
  if (response.ok) {
    return response;
  } else {
    throw console.log('Error Geocoding API response: ' + response.statusText);
  }
}
