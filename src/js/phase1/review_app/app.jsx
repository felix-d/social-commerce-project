import React from 'react';
import ReactDOM from 'react-dom';

import ReviewApp from './components/ReviewApp.react.jsx';

global.debug = require('debug');

// Called in the django template
var init = function init(data) {

  // Rendering of root component
  ReactDOM.render(
    React.createElement(ReviewApp, data),
    document.getElementById('reviewapp')
  );
};

module.exports = init;
