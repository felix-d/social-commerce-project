const React = require("react"),
      { Popover } = require("react-bootstrap");

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
      rating = (<span><strong>Rating:</strong> {this.props.rating}</span>);
    }
    if(this.props.comment) {
      comment = (<span><strong>Comment:</strong> {this.props.comment}</span>) 
    }
    
    return (
      <div>
         <div>
            {revData}
         </div>
         <div>
            {comment}
         </div>
         <div>
            {rating}
         </div>
      </div>
    );
  }
});

module.exports = Review;
