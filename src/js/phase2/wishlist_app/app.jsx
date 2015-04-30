var React = require('react');
var WishlistApp = require("./components/WishlistApp.react.jsx");
var SideBarStore = require("./stores/SideBarStore");
var ProductsStore = require("./stores/ProductsStore");

var init = function init(data){

    // We setup the SideBar Store
    SideBarStore.setup(data.tags);

    // We setup the product store
    ProductsStore.setup(data.products)

    // We render the root component
    React.render(
        React.createElement(WishlistApp),
        document.getElementById("wishlist-app")
    );

};

module.exports = init;
