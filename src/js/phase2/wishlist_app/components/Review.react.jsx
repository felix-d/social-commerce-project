var React = require("react/addons"),
    CSSTransitionGroup = React.addons.CSSTransitionGroup,
    Reflux = require("reflux"),
    ReviewStore = require("../stores/ReviewStore");

var rectangles = (
    <div id="rects">
        <div className="rect" id="rect1"></div>
        <div className="rect" id="rect2"></div>
        <div className="rect" id="rect3"></div>
        <div className="rect" id="rect4"></div>
    </div>
);

var Review = React.createClass({

    mixins: [
        Reflux.listenTo(ReviewStore, 'setReview')
    ],

    getInitialState(){
        return null;
    },
    setReview(review){
        this.setState(review);
    },
    componentWillUpdate(nextProps, nextState){
        $("#review-text").hide();
    },

    componentDidUpdate(){
        $("#review-text").fadeIn();
    },

    render(){

        var revData = [],
            review;

       // If the state is empty, lets return rectangles 
        if(this.state === null){
            review = rectangles;
        }

        // Else, everything is fine
        else {
            for(k in this.state.answers){
                revData.push(
                    <div key={k}>
                        <span key={k}>{k}: </span>
                        <span>
                            {this.state.answers[k]}
                        </span>
                    </div>
                );
            }
            review = (
                <div>
                    <div>
                        {revData}
                    </div>
                    <div>
                        {this.state.comment}
                    </div>
                    <div>
                        {this.state.rating}
                    </div>
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
