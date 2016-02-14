var Reflux = require("reflux"),
    WishlistActions = require("../actions/WishlistActions"),
    ProductsActions = require("../../products/actions/ProductsActions"),
    ProductStore = require("../../products/stores/ProductsStore"),
    APIActions  = require('../../products/actions/APIActions'),
    debug = require("debug")(__filename),
    request = require("superagent");

var _wishlist = null,
    _lastSetProductId = null;

let REQUIRED_NUMBER_WISHES = 999999;

var WishlistStore = Reflux.createStore({

  listenables: [WishlistActions, APIActions],

  getNumWishes() {
    return _wishlist && _wishlist.length;
  },

  getReqNumWishes() {
    return REQUIRED_NUMBER_WISHES;
  },

  getWishlist() {
    return {
      wishlist: _wishlist,
    };
  },

  onFetchInitialDataCompleted(data) {
    REQUIRED_NUMBER_WISHES = data.minwishes;
    this.trigger(_wishlist);
  },

  getIdLastSetProduct() {
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
    if (_wishlist === null) {
      _wishlist = [];
    }
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
