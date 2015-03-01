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
            <div className="review-app clearfix" id="review-app-inner">
                <ReviewBox reviewElements={this.props.reviewElements}/>
                <SideBar/>
                <MoviesContainer reviewElements={this.props.reviewElements}/>
            </div>
        );
    }
});

module.exports = ReviewApp;
