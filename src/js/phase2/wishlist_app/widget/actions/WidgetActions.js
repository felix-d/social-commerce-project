var Reflux = require("reflux");

var WidgetActions = Reflux.createActions([
    "doShowWidget",
    "doHideWidget",
    "doGetReview"
]);

module.exports = WidgetActions;
