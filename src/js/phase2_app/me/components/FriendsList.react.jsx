const React = require("react"),
      Slider = require("react-slick"),
      Reflux = require("reflux"),
      { Link } = require("react-router"),
      getPic = require("../../utils/Utils.jsx").getPic;

const FriendsList = React.createClass({
  render(){
    const settings = {
      dots: true,
      infinite: false,
      arrows: true,
      speed: 500,
      slidesToShow: 8,
      slidesToScroll: 8
    };

    let slider = null;

    if(this.props.friends){
      let friends = this.props.friends.map(f => {
        return (
        <div className="friend-container" key={f.id}>
           <Link to={`/users/${f.id}`}>
           {getPic(f.pic)}
           <h4>{f.username}</h4>
        </Link>
        </div>
      )});
      slider = <Slider {...settings}>{friends}</Slider>;
    }
    return slider;
  }
});

module.exports = FriendsList;

