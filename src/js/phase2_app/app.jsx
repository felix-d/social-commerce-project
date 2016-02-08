import 'superagent-django-csrf';
import { createHashHistory } from 'history';

import React from 'react';
import { render } from 'react-dom';
import { Route, Router, Redirect, IndexRedirect } from 'react-router';

import WishlistApp from './components/WishlistApp.react.jsx';
import ProductsPage from './products/components/ProductsPage.react.jsx';
import ProfilePage from './me/components/ProfilePage.react.jsx';
import UserPage from './users/components/UserPage.react.jsx';

global.debug = require('debug');

const history = createHashHistory({queryKey: false});

var routes = (
  <Router history={history}>
    <Route path="/" component={WishlistApp}>
      <IndexRedirect to="products"/>
      <Route path="products" component={ProductsPage}/>
      <Route path="profile" component={ProfilePage}/>
      <Route path="users/:userId" component={UserPage}/>
      <Redirect from="*" to="products"/>
    </Route>
  </Router>
);

render(routes, document.getElementById('wishlist-app'));
