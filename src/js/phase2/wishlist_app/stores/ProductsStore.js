var Reflux = require("reflux");
var ProductActions = require("../actions/ProductsActions");
var SideBarStore = require("./SideBarStore");

// Protected variables
var _products;

var ProductsStore = Reflux.createStore({

    listenables: [ProductActions],

    // called for initialization
    init: function(){
        // initialization
    },

    // setup called by us
    setup: function(products){
        _products = products;
    },

    // get the products
    getProducts: function(){
        return {
            products: _products
        };
    },

    // search products with text search, tags and sort
    onDoSearch: function(){

        var textVal = SideBarStore.getTextSearch();

        // because getTags returns an object to set state
        var tags = SideBarStore.getTags().tags;

        var sortBy = SideBarStore.getSortByMethod()
    }
});

module.exports = ProductsStore
