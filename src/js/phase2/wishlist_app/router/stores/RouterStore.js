"use strict";

var Reflux = require("reflux"),
    RouterActions = require("../actions/RouterActions"),
    ProductsActions = require("../../products/actions/ProductsActions"),
    UsersActions = require("../../users/actions/UsersActions"),
    debug = require("debug")(__filename);

var _lastPath = null;

var RouterStore = Reflux.createStore({

  listenables: RouterActions,

  onRouteChanged(path){
    debug("onRouteChanged", path);
    // if(path === "/products") {
    //   if(_lastPath !== path && _lastPath !== null) {
    //     ProductsActions.resetIndex(); 
    //   }
    // }
    // _lastPath = path;
  }
});

module.exports = RouterStore;
