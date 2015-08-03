var Reflux = require("reflux");

var SideBarActions = Reflux.createActions([
  "textSearch",
  "shuffle",
  "sortBy",
  "search",
  "resetSideBar"
]);

module.exports = SideBarActions;
