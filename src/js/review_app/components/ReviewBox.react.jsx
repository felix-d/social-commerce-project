var React = require('react/addons');
var CSSTransitionGroup = React.addons.CSSTransitionGroup;
var ReviewBoxStore = require('../stores/ReviewBoxStore');

function getReviewState(){
    return ReviewBoxStore.getReviewState();
}

var ReviewBox = React.createClass({
    getInitialState: function(){
        return getReviewState();
    },
    _onChange: function(){
        this.setState(getReviewState());
    },
    componentDidMount: function(){
        ReviewBoxStore.addChangeListener(this._onChange);
    },
    componentWillUnmount:function(){
        ReviewBoxStore.removeReviewChangeListener(this._onChange);
    },
    render: function(){
        var reviewWidget = <div className="col-xs-8 col-xs-offset-2" id="review-widget"></div>;
        return(

                <CSSTransitionGroup transitionName="example">
                    {this.state.open ? reviewWidget : null}
                </CSSTransitionGroup>
        )
        
    }
});

module.exports = ReviewBox;
