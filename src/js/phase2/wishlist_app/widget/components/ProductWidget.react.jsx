var React = require("react");
var Reflux = require("reflux");
var WidgetStore = require("../stores/WidgetStore");
var WidgetActions = require("../actions/WidgetActions");
var Review = require("./Review.react.jsx");
var { Col, Row } = require("react-bootstrap");
var popoverOptions = require("../../utils/Config").widgetPopoverOptions;
var ReviewersCarousel = require("./ReviewersCarousel.react.jsx");

var ProductWidget = React.createClass({

    closeProductWidget: function(){
        WidgetActions.doHideWidget()
    },

    getReview: function(){
        WidgetActions.doGetReview(0,0);
    },

    componentDidUpdate(){
        console.log("componenet did updated");
    },

    getInitialState: function(){
        return WidgetStore.getWidgetState();
    },

    componentDidMount: function(){
        //we add the popover if the description is cropped
        if(this.state.productData.doCropDescription){
            $(this.refs.description.getDOMNode())
                  .popover(popoverOptions);
        }
    },

    componentWillUnmount: function(nextProps, nextState){
        //we remove the popover if the description is cropped
        if(this.state.productData.doCropDescription){
            $(this.refs.description.getDOMNode())
                  .popover('destroy');
        }

    },

    render: function(){

        var description = '';

        // Do we crop the description
        if(this.state.productData.doCropDescription){
            description = this.state.productData.cropDescription;
        } 
        else{
            description = this.state.productData.description;
        } 


        return (
            <div id="product-widget" className="animated bounceInDown" ref="product-widget">

                {/* The row with close button */}
                <Row>
                    <Col xs={12} className="text-right" style={{paddingRight: '0px', right: '-4px'}}>
                    <button className="btn btn-default" onClick={this.closeProductWidget}><i className="fa fa-times"></i></button>
                    </Col>
                </Row>

                {/* Product name */}
                <Row>
                    <Col xs={12} className="text-center">
                    <h2 className="product-name">{this.state.productData.name}</h2>
                    </Col>
                </Row>
                
                {/* Main content */}
                <Row>

                    {/* Image */}
                    <Col xs={3}>
                        <img src={this.state.productData.image_path}
                            alt={this.state.productData.name}
                            className="product-image"/>
                    </Col>

                    {/* Product info */}
                    <Col xs={3}>
                        <h4>Release date</h4>
                        <p>{this.state.productData.caracteristic_1}</p>
                        <h4>Tags</h4>
                        <p>{this.state.productData.tags.join(", ")}</p>
                        <h4>Overview</h4>
                        <p className="description"
                           ref="description"
                           data-toggle="popover"
                           data-content={this.state.productData.description}>
                            {description}
                        </p>
                    </Col>

                    {/* Reviewers */}
                    <Col xs={6} className="review-container">
                        <div className="reviewers">
                            <h4>Reviewers</h4>
                            <ReviewersCarousel currentPage={this.state.currentPage}
                                               productData={this.state.productData}/>
                        </div>
                    
                        {/* The Review */}
                        <Review/>
                    </Col>
                </Row>

                {/* Add to wishlist button */}
                <Row>
                    <Col xs={12} className="text-center">
                    <button className="btn btn-add">Add to wishlist</button>
                    </Col>
                </Row>
            </div>
        );
    }
})

    module.exports = ProductWidget;
