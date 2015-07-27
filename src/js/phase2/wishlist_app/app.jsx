var React = require('react');
var WishlistApp = require("./components/WishlistApp.react.jsx");
var SideBarStore = require("./products/stores/SideBarStore");
var WidgetStore = require("./widget/stores/WidgetStore");
var ProductsStore = require("./products/stores/ProductsStore");
var Router = require("react-router");
var { Route, DefaultRoute, Redirect } = Router;
var ProductsPage = require("./products/components/ProductsPage.react.jsx");
var ProfilePage = require("./me/components/ProfilePage.react.jsx");

global.debug = require("debug");

var init = function init(data){

    // We setup the SideBar Store
    SideBarStore.setup(data.tags);

    // We setup the product store
    ProductsStore.setup(data.products);

    // we setup the widget store
    WidgetStore.setup(data.reviewElements);

    var routes = (
        <Route path="/" name="root" handler={WishlistApp}>
            <Route name="products" path="products" handler={ProductsPage}/>
            <Route name="profile" path="me" handler={ProfilePage}/>
            <Redirect from="/" to="products"/>
        </Route>
    );

    
    Router.run(routes, Router.HashLocation, (Root) => {
        React.render(<Root/>, document.getElementById("wishlist-app"));
    });
};

module.exports = init;
