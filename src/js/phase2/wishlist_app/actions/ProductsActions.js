var Reflux = require("reflux");

var ProductsActions = Reflux.createActions([
    "doSearch",
    "doShuffle",
    "doIncrementCurrentIndex",
    "doChangePage"
]);

module.exports = ProductsActions;
