var React = require('react');
var ReviewForm = require("./ReviewForm.react.jsx");
var ReviewBoxStore = require('../stores/ReviewBoxStore');
var ProductActions = require('../actions/ProductActions');

function getReviewState(){
    return ReviewBoxStore.getReviewState();
}

var ReviewBox = React.createClass({

    // Popover options for the product description
    popoverOptions: {
        trigger: 'hover',
        placement: 'left',
        container: '#review-widget',
        delay: {
            show: 400,
            hide: 100
        }
    },

    getInitialState: function(){
        return getReviewState();
    },

    _onChange: function(){
        this.setState(getReviewState());
    },

    closeReviewBox: function(){
        ProductActions.closeReviewBox();  
    },

    componentDidMount: function(){
        ReviewBoxStore.addChangeListener(this._onChange);
    },

    componentWillUnmount:function(){
        ReviewBoxStore.removeReviewChangeListener(this._onChange);
    },

    componentDidUpdate: function(){
        //we add the popover
        if(this.state.open && this.state.product.doCropDescription){
            $(this.refs.description.getDOMNode())
                  .popover(this.popoverOptions);
        }
    },

    componentWillUpdate: function(nextProps, nextState){
        //we remove the popover if the state is open (not yet updated)
        if(this.state.open &&
           this.refs.description &&
           this.state.product.doCropDescription){
            $(this.refs.description.getDOMNode())
                  .popover('destroy');
        }
    },

    render: function(){
        var description = '';

        // Do we crop the description
        if(this.state.product.doCropDescription){
            description = this.state.product.cropDescription;
        } 
        else{
            description = this.state.product.description;
        } 

        var reviewWidget =
        <div id="review-widget" className="animated bounceInDown" ref="reviewWidget">
            <div className="row">
                <div className="col-xs-12 text-right" style={{paddingRight: '0px', right: '-4px'}}>
                    <button className="btn btn-default" onClick={this.closeReviewBox}><i className="fa fa-times"></i></button>
                </div>
            </div>

            <div className="row">
                <div className="col-xs-12 text-center">
                    <h2 className="product-name">{this.state.product.name}</h2>
                </div>
            </div>

            <div className="row inner">

                <div className="col-xs-3">
                    <img src={this.state.product.image_path} alt={this.state.product.name} className="product-image"/>
                </div>

                <div className="col-xs-3">
                    <h4>Release date</h4>
                    <p>{this.state.product.caracteristic_1}</p>
                    <h4>Tags</h4>
                    <p>{this.state.product.tags.join(", ")}</p>
                    <h4>Overview</h4>
                    <p className="description" ref="description" data-toggle="popover" data-content={this.state.product.description}>{description}</p>
                </div>

                <div className="col-xs-6">
                    <ReviewForm product={this.state.product}/>
                </div>
            </div>
        </div>;
        
        // we only show the review widget if it's opened
        return(
        <div>
            {this.state.open ? reviewWidget : null}
        </div>
        );
    }
});

module.exports = ReviewBox;
