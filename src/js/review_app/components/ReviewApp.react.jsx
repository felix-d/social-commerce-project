var React = require('react');
var MovieStore = require('../stores/MovieStore');
var MovieActions = require('../actions/MovieActions');
var SideBar = require("./SideBar.react.jsx");
var MoviesContainer = require("./MoviesContainer.react.jsx");

function getMoviesState() {
    return MovieStore.getAllMoviesAndTags();
}
var ReviewApp = React.createClass({
    getInitialState: function(){
        MovieStore.shuffleMovies();
        return getMoviesState();
    },
    componentDidMount: function(){
        MovieStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function(){
        MovieStore.removeChangeListener(this._onChange);
    },
    render: function(){
        return(
            <div className="row">
                <div className="review-app">
                    <SideBar tags={this.state.tags}/>
                    <MoviesContainer moviePages={this.state.movies}/>
                </div>
            </div>
        );
    },
    _onChange: function(){
        this.setState(getMoviesState());
    }

});

module.exports = ReviewApp;
