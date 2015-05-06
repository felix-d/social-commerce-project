var Reflux = require("reflux");

var SideBarActions = Reflux.createActions([
    "doTextSearch",
    "doShuffle",
    "doSortBy",
    "doSearch",
    "doResetSideBar"
]);

module.exports = SideBarActions;
