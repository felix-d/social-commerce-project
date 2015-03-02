var React = require('react/addons');
var CSSTransitionGroup = React.addons.CSSTransitionGroup;
var ProductPage = require("./ProductPage.react.jsx")
var ProductStore = require('../stores/ProductStore');
var ProductActions = require('../actions/ProductActions');
var ReviewBox = require("./ReviewBox.react.jsx");

var slickOptions = {
    appendArrows: '#arrows',
    lazyLoad: 'ondemand',
    prevArrow: '<button class="btn btn-default arrow" id="left-arrow"><i class="fa fa-chevron-left"></i></button>',
    nextArrow: '<button class="btn btn-default arrow" id="right-arrow"><i class="fa fa-chevron-right"></i></button>'
};
function getProductsState(){
    return ProductStore.getProducts();
}
var ProductsContainer = React.createClass({
    getInitialState: function(){
        return getProductsState();
    },
    componentDidMount: function(){
        ProductStore.addChangeListener(this._onChange);
        $('#slick-it').slick(slickOptions);
    },
    componentWillUpdate: function(nextProps, nextState){
        //in case we are rerendering but we dont need to slick again
        //like if only set a product to reviewed
        //so we dont unslick
        //see componentDidUpdate
        if(!nextState.dontSlick)
            $('#slick-it').slick('unslick');
    },
    componentDidUpdate: function(prevProps, prevState){
        //in case we are rerendering but we dont need to slick again
        if(!this.state.dontSlick)
            $('#slick-it').slick(slickOptions);

        //we set it back to false because slicking is default behavior
        ProductStore.setDontSlick(false);
        //we always set back _reviewdPage to null because we might be done updating
        //after reviewing a product
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
