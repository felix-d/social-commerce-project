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
    componentWillUpdate: function(nextProps, nextState){
        //in case we are rerendering but we dont need to slick again
        //like if only set a movie to reviewed
        //so we dont unslick
        //see componentDidUpdate
        if(!nextState.dontSlick)
            $('#slick-it').slick('unslick');
    },
    componentDidUpdate: function(prevProps, prevState){
        //we always set back _reviewdPage to null because we might be done updating
        //after reviewing a movie
        MovieStore.setReviewedPage(null);
        //in case we are rerendering but we dont need to slick again
        if(!this.state.dontSlick)
            $('#slick-it').slick(slickOptions);
        //we set it back to false because slicking is default behavior
        MovieStore.setDontSlick(false);
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
                <MoviePage movies={mp} key={i} id={i}/>
            );
        }.bind(this));

        return(
            <div className="movie-pages col-md-9">
                <div id="arrows" className="will-fade"></div>
                <div id="slick-it" className="will-fade">
                    {moviePages}
                </div>
            </div>
        );
    }
});

module.exports = MoviesContainer;
