'use strict';

const Reflux = require("reflux"),
      debug = require("debug")(__filename),
      request = require("superagent");


let _userInfo = {
  user: {
    pic: null,
    username: null
  },
  friends: null,
  products: null
};

let UserStore = Reflux.createStore({

  init(){
    request.get('/phase2/userpage/')
      .end(function(err, res){
        if(res !== undefined){
          _userInfo = JSON.parse(res.text);
          debug("Got user info", _userInfo);
          this.trigger(_userInfo);
        }
      }.bind(this));
  },

  getInitialState(){
    return _userInfo;
  }

});

module.exports = UserStore;
