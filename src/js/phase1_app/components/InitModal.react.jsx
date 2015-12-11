import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default React.createClass({

  getInitialState() {
    return {
      show: true,
    };
  },

  _hide() {
    this.setState({
      show: false,
    });
  },

  render() {
    return (
      <Modal show={this.state.show} onHide={this._hide} className="init-modal">
        <Modal.Header closeButton>
          <Modal.Title>The title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sem velit, suscipit
          sit amet lectus sed, consequat interdum quam. Sed in ipsum nec sem tempus
          porttitor. Nulla eu lectus vel odio aliquam rhoncus. Sed ultrices metus egestas
          posuere mattis. Sed mattis tellus ac sapien accumsan, in consequat diam cursus.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tristique
          pellentesque nulla, vel placerat sapien dignissim sit amet. Morbi dignissim
          iaculis erat, quis ultricies arcu vulputate sit amet. Morbi ultricies varius
          ultricies. Aliquam erat volutpat. Aliquam erat volutpat. Quisque sed ex massa.
          </p>
        <div className="init-modal__btn-container">
          <Button bsStyle="primary" onClick={this._hide}>Ok I got it!</Button>
        </div>
        </Modal.Body>
      </Modal>
    );
  },
});
