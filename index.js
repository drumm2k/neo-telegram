const Telegraf = require('telegraf');
const config = require('./config.json');
const weather = require('./weather.js');
const geocoding = require('./geocoding.js');
const roll = require('./roll.js');

const bot = new Telegraf(config.botToken);
bot.startPolling();

bot.hears(/Всем привет/i, (ctx) => ctx.reply('Это Джи!'));

// Weather
bot.hears(/weather/i, (ctx) => {
  // Handle input message by removing command
  let location = ctx.update.message.text.toLowerCase().replace(/\/|weather| /gy, '');
  // If location is not set - use default
  if (location === '') {
    location = config.weatherDefaultLocation;
  }

  // Use Geocoding API to get true location name and coordinates
  geocoding.fetchCoordinates(location).then(response => {
    if (response === undefined) {
      ctx.reply('🚫 The Matrix has you.');
      return;
    }

    let location = response[0];
    let lon = response[1];
    let lat = response[2];

    // Use Weather API to get forecast
    weather.getWeather(location, lat, lon).then(response => {
      ctx.reply(response);
    });
  });
});

// Roll
bot.hears(/roll/i, (ctx) => {
  let min = 1;
  let max = ctx.update.message.text.toLowerCase().replace(/[^0-9.]/g, '');
  console.log();
  if (max === '') {
    max = 100;
  }

  let result = roll.randomInt(min, max);

  // If rolls 100
  let wow = '';
  if (result === 100) wow = '👏👏👏👏👏👏👏👏👏👏';

  ctx.reply(`👻 @${ctx.update.message.from.username} rolls 🎲 ${result} out of ${max}.\n${wow}`);
});
