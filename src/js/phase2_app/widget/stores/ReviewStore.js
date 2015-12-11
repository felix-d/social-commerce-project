
var WidgetActions = require("../actions/WidgetActions"),
    Reflux = require("reflux"),
    request = require("superagent"),
    UsersActions = require("../../users/actions/UsersActions"),
    debug = require("debug")(__filename);

require('superagent-django-csrf');

let _currentReviewData,
    _reviewer = null;

var ReviewStore = Reflux.createStore({

  listenables: [WidgetActions],

  init: function(){
    
  },

  onDoGetReview: function(user, productid){

    console.log(user);
    let userid = user.id;
    
    request
      .post("/phase2/reviewtext/")
      .send({userid: userid, productid: productid})
      .end(function(err, data){

        _reviewer = user;

        data = JSON.parse(data.text);

        debug("OnDoGetReview", data);

         // we format the answers
        var answers = {};

        data.boolAnswers.forEach(b => {
          if(b.val){
            if(b.childgroup in answers){
              answers[b.childgroup] += `, ${b.name}`;
            } else {
              answers[b.childgroup] = `${b.name}`;
            }
          }
        });

        _currentReviewData = {
          userid,
          answers,
          comment: data.comment,
          rating: data.rating,
          reviewer: _reviewer
        };

        this.trigger(_currentReviewData);
        
      }.bind(this));
  }

});

module.exports = ReviewStore;
