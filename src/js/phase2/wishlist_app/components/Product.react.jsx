var React = require("react");
var ImageLoader = require('react-imageloader');
var WidgetActions = require("../actions/WidgetActions");

// The crop length for the product name
var cropLength = 11,
    // The options for the title popover
    popoverOptions = {
        trigger: 'hover',
        placement: 'auto',
        container: 'body'
    };

var Product = React.createClass({

    // are we cropping?
    cropName: false,

    // called on onload
    showImage: function(){
        $(this.refs.img.getDOMNode()).fadeIn(200);
    },

    showProductWidget: function(){
        WidgetActions.doShowWidget(this.props.data);
    },

    componentWillUpdate: function(){
        // If the name was cropped, deactivate popover
        if(this.cropName){
            $(this.refs.name.getDOMNode())
               .popover('destroy');
        }
    },

    componentDidUpdate: function(prevprops, prevstate){
        // we dont hide the picture if we only update the checkmark sign
        if(prevprops.data.id !== this.props.data.id){
            $(this.refs.img.getDOMNode()).hide();
        }
        
        // If the name is cropped, activate popover
        if(this.cropName){
            $(this.refs.name.getDOMNode())
               .popover(popoverOptions);
        }
    },

    componentDidMount: function(){

        // We hide the image, because it'll show onload
        $(this.refs.img.getDOMNode()).hide();

        // We load the popover
        if(this.cropName){
            $(this.refs.name.getDOMNode())
                  .popover(popoverOptions);
        }
    },

    componentWillUnmount: function(){
        // If the name was cropped, deactivate popover
        if(this.cropName)
            $(this.refs.name.getDOMNode()).popover('destroy');
        
    },

    shouldComponentUpdate: function(nextProps, nextState){
        // we update if the id is not the same for the component
        // and if we're not on the same page
        if(nextProps.data.id != this.props.data.id ||
        nextProps.currentPage != this.props.currentPage){
            return true;
        }
        return false;
    },

    render: function(){

        var numReviewers;
        
        switch(this.props.data.numReviewers){
            case 0:
                numReviewersTag = <p>Nobody reviewed this product</p>;
                break;
            case 1:
                numReviewersTag = <p>{this.props.data.numReviewers} user reviewed this product</p>;
                break;
            default:
                numReviewersTag = <p>{this.props.data.numReviewers} users reviewed this product</p>;
        };

        // Name cropping
        var name;
        if(this.props.data.name.length > cropLength){
            this.cropName = true; 
            name = this.props.data.name.substring(0, cropLength) + "...";
        } else {
            this.cropName = false;
            name = this.props.data.name;
        };

        return (
            <div className="product effect6 animated fadeIn">

                {/* The product name */}
                <h5 ref="name"
                    data-toggle="popover"
                    data-content={this.props.data.name}>
                    {name}
                </h5>

                {/* The product image */}
                <div className="sm-img-container">
                    <ImageLoader ref="img"
                                 src={this.props.data.sm_image_path}
                                 onLoad={this.showImage}>
                    </ImageLoader>
                </div>

                {/* The product date */}
                <p>{this.props.data.caracteristic_1}</p>

                {/* How many people reviewed this product */}
                {numReviewersTag}

                {/* Open the box */}
                <button className="btn btn-info" onClick={this.showProductWidget}>More</button>
            </div>
        );
    }
})

module.exports = Product;
