var React = require('react/addons');
var ReviewForm = require("./ReviewForm.react.jsx");
var CSSTransitionGroup = React.addons.CSSTransitionGroup;
var ReviewBoxStore = require('../stores/ReviewBoxStore');
var MovieActions = require('../actions/MovieActions');

function getReviewState(){
    return ReviewBoxStore.getReviewState();
}

var ReviewBox = React.createClass({
    popoverOptions: {
        trigger: 'hover',
        placement: 'auto',
        container: '#review-widget'
    },
    getInitialState: function(){
        return getReviewState();
    },
    _onChange: function(){
        this.setState(getReviewState());
    },
    closeReviewBox: function(){
        MovieActions.closeReviewBox();  
    },
    componentDidMount: function(){

        ReviewBoxStore.addChangeListener(this._onChange);
    },
    componentWillUnmount:function(){
        ReviewBoxStore.removeReviewChangeListener(this._onChange);
    },
    componentDidUpdate: function(){
        //we add the popover
        if(this.state.open && this.state.movie.doCropDescription){
            $(this.refs.description.getDOMNode())
                  .popover(this.popoverOptions);
        }
    },
    componentWillUpdate: function(){
        //we remove the popover if the state is open (not yet updated)
        if(this.state.open && this.refs.description && this.state.movie.doCropDescription){
            $(this.refs.description.getDOMNode())
                  .popover('destroy');
        }
    },
    render: function(){
        var description = '';
        if(this.state.movie.doCropDescription){
            description = this.state.movie.cropDescription;
        } 
        else{
            description = this.state.movie.description;
        } 
        var reviewWidget =
        <div className="col-md-10 col-md-offset-2 col-xs-12" id="review-widget">
            <div className="row">
                <div className="col-md-12 text-right" style={{paddingRight: '0px', right: '-4px'}}>
                    <button className="btn btn-default" onClick={this.closeReviewBox}><i className="fa fa-times"></i></button>
                </div>
            </div>

            <div className="row">
                <div className="col-md-12 text-center">
                    <h2 className="movie-name">{this.state.movie.name}</h2>
                </div>
            </div>

            <div className="row inner">

                <div className="col-md-3">
                    <img src={this.state.movie.image_path} alt={this.state.movie.name} className="movie-image"/>
                </div>

                <div className="col-md-3">
                    <h4>Release date</h4>
                    <p>{this.state.movie.caracteristic_1}</p>
                    <h4>Tags</h4>
                    <p>{this.state.movie.tags.join(", ")}</p>
                    <h4>Overview</h4>
                    <p className="description" ref="description" data-toggle="popover" data-content={this.state.movie.description}>{description}</p>
                </div>

                <div className="col-md-6">
                    <ReviewForm movie={this.state.movie} reviewElements={this.props.reviewElements}/>
                </div>
            </div>
        </div>
        return(

        <CSSTransitionGroup transitionName="example">
            {this.state.open ? reviewWidget : null}
        </CSSTransitionGroup>
        );
        
    }
});

module.exports = ReviewBox;
