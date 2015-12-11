import React from 'react';
import ReactDOM from 'react-dom';

import ReviewApp from './components/ReviewApp.react.jsx';

global.debug = require('debug');
// Rendering of root component
ReactDOM.render(
  React.createElement(ReviewApp),
  document.getElementById('reviewapp')
);
