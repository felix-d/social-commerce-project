var React = require('react/addons');
var ReviewApp = require('./components/ReviewApp.react.jsx');
//Called in the django template
var init = function init(data){
    
    //we preload images
    function preload() {
	for (i = 0; i < preload.arguments.length; i++) {
	    images[i] = new Image();
	    images[i].src = preload.arguments[i];
	}
    }
    var images = [];
    for(var i=0; i<data.products.length; i++){
        console.log(data.products[i].image_path);
        images.push(data.products[i].image_path);
    }
    preload.apply(this, images);

    //Rendering of root component
    React.render(
        React.createElement(ReviewApp, data),
        document.getElementById('reviewapp')
    );
}

module.exports = init;
