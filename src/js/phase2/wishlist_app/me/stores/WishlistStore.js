'use strict';

var Reflux = require("reflux"),
    request = require("superagent"),
    WishlistActions = require("../actions/WishlistActions"),
    debug = require("debug")(__filename);

var _wishlist = [];

var WishlistStore = Reflux.createStore({

  listenables: WishlistActions,

  init(){},

  getWishlist() {
    return {
      wishlist: _wishlist 
    };
  },

  isInWishlist(id) {
    for(var i = 0; i < _wishlist.length; i++) {
      if(_wishlist[i].id === id){
        return true;
      }
    }
    return false;
  },

  onAdd(w) {
    for(var i = 0; i < _wishlist.length; i++) {
      if(_wishlist[i].id === w.id) {
        return;
      }
    }
    _wishlist.push(w);
    this.trigger(_wishlist);
    debug(`Product ${w.id} got added to the user wishlist. Wishlist:`, _wishlist);
  },

  onRemove(id){
    _wishlist = _wishlist.filter(w => !(w.id === id));
    this.trigger(_wishlist);
    debug(`Product ${id} got removed from the user wishlist. Wishlist:`, _wishlist);
  }

  
});

module.exports = WishlistStore;
