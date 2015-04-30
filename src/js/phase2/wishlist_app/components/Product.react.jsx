var React = require("react");
var ImageLoader = require('react-imageloader');

// The crop length for the product name
var cropLength = 15,
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

    componentWillUpdate: function(){
        // If the name was cropped, deactivate popover
        if(this.cropName)
            $(this.refs.name.getDOMNode())
               .popover('destroy');
    },

    componentDidUpdate: function(){
        // If the name is cropped, activate popover
        if(this.cropName)
            $(this.refs.name.getDOMNode())
               .popover(this.popoverOptions);
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

    render: function(){
        // We get how many users reviewed the product
        var allr = this.props.data.all_reviewers;
        var numReviewers = allr ? this.props.data.all_reviewers.length : 0;
        var numReviewersTag;
        switch(numReviewers){
            case 0:
                numReviewersTag = <p>Nobody reviewed this product</p>;
                break;
            case 1:
                numReviewersTag = <p>{numReviewers} user reviewed this product</p>;
                break;
            default:
                numReviewersTag = <p>{numReviewers} users reviewed this product</p>;
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
            <div className="product effect6">

                {/* The product name */}
                <h5 ref="name"
                    data-toggle="popover"
                    data-content={this.props.data.name}>
                    {name}
                </h5>

                {/* The product image */}
                <ImageLoader ref="img"
                             src={this.props.data.sm_image_path}
                             onLoad={this.showImage}>
                </ImageLoader>

                {/* The product date */}
                <p>{this.props.data.caracteristic_1}</p>

                {/* How many people reviewed this product */}
                {numReviewersTag}

                {/* Open the box */}
                <button className="btn btn-info">More</button>
            </div>
        );
    }
})

module.exports = Product;
