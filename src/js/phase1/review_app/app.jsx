var React = require('react/addons');
var ReviewApp = require('./components/ReviewApp.react.jsx');

//Called in the django template
var init = function init(data){

    //Rendering of root component
        React.render(
            React.createElement(ReviewApp, data),
            document.getElementById('reviewapp')
        );
}

module.exports = init;
