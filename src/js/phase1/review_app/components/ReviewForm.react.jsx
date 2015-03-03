var React = require('react/addons');
var ReviewFormTab = require('./ReviewFormTab.react.jsx');
var ProductActions = require("../actions/ProductActions");

var ReviewForm = React.createClass({
    reviewData: {},
    submitReview: function(){
        ProductActions.submitReview(this.props.product, this.reviewData);  
        ProductActions.closeReviewBox();  
    },
    render: function(){
        var tabs = this.props.reviewElements.tabElements.map(function(re, i){
            var href = "#tab" + i;
            return (
                <li className={i===0? "active" : ""} key={i}>
                    <a href={href} data-toggle="tab">
                        {re.text}
                    </a>
                </li>
            );
        });
        console.log(tabs);
        var tabContent = this.props.reviewElements.tabElements.map(function(re, i){
            var id = "tab" + i;
            return(
                <ReviewFormTab active={i === 0 ? true : false} data={re.categories} id={id} key={i}/>
            );
        });
        return (
            <div>
                <div role="tabpanel" className="tab-panel">
                    <ul className="nav nav-tabs" role="tablist">
                        {tabs}
                    </ul>
                    <div className="tab-content">
                        {tabContent}
                    </div>
                </div>
                <hr />
                <textarea className="form-comments" placeholder="Your comments" rows="3"></textarea>
                <div data-toggle="buttons" id="recommend">
                    <label className="btn btn-default btn-lg">
                        <input type="checkbox" autocomplete="off"/>
                        I recommend it!
                    </label>
                </div>
                <div id="submit-container">
                    <button className="btn btn-success" id="submit-button" onClick={this.submitReview}>Submit</button>
                </div>
            </div>
        )
    }
});

module.exports = ReviewForm;
