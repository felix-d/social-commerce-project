"use strict";

var Reflux = require("reflux"),
    RouterActions = require("../actions/RouterActions"),
    ProductsActions = require("../../products/actions/ProductsActions"),
    debug = require("debug")(__filename);

var _lastPath = null;

var RouterStore = Reflux.createStore({

  listenables: RouterActions,

  onRouteChanged(path){
    debug("onRouteChanged", path);
    switch(path){
    case "/products":
      if(_lastPath !== path && _lastPath !== null) {
        ProductsActions.resetIndex(); 
      }
      break;
    default:
    }
    _lastPath = path;
  }
});

module.exports = RouterStore;
