var React = require('react/addons');
var CSSTransitionGroup = React.addons.CSSTransitionGroup;
var ProductPage = require("./ProductPage.react.jsx")
var ProductStore = require('../stores/ProductStore');
var ProductActions = require('../actions/ProductActions');
var ReviewBox = require("./ReviewBox.react.jsx");

// Options for slick carousel
var slickOptions = {
    // where to append the arrows
    appendArrows: '#arrows',
    // lazy-load of the images
    lazyLoad: 'ondemand',
    // what is the prevArrow
    prevArrow: '<button class="btn btn-default arrow"'+
               ' id="left-arrow"><i '+
               'class="fa fa-chevron-left"></i></button>',
    // what is the nextArrow
    nextArrow: '<button class="btn btn-default arrow"'+
               ' id="right-arrow"><i '+
               'class="fa fa-chevron-right"></i></button>'
};

//Return the products
function getProductsState(){
    return ProductStore.getProducts();
}

/**
 * PRODUCTS CONTAINER COMPONENT
 * The right-most container of the review app containing the products
 */
var ProductsContainer = React.createClass({
    getInitialState: function(){
        return getProductsState();
    },
    componentDidMount: function(){

        // We listen to the product store
        ProductStore.addChangeListener(this._onChange);

        // We slick the products!
        $('#slick-it').slick(slickOptions);
    },
    componentWillUpdate: function(nextProps, nextState){

        // In case we are rerendering but we dont need to slick again
        // like if only set a product to reviewed
        // So we DONT unslick!
        // see this.componentDidUpdate
        if(!nextState.dontSlick)
            $('#slick-it').slick('unslick');
    },
    componentDidUpdate: function(prevProps, prevState){

        // In case we are rerendering but we dont need to slick again
        if(!this.state.dontSlick)
            $('#slick-it').slick(slickOptions);

        // We set it back to false because slicking is default behavior
        ProductStore.setDontSlick(false);

        // We always set back _reviewedPage to null because we might be done updating
        // after reviewing a product.
        ProductStore.setReviewedPage(null);
    },
    componentWillUnmount: function(){
        ProductStore.removeChangeListener(this._onChange);
        $('#slick-it').slick('unslick');
    },
    _onChange: function(){
        this.setState(getProductsState());
    },
    render: function(){
        var productPages = this.state.products.map(function(mp, i){
            return(
                <ProductPage products={mp} key={i} id={i}/>
            );
        }.bind(this));

        return(
            <div className="product-pages col-xs-9">
                <div id="arrows" className="will-fade"></div>
                <div id="slick-it" className="will-fade">
                    {productPages}
                </div>
            </div>
        );
    }
});

module.exports = ProductsContainer;
