var Reflux = require("reflux");

var FiltersActions = Reflux.createActions([
  "textSearch",
  "shuffle",
  "sortBy",
  "search",
  "resetSideBar",
  "changeTab"
]);

module.exports = FiltersActions;
