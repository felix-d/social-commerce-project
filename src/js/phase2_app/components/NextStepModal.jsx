import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import track from '../tracking';

export default React.createClass({

  propTypes: {
    close: React.PropTypes.func,
    show: React.PropTypes.bool,
  },

  taskFinished() {
    track('TASK_FINISHED');
  },

  render() {


    return (
      <Modal show={this.props.show} onHide={this.props.close} className="next-step-modal">
        <Modal.Header closeButton>
          <Modal.Title>Next step modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Hey you have reviewed enough movies to go to the next step!
          </p>
        <div className="next-step-modal__btn-container">
          <Button bsStyle="primary" onClick={this.props.close}>Continue reviewing</Button>
          <Button bsStyle="success" href="step2" onClick={this.taskFinished}>Go to next step!</Button>
        </div>
        </Modal.Body>
      </Modal>
    );
  },
});
