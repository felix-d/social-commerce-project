var React = require('react');
var ProductActions = require('../actions/ProductActions');

// empty star and filled star
var empty = "fa fa-star-o fa-2x star";
var full = "fa fa-star fa-2x star";

var StarsRating = React.createClass({

    componentDidMount: function(){
        console.log("component did mount");
        this.setStars(this.props.rating);
    },

    // this function sets the stars to filled or empty
    setStars: function(comparator){
        for (var i=5; i>0;i--){
            var ref = "star" + i;
            if(i <= comparator){
                this.refs[ref].getDOMNode().className = full;
            } else {
                this.refs[ref].getDOMNode().className = empty;
            }
        }
    },

    mouseleaveStar: function(e){
        this.setStars(parseInt(e.target.id.substr(e.target.id.length - 1)));
    },

    mouseenterStar: function(e){
        this.setStars(parseInt(e.target.id.substr(e.target.id.length - 1)));
    },

    mouseleaveAllStars: function(e){
        this.setStars(this.props.rating);
    },

    // when we click a star
    clickStar: function(e){
        var num = parseInt(e.target.id.substr(e.target.id.length - 1))
        this.props.rating = parseInt(num);
        this.setStars(this.props.rating);
        ProductActions.setRating(num);
    },

    render: function(){
        return (
            <div id="stars-container">
                <span onMouseLeave={this.mouseleaveAllStars}>
                <i id="star1" className={empty}
                   onClick={this.clickStar}
                   onMouseEnter={this.mouseenterStar}
                   onMouseLeave={this.mouseleaveStar}
                   ref="star1"></i>
                <i id="star2" className={empty}
                   onClick={this.clickStar}
                   onMouseEnter={this.mouseenterStar}
                   onMouseLeave={this.mouseleaveStar}
                   ref="star2"></i>
                <i id="star3" className={empty}
                   onClick={this.clickStar}
                   onMouseEnter={this.mouseenterStar}
                   onMouseLeave={this.mouseleaveStar}
                   ref="star3"></i>
                <i id="star4" className={empty}
                   onClick={this.clickStar}
                   onMouseEnter={this.mouseenterStar}
                   onMouseLeave={this.mouseleaveStar}
                   ref="star4"></i>
                <i id="star5" className={empty}
                   onClick={this.clickStar}
                   onMouseEnter={this.mouseenterStar}
                   onMouseLeave={this.mouseleaveStar}
                   ref="star5"></i>
                </span>
            </div> 
        );
    }
})

module.exports = StarsRating;
