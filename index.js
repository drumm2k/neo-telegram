const TelegramBot = require('node-telegram-bot-api');
const Agent = require('socks5-https-client/lib/Agent');
const config = require('./config.json');
const weather = require('./weather.js');
const geocoding = require('./geocoding.js');
const roll = require('./roll.js');

const bot = new TelegramBot(config.botToken, {
  polling: true,
  request: {
    agentClass: Agent,
    agentOptions: {
      socksHost: config.socksHost,
      socksPort: parseInt(config.socksPort),
      // Authorization
      socksUsername: config.socksUsername,
      socksPassword: config.socksPassword
    }
  }
});

bot.onText(/Всем привет/i, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Это Джи!');
});

// Matches "/weather [whatever]"
bot.onText(/\/weather (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  let location;

  if (typeof match !== 'undefined') {
    location = match[1];
  } else {
    location = config.weatherDefaultLoc;
  }
  console.log(match);

  // Use Geocoding API to get true location name and coordinates
  geocoding.fetchCoordinates(location).then(response => {
    if (response === undefined) {
      bot.sendMessage(chatId, '🚫 The Matrix has you.');
      return;
    }

    let location = response[0];
    let lon = response[1];
    let lat = response[2];

    // Use Weather API to get forecast
    weather.getWeather(location, lat, lon).then(response => {
      bot.sendMessage(chatId, response);
    });
  });
});

// Matches "/roll [whatever]"
bot.onText(/\/roll (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  let min = 1;
  let max = parseInt(match[1]);

  if (max === '') {
    max = 100;
  }

  let result = roll.randomInt(min, max);

  // If rolls 100
  let wow = '';
  if (max === 100 && result === 100) wow = '\nUnbelievable! 👏👏👏👏👏';
  if (max <= 10000 && result > 9000) wow = '\nIt\'s over 9000! ⚡⚡⚡';

  bot.sendMessage(chatId, `👻 ${msg.from.first_name} ${msg.from.last_name} rolls 🎲 ${result} out of ${max}.${wow}`);
});
