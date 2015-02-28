var React = require('react/addons');
var CSSTransitionGroup = React.addons.CSSTransitionGroup;
var MoviePage = require("./MoviePage.react.jsx")
var MovieStore = require('../stores/MovieStore');
var MovieActions = require('../actions/MovieActions');
var ReviewBox = require("./ReviewBox.react.jsx");

var slickOptions = {
    appendArrows: '#arrows',
    lazyLoad: 'ondemand',
    prevArrow: '<button class="btn btn-default arrow" id="left-arrow"><i class="fa fa-chevron-left"></i></button>',
    nextArrow: '<button class="btn btn-default arrow" id="right-arrow"><i class="fa fa-chevron-right"></i></button>'
};
function getProductsState(){
    return MovieStore.getProducts();
}
var MoviesContainer = React.createClass({
    getInitialState: function(){
        return getProductsState();
    },
    componentDidMount: function(){
        MovieStore.addChangeListener(this._onChange);
        $('#slick-it').slick(slickOptions);
    },
    componentWillUpdate: function(){
        $('#slick-it').slick('unslick');
    },
    componentDidUpdate: function(){
        $('#slick-it').slick(slickOptions);
    },
    componentWillUnmount: function(){
        MovieStore.removeChangeListener(this._onChange);
        $('#slick-it').slick('unslick');
    },
    _onChange: function(){
        this.setState(getProductsState());
    },
    render: function(){
        var moviePages = this.state.products.map(function(mp, i){
            return(
                <MoviePage movies={mp} key={i}/>
            );
        }.bind(this));

        return(
            <div className="movie-pages col-md-9">
                <div className="row">
                    <ReviewBox/>
                </div>
                <div id="arrows" className="will-fade"></div>
                <div id="slick-it" className="will-fade">
                    {moviePages}
                </div>
            </div>
        );
    }
});

module.exports = MoviesContainer;
