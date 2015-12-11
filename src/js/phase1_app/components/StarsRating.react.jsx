import React from 'react';
import ProductActions from '../actions/ProductActions';


// empty star and filled star
const empty = 'fa fa-star-o fa-2x star';
const full = 'fa fa-star fa-2x star';

function getStarsClasses(comparator) {
  const result = {};
  for (let i = 5; i > 0; i--) {
    const ref = `star${i}`;
    if (i <= comparator) {
      result[ref] = full;
    } else {
      result[ref] = empty;
    }
  }
  return result;
}

var StarsRating = React.createClass({

  propTypes: {
    rating: React.PropTypes.number,
  },

  getInitialState() {
    return {
      starClasses: getStarsClasses(this.props.rating),
    };
  },

  mouseleaveStar(e) {
    const num = parseInt(e.target.id.substr(e.target.id.length - 1), 10);
    this.setState({
      starClasses: getStarsClasses(num),
    });
  },

  mouseenterStar(e) {
    const num = parseInt(e.target.id.substr(e.target.id.length - 1), 10);
    this.setState({
      starClasses: getStarsClasses(num),
    });
  },

  mouseleaveAllStars() {
    this.setState({
      starClasses: getStarsClasses(this.state.rating || this.props.rating),
    });
  },

  // when we click a star
  clickStar(e) {
    const rating = parseInt(e.target.id.substr(e.target.id.length - 1), 10);
    ProductActions.setRating(rating);
    this.setState({
      rating,
      starClasses: getStarsClasses(rating),
    });
  },

  render() {
    return (
      <div id="stars-container">
        <span onMouseLeave={this.mouseleaveAllStars}>
          <i id="star1" className={empty}
             onClick={this.clickStar}
             onMouseEnter={this.mouseenterStar}
             onMouseLeave={this.mouseleaveStar}
             className={this.state.starClasses.star1}
             ref="star1"></i>
          <i id="star2" className={empty}
             onClick={this.clickStar}
             onMouseEnter={this.mouseenterStar}
             onMouseLeave={this.mouseleaveStar}
             className={this.state.starClasses.star2}
             ref="star2"></i>
          <i id="star3" className={empty}
             onClick={this.clickStar}
             onMouseEnter={this.mouseenterStar}
             onMouseLeave={this.mouseleaveStar}
             className={this.state.starClasses.star3}
             ref="star3"></i>
          <i id="star4" className={empty}
             onClick={this.clickStar}
             onMouseEnter={this.mouseenterStar}
             onMouseLeave={this.mouseleaveStar}
             className={this.state.starClasses.star4}
             ref="star4"></i>
          <i id="star5" className={empty}
             onClick={this.clickStar}
             onMouseEnter={this.mouseenterStar}
             onMouseLeave={this.mouseleaveStar}
             className={this.state.starClasses.star5}
             ref="star5"></i>
        </span>
      </div> 
    );
  }
})

  module.exports = StarsRating;
