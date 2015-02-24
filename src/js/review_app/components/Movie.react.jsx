var React = require('react');
var MovieStore = require('../stores/MovieStore');
var MovieActions = require('../actions/MovieActions');

var Movie = React.createClass({
    popoverOptions: {
        trigger: 'hover',
        placement: 'auto',
        container: 'body'
    },
    cropName: false,
    cropLength: 15,
    componentDidMount: function(){
        if(this.cropName){
            $(this.refs.name.getDOMNode())
                  .popover(this.popoverOptions);
        }
    },
    componentDidUpdate: function(){
        if(this.cropName)
            $(this.refs.name.getDOMNode())
               .popover(this.popoverOptions);
    },
    componentWillUpdate: function(){
        if(this.cropName)
            $(this.refs.name.getDOMNode())
               .popover('destroy');
    },
    componentWillUnmount: function(){
        if(this.cropName)
            $(this.refs.name.getDOMNode()).popover('destroy');
    },
    render: function(){
        var name,
            movie_tags,
            imgReviewedClass,
            opacityControl,
            checkMark,
            button;
        if(this.props.data.name.length>this.cropLength){
            this.cropName = true;
            
        } else {
            this.cropName = false;
        }
        if(this.cropName){
            name = this.props.data.name.substring(0,this.cropLength)+"...";
        }
        else{
            name = this.props.data.name;
        }
        if(this.props.data.tags.length > 0)
            movie_tags = this.props.data.tags.join(", ");
        else
            movie_tags = null;

        if(this.props.data.reviewed == true){
            imgReviewedClass="reviewed";
            opacityControl = "low-opacity"
            checkMark = <i className="fa fa-check-circle"></i>;
            button = <button className="btn btn-success btn-sm" disabled>Reviewed!</button>
        }
        else {
            checkMark= "";
            opacityControl = "";
            imgReviewedClass="";
            button = <button className="btn btn-info btn-sm">I've seen it!</button>

        }
        return(
            <div className="movie">
            <div className="movie-inner effect6">
                <h5 className={opacityControl} ref="name" data-toggle="popover" data-content={this.props.data.name}>{name}</h5>
                <div className="img-container">
                    {checkMark}
                    <div className={opacityControl}>
                        <img data-lazy={this.props.data.image_path} alt={this.props.data.name}/>
                    </div>
                </div>
                <p className={opacityControl}>{this.props.data.caracteristic_1}</p>
                {button}
            </div>
            </div>
        );
    }
});

module.exports = Movie;
