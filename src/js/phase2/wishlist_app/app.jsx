var React = require('react'),
    WishlistApp = require("./components/WishlistApp.react.jsx"),
    SideBarStore = require("./products/stores/SideBarStore"),
    WidgetStore = require("./widget/stores/WidgetStore"),
    ProductsStore = require("./products/stores/ProductsStore"),
    Router = require("react-router"),
    RouterActions = require("./router/actions/RouterActions"),
    ProductsActions = require("./products/actions/ProductsActions"),
    { Route, DefaultRoute, Redirect } = Router,
    ProductsPage = require("./products/components/ProductsPage.react.jsx"),
    ProfilePage = require("./me/components/ProfilePage.react.jsx");

require("./router/stores/RouterStore");
require('superagent-django-csrf');

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
        RouterActions.routeChanged(Router.HashLocation.getCurrentPath());
        React.render(<Root/>, document.getElementById("wishlist-app"));
    });
};

module.exports = init;
