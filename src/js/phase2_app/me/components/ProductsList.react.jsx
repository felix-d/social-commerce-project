const React = require("react"),
      Slider = require("react-slick"),
      debug = require("debug")(__filename),
      Review = require("../../components/Review.react.jsx"),
      {Button, OverlayTrigger, Popover} = require("react-bootstrap");

const cropMax = 10;

const PopoverButton = React.createClass({
  componentDidMount() {
    console.log("mounted");
  },
  getInitialState() {
    return {
      isShowing: false
    }
  },
  hide() {
    this.refs["trigger"].hide();
    this.setState({isShowing: false});
  },
  _click() {
    this.setState({isShowing: !this.state.isShowing});
  },
  render() {
    return (
      <OverlayTrigger trigger="click"
                      placement="top"
                      ref="trigger"
                      overlay={this.props.overlay}>
         <Button className="btn btn-info user-page__see-review-button" onClick={this._click}>
            {this.state.isShowing ? "Hide review" : "See review"}
         </Button>
      </OverlayTrigger>
    );
  }
});

const ProductsList = React.createClass({

  _$slickArrows: null,

  _popoverButtons: [],

  componentDidMount(){
    // We hide popovers when we click on an arrow
    this._$slickArrows = $(".slick-prev, .slick-next");
    this._$slickArrows.click(event => {
      this._popoverButtons.forEach(p => {
        p.hide();
      })
    });
  },


  componentwillunmount(){
    this._$slickArrows.unbind("click");
  },

  render(){

    let slider = null;

    
    if(this.props.products) {
      
      const settings = {
        dots: true,
        infinite: false,
        arrows: true,
        speed: 500,
        slidesToShow: 9,
        slidesToScroll: 9 
      };

      let review = this.props.review || false,
          button = null;

      let products = this.props.products.map(p => {

        let cropName = false,
            original = null,
            name = p.name,
            shortName = null,
            img = null;
        
        if(p.name.length > cropMax){
          original = p.name;
          shortName = original.substring(0, cropMax + 3) + "...";
          
          name = (
            <OverlayTrigger trigger={["hover", "focus"]}
                            placement="top"
                            overlay={<Popover>{original}</Popover>}>
               <span>{shortName}</span>
            </OverlayTrigger>
          );
        }

        if(review){
          let props = {
            answers: p.review.boolAnswers,
            rating: p.review.rating,
            comment: p.review.comment
          };
          review = p.review.boolAnswers || p.review.rating || p.review.comment ? <Review {...props}/> : "The review is empty.";

          let popover = <Popover>{review}</Popover>;

          button = <PopoverButton overlay={popover} ref={pb => this._popoverButtons.push(pb)}/>;
        }
        
        return (
        <div className="product-list__product" key={p.id}>
           <h5>{name}</h5>
          <img src={p.sm_image_path} alt=""/>
           {button}
        </div>
        );
      });
      slider = <Slider {...settings}>{products}</Slider>;
    }
    return slider;
  }
});

module.exports = ProductsList;

