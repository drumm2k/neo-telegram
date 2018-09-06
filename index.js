const Telegraf = require('telegraf');
const config = require('./config.json');
const weather = require('./weather.js');

const bot = new Telegraf(config.token);

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy'));

bot.startPolling();

// Weather
const conditionDict = {
  'clear': '☀️',
  'partly-cloudy': '🌤',
  'cloudy': '⛅️',
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

bot.hears('weather', (ctx) => {
  weather.fetchWeather().then(response => {
    ctx.reply('Weather in Saint-Petersburg:' +
              '\n🌡 ' + response.fact.temp +
              ' | ' + conditionDict[response.fact.condition] +
              ' | 🌬 ' + response.fact.wind_speed + ' m/s' +
              ' | 💧 ' + response.fact.humidity);
  });
});
