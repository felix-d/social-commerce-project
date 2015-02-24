var React = require('react');
var MoviePage = require("./MoviePage.react.jsx")
var MovieStore = require('../stores/MovieStore');
var MovieActions = require('../actions/MovieActions');

var slickOptions = {
    appendArrows: '#arrows',
    lazyLoad: 'ondemand',
    prevArrow: '<button class="btn btn-default arrow" id="left-arrow"><i class="fa fa-chevron-left"></i></button>',
    nextArrow: '<button class="btn btn-default arrow" id="right-arrow"><i class="fa fa-chevron-right"></i></button>'
};

var MoviesContainer = React.createClass({
    componentDidMount: function(){
        $('#slick-it').slick(slickOptions);
    },
    componentWillUpdate: function(){
        $('#slick-it').slick('unslick');
    },
    componentDidUpdate: function(){
        $('#slick-it').slick(slickOptions);
    },
    componentWillUnmount: function(){
        $('#slick-it').slick('unslick');
    },
    render: function(){
        var moviePages = this.props.moviePages.map(function(mp, i){
            return(
                <MoviePage movies={mp} key={i}/>
            );
        });
        return(
            <div className="movie-pages col-xs-9">
                <div id="arrows"></div>
                <div id="slick-it">
                {moviePages}
                </div>
            </div>
        );
    }
});

module.exports = MoviesContainer;
