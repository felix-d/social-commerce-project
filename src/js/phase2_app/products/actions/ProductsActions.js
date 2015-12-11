var Reflux = require("reflux");

var ProductsActions = Reflux.createActions([
  "search",
  "shuffle",
  "incrementCurrentIndex",
  "changeTab",
  "setIsNotWish",
  "setIsWish",
  "resetIndex",
  "setCache",
  "resetCache"
]);

module.exports = ProductsActions;
