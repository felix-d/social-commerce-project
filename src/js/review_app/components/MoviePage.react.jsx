var React = require('react/addons');
var MovieStore = require('../stores/MovieStore');
var MovieActions = require('../actions/MovieActions');
var Movie = require('./Movie.react.jsx');



var MoviePage = React.createClass({
    componentDidMount: function(){
    },
    componentWillUnmount: function(){
    },
    componentDidUpdate: function(){
    },
    componentWillUpdate: function(){
    },
    shouldComponentUpdate: function(nextProps, nextStates){
        if(MovieStore.getReviewedPage() ===
            nextProps.id ||
            MovieStore.getReviewedPage() ===
            null)
            return true;
        console.log("page wasnt updated");
        return false;
    },
    render: function(){
        var movies = this.props.movies.map(function(m, i){
            return(
                <Movie data={m} key={i}/>
            );
        }.bind(this));
        return(
            <div className="movie-page">
                {movies}
            </div>
        );
    }
});

module.exports = MoviePage;
