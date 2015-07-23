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

        _currentReviewData = {}

        // we format the answers
        if (data.boolAnswers !== undefined) {
          _currentReviewData.answers = {};
          data.boolAnswers.forEach(o => {
            _currentReviewData.answers[o.childGroupName] = o.answers.join(", ");
          });
        }
        if (data.comment !== undefined) {
          _currentReviewData.comment = data.comment;
        }
        if (data.rating !== undefined) {
          _currentReviewData.rating = data.rating;
        }
        _currentReviewData.userid = userid;

        this.trigger(_currentReviewData);

      }.bind(this))

    // error
      .fail(function(){
        console.log("Retrieving the review failed");
      });
  }

});

module.exports = ReviewStore;
