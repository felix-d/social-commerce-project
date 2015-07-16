var WidgetActions = require("../actions/WidgetActions");
var Reflux = require("reflux");

var _currentReviewData;

var ReviewStore = Reflux.createStore({

  listenables: [WidgetActions],

  init: function(){
    
  },

  onDoGetReview: function(userid, productid){
    $.post(
      '/phase2/reviewtext/',
      JSON.stringify({userid: userid, productid: productid}),

      // success
      function(data){

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

      }.bind(this))

    // error
      .fail(function(){
        console.log("Retrieving the review failed");
      });
  }

});

module.exports = ReviewStore;
