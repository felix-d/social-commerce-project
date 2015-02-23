var React = require('react');
var MovieStore = require('../stores/MovieStore');
var MovieActions = require('../actions/MovieActions');


function getMoviesState() {
    return {
        allMovies: MovieStore.getAllMovies()
    }
}

var ReviewApp = React.createClass({
    getInitialState: function(){
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
            <div>
                <h1>test</h1>
                <h1>test</h1>
                <h1>test</h1>
                <h1>test</h1>
                <h1>test</h1>
            </div>
        );
    },
    _onChange: function(){
        this.setState(getMoviesState());
    }

});

module.exports = ReviewApp;
