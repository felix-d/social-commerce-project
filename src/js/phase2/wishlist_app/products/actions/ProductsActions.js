var Reflux = require("reflux");

var ProductsActions = Reflux.createActions([
  "search",
  "shuffle",
  "incrementCurrentIndex",
  "changePage",
  "setIsNotWish",
  "setIsWish",
  "resetIndex"
]);

module.exports = ProductsActions;
