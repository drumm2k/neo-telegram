module.exports.randomInt = function(min, max) {
  let roll = Math.round(min + Math.random() * (max - min));
  return roll;
};
