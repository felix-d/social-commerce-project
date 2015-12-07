var React = require('react');
var ReviewForm = require("./ReviewForm.react.jsx");
var ReviewBoxStore = require('../stores/ReviewBoxStore');
var ProductActions = require('../actions/ProductActions');
var { Modal, Row, Col } = require("react-bootstrap");

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
        <Modal id="review-widget" show={this.state.open} onHide={this.closeReviewBox} bsSize="large">
            <Modal.Body>
                <Row>
                    <Col xs={12} className="text-right">
                        <button className="btn btn-default" onClick={this.closeReviewBox}><i className="fa fa-times"></i></button>
                    </Col>
                </Row>

                <Row>
                    <Col xs={12} className="text-center">
                        <h2 className="product-name">{this.state.product.name}</h2>
                    </Col>
                </Row>

                <Row className="inner">
                    <Col xs={3}>
                        <img src={this.state.product.image_path} alt={this.state.product.name} className="product-image"/>
                    </Col>

                    <Col xs={3}>
                        <h4>Release date</h4>
                        <p>{this.state.product.caracteristic_1}</p>
                        <h4>Tags</h4>
                        <p>{this.state.product.tags.join(", ")}</p>
                        <h4>Overview</h4>
                        <p className="description" id="review-widget__description" ref="description" data-toggle="popover" data-content={this.state.product.description}>{description}</p>
                    </Col>

                    <Col xs={6}>
                        <ReviewForm product={this.state.product}/>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>;
        
        // we only show the review widget if it's opened
        return(
        <div>
            {this.state.open ? reviewWidget : null}
        </div>
        );
    }
});

module.exports = ReviewBox;
