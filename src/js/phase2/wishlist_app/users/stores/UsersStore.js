const Reflux = require("reflux"),
      UsersActions = require("../actions/UsersActions"),
      debug = require("debug")(__filename),
      request = require("superagent");

let _userPage = null,
    cache = {};

const UsersStore = Reflux.createStore({

  listenables: [ UsersActions ],

  getInitialState(){
    return _userPage;
  },

  onGetUserPage(id){
    if(cache[id]){
      debug("Getting userPage from cache.");
      _userPage = cache[id];
      this.trigger(_userPage);
    } else {
      request
        .post(`/phase2/userpage/`)
        .send({userid: id})
        .end(function(err, res) {
          if(err === null) {
            _userPage = JSON.parse(res.text);
            debug(`User page info was retrieved`, _userPage);
          } else {
            debug("There was an error while getting user info.", err);
          }
          _userPage.products.forEach(p => {
            let answers = null;
            p.review.boolAnswers.forEach(b => {
              if(b.val){
                if(!answers) { answers = {}; }
                if(b.childgroup in answers){
                  answers[b.childgroup] += `, ${b.name}`;
                } else {
                  answers[b.childgroup] = `${b.name}`;
                }
              }
            });
            if(answers) {
              p.review.boolAnswers = answers;
            } else {
              delete p.review.boolAnswers;
            }
          });

          cache[_userPage.user.id] = _userPage;
          this.trigger(_userPage);
        }.bind(this));
    }
    
  }
  
});

module.exports = UsersStore;
