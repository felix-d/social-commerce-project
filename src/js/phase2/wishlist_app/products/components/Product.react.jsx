var React = require("react"),
    ImageLoader = require('react-imageloader'),
    WidgetActions = require("../../widget/actions/WidgetActions"),
    WishlistStore = require("../../me/stores/WishlistStore"),
    WishlistActions = require("../../me/actions/WishlistActions"),
    { OverlayTrigger, Popover } = require('react-bootstrap'),
    classnames = require("classnames"),
    Reflux = require("reflux");

// The crop length for the product name
var cropLength = 11;

var Product = React.createClass({

  mixins: [Reflux.connect(WishlistStore)],
  
  // called on onload
  _showImage: function(){
    $(this.refs.img.getDOMNode()).fadeIn(200);
  },

  _showProductWidget: function(){
    WidgetActions.doShowWidget(this.props.data);
  },


  componentDidUpdate: function(prevprops, prevstate){
    // we dont hide the picture if we only update the checkmark sign
    if(prevprops.data.id !== this.props.data.id){
      $(this.refs.img.getDOMNode()).hide();
    }
  },

  componentDidMount: function(){
    // We hide the image, because it'll show onload
    $(this.refs.img.getDOMNode()).hide();
  },

  shouldComponentUpdate: function(nextProps, nextState){
    // we update if the id is not the same for the component
    // and if we're not on the same page (all, f, fof)
    // or if the product just got add or removed from whishlist
    if(nextProps.data.id !== this.props.data.id ||
       nextProps.currentPage !== this.props.currentPage ||
       WishlistStore.getIdLastSetProduct() === this.props.data.id) {

      WishlistActions.resetIdLastSetProduct();

      return true;
    }
    return false;
  },

  render: function(){

    var numReviewers,
        numReviewersTag,
        opacityControl,
        textClassName,
        imgContainerClassName,
        starIcon,
        name;

    // Name cropping
    if(this.props.data.name.length > cropLength){
      const popover = (<Popover>{this.props.data.name}</Popover>);
      name = (
        <OverlayTrigger trigger="hover"
                        ref="trigger"
                        placement="top"
                        overlay={popover}>
           <h5>
              {this.props.data.name.substring(0, cropLength) + "..."}
           </h5>
        </OverlayTrigger>
      );
    } else {
      name = (<h5>{this.props.data.name}</h5>);
    };

    // Control of the opacity changes
    textClassName = classnames({
      "low-opacity": !!this.props.data.iswish
    });
    
    imgContainerClassName = classnames("sm-img-container", {
      "low-opacity": !!this.props.data.iswish
    });

    starIcon = this.props.data.iswish ? (<i className="fa fa-star"></i>) : null;

    // The little message under the picture
    switch(this.props.data.numReviewers){
    case 0:
      numReviewersTag = "Nobody reviewed this product";
      break;
    case 1:
      numReviewersTag = `${this.props.data.numReviewers} user reviewed this product`;
      break;
    default:
      numReviewersTag = `${this.props.data.numReviewers} users reviewed this product`;
    };


    let buttonClassnames = classnames("btn", {
      "btn-info": !this.props.data.iswish,
      "btn-danger": this.props.data.iswish
    });

    return (
        <div className="product effect6 animated fadeIn">

        {/* The product name */}
           {name}

        {/* The product image */}
        <div className="star-container">
            {starIcon}
            <div className={imgContainerClassName}>
                <img ref="img"
            src={this.props.data.sm_image_path}
            onLoad={this._showImage}/>
            </div>
        </div>

        {/* The product date */}
        <p className={textClassName}>{this.props.data.caracteristic_1}</p>

        {/* How many people reviewed this product */}
        <p className={textClassName}>{numReviewersTag}</p>

        {/* Open the box */}
        <button className={buttonClassnames} onClick={this._showProductWidget}>
           {this.props.data.iswish ? "Remove" : "More Info"}
        </button>
        </div>
    );
  }
});

module.exports = Product;
