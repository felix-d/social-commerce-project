var React = require('react');
var WidgetActions = require("../actions/WidgetActions");
var classNames = require('classnames');

var Reviewer = React.createClass({
    getReview(){
        WidgetActions.doGetReview(this.props.user.user_id, this.props.productData.id);
    },
    render(){
        var slicked = this.props.productData.numReviewers > 3;
        // We set the class
        var reviewerClass = classNames.call(this, 'reviewer', {
            'slicked': slicked,
            'not-slicked': !slicked
        })

        return (
            <div className={reviewerClass} onClick={this.getReview}>
                <i className="fa fa-user fa-2x"></i>
                <span className="username">{this.props.user.username}</span>
            </div>
        );
    }
});

module.exports = Reviewer;
