import React from 'react';
import { Glyphicon } from 'react-bootstrap';

const Review = React.createClass({

  render(){

    let revData = [],
        rating = null,
        comment = null;

    for(let k in this.props.answers) {
      revData.push(
            <div key={k}>
               <span key={k}><strong>{k}</strong>: </span>
               <span>
                  {this.props.answers[k]}
               </span>
            </div>
      );
    }

    if(this.props.rating){
      rating = [...Array(this.props.rating).keys()].map(() =>
        <Glyphicon glyph="star"/>);
      const remaining = 5 - rating.length;
      rating = rating.concat([...Array(remaining).keys()].map(() =>
        <Glyphicon glyph="star-empty"/>));
    }
    if(this.props.comment) {
      comment = (<span><strong>Comment:</strong> {this.props.comment}</span>) 
    }
    
    return (
      <div>
         <div className="rating-stars">
            {rating}
         </div>
         <div className="rating-data">
            {revData}
         </div>
         <div className="rating-comment">
            {comment}
         </div>
      </div>
    );
  }
});

module.exports = Review;
