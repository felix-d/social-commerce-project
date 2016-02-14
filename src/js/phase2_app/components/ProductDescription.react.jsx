import React, { PropTypes } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

const CROP_LENGTH = 150;

export default React.createClass({

  propTypes: {
    data: PropTypes.object.isRequired,
    cropLength: PropTypes.number,
  },

  render() {
    let descriptionComponent = null;
    const cropLength = this.props.cropLength || CROP_LENGTH;
    const doCropDescription = this.props.data.description.length > cropLength;
    if (doCropDescription) {
      const cropDescription = this.props.data.description.substring(0, cropLength) + '...';
      const popover = (
        <Popover id={this.props.data.name}>
          {this.props.data.description}
        </Popover>
      );
      descriptionComponent = (
        <OverlayTrigger trigger={['hover', 'focus']} placement="left" overlay={popover}>
          <p>
            {cropDescription}
          </p>
        </OverlayTrigger>
      );
    } else {
      descriptionComponent = <span>{this.props.data.description}</span>;
    }
    return (
      <div>
        <h4>Release date</h4>
        <p>{this.props.data.caracteristic_1}</p>
        <h4>Tags</h4>
        <p>{this.props.data.tags.join(', ')}</p>
        <h4>Overview</h4>
        <div>{descriptionComponent}</div>
      </div>
    );
  },
});
