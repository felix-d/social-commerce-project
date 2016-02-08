
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

  onDoGetReview(user, productid) {

    debug('Getting review for user', user, 'and product', productid);
    let userid = user.id;
    
    request
      .post("/phase2/reviewtext/")
      .send({userid: userid, productid: productid})
      .end(function(err, data){
        if (err) {
          console.log(err);
        } else {
          _reviewer = user;

          data = JSON.parse(data.text);

          debug("OnDoGetReview", data);

          // we format the answers
          let answers = {};

          if (data.boolAnswers) {
            data.boolAnswers.forEach(b => {
              if(b.val){
                if(b.childgroup in answers){
                  answers[b.childgroup] += `, ${b.name}`;
                } else {
                  answers[b.childgroup] = `${b.name}`;
                }
              }
            });
          }

          _currentReviewData = {
            userid,
            answers,
            productid,
            comment: data.comment,
            rating: data.rating,
            reviewer: _reviewer
          };

          this.trigger(_currentReviewData);
        }

      }.bind(this));
  }

});

module.exports = ReviewStore;
