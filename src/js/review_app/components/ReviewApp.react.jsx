var React = require('react/addons');
var MovieStore = require('../stores/MovieStore');
var ReviewBoxStore = require('../stores/ReviewBoxStore');
var MovieActions = require('../actions/MovieActions');
var SideBar = require("./SideBar.react.jsx");
var ReviewBox = require("./ReviewBox.react.jsx");
var MoviesContainer = require("./MoviesContainer.react.jsx");
var assign = require('object-assign');

var ReviewApp = React.createClass({
    getInitialState: function(){
        MovieStore.init(this.props.products, this.props.tags);
        ReviewBoxStore.init();
        MovieStore.shuffleMovies();
        return null;
    },
    render: function(){
        return(
            <div className="review-app row" id="review-app-inner">
                <SideBar/>
                <MoviesContainer/>
            </div>
        );
    }
});

module.exports = ReviewApp;
