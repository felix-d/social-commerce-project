'use strict';

var Reflux = require('reflux');

var WishlistActions = Reflux.createActions([
  'add',
  'remove',
  'resetIdLastSetProduct',
  'setWishlist'
]);

module.exports = WishlistActions;
