const Telegraf = require('telegraf');
const config = require('./config.json');
const weather = require('./weather.js');
const geocoding = require('./geocoding.js');

const bot = new Telegraf(config.botToken);

bot.hears(/Всем привет/i, (ctx) => ctx.reply('Это Джи!'));

bot.startPolling();

// Weather
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

bot.hears(/weather/i, (ctx) => {
  // Determine location
  // Clean message by removing command, you could change @keanureeves_bot to your bot name
  let location = ctx.update.message.text.toLowerCase().replace(/\/|weather| /gy, '');

  // If location is blank use default
  if (location === '') {
    location = config.weatherDefaultLocation;
  }

  // Fetch coordinates based on location
  geocoding.fetchCoordinates(location).then(response => {
    if (response === undefined) {
      ctx.reply('🚫 The Matrix has you.');
      return;
    }

    // Set name and coords
    let location = response[0];
    let lon = response[1];
    let lat = response[2];

    // Fetch weather for location
    weather.fetchWeather(lat, lon).then(response => {
      ctx.reply(`🚩 ${location}:` +
                `\n🌡 ${response.fact.temp}°C` +
                ` ${conditionDict[response.fact.condition]} ${response.fact.condition.replace(/-/g, ' ')}` +
                `\n🌬 ${response.fact.wind_speed}m/s 💧 ${response.fact.humidity}%` +
                `\n🌅 ${response.forecasts[0].sunrise} 🌇 ${response.forecasts[0].sunset}` +
                `\n` +
                `\n🗓️ Tomorrow: ` +
                `\n🌡 ${response.forecasts[1].parts.night_short.temp} - ${response.forecasts[1].parts.day_short.temp} °C`);
    });
  });
});
