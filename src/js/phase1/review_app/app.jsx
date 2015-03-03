var React = require('react/addons');
var ReviewApp = require('./components/ReviewApp.react.jsx');

var init = function init(data){
    React.render(
        React.createElement(ReviewApp, data),
        document.getElementById('reviewapp')
    );
}

module.exports = init;
