var React = require('react');
var ReviewApp = require('./components/ReviewApp.react.jsx');

global.debug = require("debug");

//Called in the django template
var init = function init(data){

    //Rendering of root component
        React.render(
            React.createElement(ReviewApp, data),
            document.getElementById('reviewapp')
        );
}

module.exports = init;
