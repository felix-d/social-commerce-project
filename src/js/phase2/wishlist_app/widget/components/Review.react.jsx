const React = require("react/addons"),
      CSSTransitionGroup = React.addons.CSSTransitionGroup,
      Reflux = require("reflux"),
      trim = require("lodash").trim,
      { Link } = require("react-router"),
      debug = require("debug")(__filename),
      ReviewStore = require("../stores/ReviewStore");

const rectangles = (
    <div id="rects">
        <div className="rect" id="rect1"></div>
        <div className="rect" id="rect2"></div>
        <div className="rect" id="rect3"></div>
        <div className="rect" id="rect4"></div>
    </div>
);

var Review = React.createClass({

    mixins: [
        Reflux.listenTo(ReviewStore, '_setReview')
    ],

    _setReview(review){
        this.setState(review);
    },

    getInitialState(){
        return null;
    },
    componentWillUpdate(nextProps, nextState){
        $("#review-text").hide();
    },

    componentDidUpdate(){
        $("#review-text").fadeIn();
    },

    render(){

      var revData = [],
          review = null,
          username = null,
          comment = null,
          rating = null;

      // If the state is empty, lets return rectangles 
      if(this.state === null){
        review = rectangles;
      }


      // Else, everything is fine
      else {
        for(let k in this.state.answers){
          revData.push(
            <div key={k}>
               <span key={k}><strong>{k}</strong>: </span>
               <span>
                  {this.state.answers[k]}
               </span>
            </div>
          );
        }

        comment = trim(this.state.comment) === "" ? null : (<span><strong>Comment: </strong> {this.state.comment}</span>);

        rating = this.state.rating ? null : (<span><strong>Rating: </strong> {this.state.rating}</span>);

        review = (
          <div key="">
             <div>
                {revData}
             </div>
             <div>
                {comment}
             </div>
             <div>
                {rating}
             </div>
             <Link to={`/users/${this.state.reviewer.id}`}>
                 See {this.state.reviewer.username} profile
             </Link>
          </div>
        );
      }

      return (
        <div className="review-inner">
           <h4>Review</h4>
           <div id="review-text">
              {review}
           </div>
        </div>
      );
    }
});

module.exports = Review;
