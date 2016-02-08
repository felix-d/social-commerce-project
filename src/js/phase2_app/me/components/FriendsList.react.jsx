import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router';
import { getPic } from '../../utils/Utils.jsx';
import { Alert } from 'react-bootstrap';
import { isEmpty } from 'lodash';

const FriendsList = React.createClass({

  propTypes: {
    friends: React.PropTypes.array,
    trackFriendClicked: React.PropTypes.func,
    slidesToShow: React.PropTypes.number,
    networkTraversing: React.PropTypes.bool,
  },

  render() {
    if (!this.props.friends || isEmpty(this.props.friends)) {
      return (
        <Alert bsStyle="danger" className="no-friends-warning">
        You have no Facebook friends connected to Review It!.
        </Alert>
      );
    }
    const settings = {
      dots: false,
      infinite: false,
      arrows: true,
      speed: 500,
      slidesToShow: this.props.slidesToShow || 8,
      slidesToScroll: 1,
    };

    let slider = null;


    if (this.props.friends) {
      const friends = this.props.friends.map(f => {
        let link = null;
        if (this.props.networkTraversing) {
          link = (
            <Link
                to={`/users/${f.id}`}
                onClick={this.props.trackFriendClicked.bind(null, f.id)}
                disabled={!this.props.networkTraversing}>
              {getPic(f.pic)}
              <h4>{f.username}</h4>
            </Link>
          );
        } else {
          link = (
            <div>
              {getPic(f.pic)}
              <h4>{f.username}</h4>
            </div>
          );
        }
        return (
          <div className="friend-container" key={f.id}>
            {link}
          </div>
        );
      });
      slider = <Slider {...settings}>{friends}</Slider>;
    }
    return slider;
  },
});

module.exports = FriendsList;

