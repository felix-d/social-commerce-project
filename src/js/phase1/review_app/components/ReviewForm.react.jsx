var React = require('react/addons');
var ReviewFormTab = require('./ReviewFormTab.react.jsx');
var ProductActions = require("../actions/ProductActions");
var ReviewBoxStore = require("../stores/ReviewBoxStore");

var ReviewForm = React.createClass({
    // We only need to set initial state since
    // component gets unmounted each time the box closes
    getInitialState: function(){
        return ReviewBoxStore.getReviewData(); 
    },
    submitReview: function(){
        // We get the updated data, no need to use an event for that
        var reviewData = ReviewBoxStore.getReviewData();

        // Submit the review via Ajax
        ProductActions.submitReview(this.props.product, reviewData);  

        // Close the review box
        ProductActions.closeReviewBox();  
    },
    // Toggle 'recommendIt' between true and false
    toggleRecommendIt: function(){
        ProductActions.toggleRecommendIt();
    },
    // When the comment is changing, set the store
    // (we could not make use of the store, but still, it's good practice)
    commentChanged: function(){
        ProductActions.commentChanged(this.refs.comment.getDOMNode().value);
    },
    deleteReview: function(){
        ProductActions.deleteReview(this.props.product);
        // Close the review box
        ProductActions.closeReviewBox();  
    },
         editReview: function(){
             // We get the updated data, no need to use an event for that
             var reviewData = ReviewBoxStore.getReviewData();

             // Submit the review via Ajax
             ProductActions.submitReview(this.props.product, reviewData);  

             // Close the review box
             ProductActions.closeReviewBox();  
             
         },
         render: function(){

             // The tabs
             var tabs = this.state.tabs.map(function(re, i){
                 var href = "#tab" + i;
                 return (
                     <li className={i===0? "active" : ""} key={i}>
                         <a href={href} data-toggle="tab">
                             {re.name}
                         </a>
                     </li>
                 );
             });

             // the tab content
             var tabContent = this.state.tabs.map(function(re, i){
                 var id = "tab" + i;
                 return(
                     <ReviewFormTab active={i === 0 ? true : false} data={re.categories} id={id} key={i}/>
                 );
             });

             var recommendItClasses = "btn btn-default btn-lg";
             if(this.state.recommendIt) recommendItClasses += " active";

             var editing = this.props.product.review ? true : false;
             var deleteBtn = null;
             var submitBtnTxt = "Submit";
             if(editing){
                 deleteBtn = <button className="btn btn-danger bottom-btn"
                                     onClick={this.deleteReview}>Delete</button>;
                 submitBtnTxt = "Edit";
             }
             return (
                 <div>
                     <div role="tabpanel" className="tab-panel">
                         <ul className="nav nav-tabs" role="tablist">
                             {tabs}
                         </ul>
                         <div className="tab-content" ref="tabContent">
                             {tabContent}
                         </div>
                     </div>
                     <hr />
                     <textarea className="form-comments"
                               placeholder="Your comments"
                               ref="comment" rows="3"
                               onChange={this.commentChanged}
                               defaultValue={this.state.comment}>
                     </textarea>
                     <div data-toggle="buttons" id="recommend">
                         <label className={recommendItClasses} onClick={this.toggleRecommendIt}>
                             <input type="checkbox" autocomplete="off" value="checked"/>
                             I recommend it!
                         </label>
                     </div>
                     <div id="submit-container">
                         <button className="btn btn-success bottom-btn" id="submit-button" onClick={editing? this.editReview : this.submitReview}>{submitBtnTxt}</button>
                         {deleteBtn}
                         
                     </div>
                 </div>
             )
         }
});

module.exports = ReviewForm;
