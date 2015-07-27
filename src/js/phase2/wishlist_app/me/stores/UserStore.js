'use strict';

var Reflux = require("reflux"),
    request = require("superagent");

var _userInfo = null;

var UserStore = Reflux.createStore({

  init(){
    request.get('/phase2/me/')
      .end(function(err, res){
        if(res !== undefined){
          _userInfo = JSON.parse(res.text);
          this.trigger(_userInfo);
        }
      }.bind(this));
  },

  getUserInfo(){
    return _userInfo;
  },

  getWishlist(){
    return _wishlist;
  }
  
});

module.exports = UserStore;
