'use strict';

var React = require("react"),
    Reflux = require("reflux"),
    WidgetStore = require("../stores/WidgetStore"),
    WidgetActions = require("../actions/WidgetActions"),
    debug = require("debug")(__filename),
    Review = require("./Review.react.jsx"),
    { Col, Row, Modal } = require("react-bootstrap"),
    popoverOptions = require("../../utils/Config").widgetPopoverOptions,
    WishlistActions = require("../../me/actions/WishlistActions"),
    WishlistStore = require("../../me/stores/WishlistStore"),
    ReviewersCarousel = require("./ReviewersCarousel.react.jsx");

var ProductWidget = React.createClass({

    mixins: [Reflux.listenTo(WidgetStore, 'showWidget')],

    getInitialState(){
        return WidgetStore.getWidgetState();
    },

    componentDidMount(){

        //we add the popover if the description is cropped
        if(this.state.productData.doCropDescription){
            $(this.refs.description.getDOMNode())
                  .popover(popoverOptions);
        }
    },

    componentWillUnmount(nextProps, nextState){
        //we remove the popover if the description is cropped
        if(this.state.productData.doCropDescription){
            $(this.refs.description.getDOMNode())
                  .popover('destroy');
        }

    },

    _addToWishlist(){
        WishlistActions.add(this.state.productData);
        WidgetActions.doHideWidget();

    },

    _removeFromWishlist(){
        WishlistActions.remove(this.state.productData);
        WidgetActions.doHideWidget();
    },

    _hideWidget(){
        WidgetActions.doHideWidget()
    },


    render: function(){

        var description = '',
            button = null;

        // Do we crop the description
        if(this.state.productData.doCropDescription){
            description = this.state.productData.cropDescription;
        } 
        else{
            description = this.state.productData.description;
        } 

        if(this.state.productData.iswish === true){
            button = (<button className="btn btn-danger btn-margin" onClick={this._removeFromWishlist}>Remove from wishlist</button>);
        } else {
            button = (<button className="btn btn-add btn-margin" onClick={this._addToWishlist}>Add to wishlist</button>);
        }

        return (
            <Modal show={this.state.showWidget} onHide={this._hideWidget} bsSize="large" id="product-widget">
                <Modal.Body>

                        {/* The row with close button */}
                        <Row>
                            <Col xs={12} className="text-right">
                                <button className="btn btn-default" onClick={this._hideWidget}><i className="fa fa-times"></i></button>
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
                                {button}
                            </Col>
                        </Row>
                </Modal.Body>
            </Modal>
        );
    }
})

    module.exports = ProductWidget;
