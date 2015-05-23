var React = require("react");
var Reflux = require("reflux");

var Review = React.createClass({
    render: function(){

        var emptyRectangles = (
            <div id="rects">
                <div className="rect" id="rect1"></div>
                <div className="rect" id="rect2"></div>
                <div className="rect" id="rect3"></div>
                <div className="rect" id="rect4"></div>
                <div className="rect" id="rect5"></div>
            </div>
        );

        return (
            <div className="review-inner not-loaded">
                <h4>Review</h4>
                {emptyRectangles}
                
            </div>
        );
    }
});

module.exports = Review;
