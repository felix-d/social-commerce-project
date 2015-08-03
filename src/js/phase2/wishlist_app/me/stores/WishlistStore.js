'use strict';

var Reflux = require("reflux"),
    WishlistActions = require("../actions/WishlistActions"),
    ProductsActions = require("../../products/actions/ProductsActions"),
    ProductStore = require("../../products/stores/ProductsStore"),
    debug = require("debug")(__filename),
    request = require("superagent");

var _wishlist = [],
    _lastSetProductId = null;

var WishlistStore = Reflux.createStore({

  listenables: WishlistActions,

  init(){
  },

  getWishlist() {
    return {
      wishlist: _wishlist 
    };
  },

  getIdLastSetProduct(){
    return _lastSetProductId;
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
    w.iswish = true;
    _wishlist.push(w);
    _lastSetProductId = w.id;

    request
      .post("/phase2/addwish/")
      .send({product: w.id})
      .end(function(err, res){
        if(err === null){
          debug(`Product ${w.id} got added to the user wishlist. Wishlist:`, _wishlist, err, res);
        } else {
          debug("There was an error while procesing onAdd:", err);
        }
      });

    this.trigger(_wishlist);
  },

  onRemove(w){
    w.iswish = false;
    _wishlist = _wishlist.filter(w2 => !(w2.id === w.id));
    _lastSetProductId = w.id;
    request
      .post("/phase2/removewish/")
      .send({product: w.id})
      .end(function(err, res){
        if(err === null){
          debug(`Product ${w.id} got removed from the user wishlist. Wishlist:`, _wishlist);
        } else {
          debug("There was an error while procesing onRemove:", err);
        }
      });

    this.trigger(_wishlist);
  },

  onSetWishlist(wishes){
    _wishlist = wishes;
    debug("Wishlist was initialized:", _wishlist);
    this.trigger(_wishlist);
  },

  onResetIdLastSetProduct(){
    _lastSetProductId = null;
  }

  
});

module.exports = WishlistStore;
