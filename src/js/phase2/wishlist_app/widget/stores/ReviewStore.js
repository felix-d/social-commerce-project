
var WidgetActions = require("../actions/WidgetActions"),
    Reflux = require("reflux"),
    request = require("superagent"),
    debug = require("debug")(__filename);

require('superagent-django-csrf');

var _currentReviewData;

var ReviewStore = Reflux.createStore({

  listenables: [WidgetActions],

  init: function(){
    
  },

  onDoGetReview: function(userid, productid){
    request
      .post("/phase2/reviewtext/")
      .send({userid: userid, productid: productid})
      .end(function(err, data){

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
          rating: data.rating
        };

        this.trigger(_currentReviewData);
        
      }.bind(this));
  }

});

module.exports = ReviewStore;
