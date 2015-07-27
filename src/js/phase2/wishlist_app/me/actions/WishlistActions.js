"use strict";

var Reflux = require("reflux");

var WishlistActions = Reflux.createActions([
  "add",
  "remove"
]);

module.exports = WishlistActions;
