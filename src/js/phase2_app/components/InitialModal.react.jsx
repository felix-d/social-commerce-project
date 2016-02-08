import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import UserActions from '../me/actions/UserActions';
import track from '../tracking';

export default React.createClass({

  getInitialState() {
    return {
      show: true,
      step: 1,
    };
  },

  _hide() {
    track('TASK_STARTED');
    UserActions.closeInitModal();
    this.setState({
      show: false,
    });
  },

  _getInner(step) {
    let message = null;
    switch (step) {
      case 1:
        message = `Lorem ipsum dolor sit amet, consectetur aditpiscing elit. Sed
        faucibus risus vel tincidunt rutrum. Sed non bibendum odio. In bibendum
        non est id scelerisque. Fusce in erat in dui bibendum accumsan a non
        metus. Nulla turpis metus, pellentesque non posuere in, tempor semper
        ex. Aliquam tempor ante et felis consequat, id sagittis libero
        convallis. Praesent scelerisque sapien nibh, ut volutpat ligula cursus
        vel. Fusce aliquet venenatis egestas. Curabitur viverra a orci id
        tincidunt. Mauris massa quam, commodo sit amet lacinia quis, porttitor
        non velit.`;
        break;
      case 2:
        message = `Sed non bibendum odio. In bibendum
        non est id scelerisque. Fusce in erat in dui bibendum accumsan a non
        metus. Nulla turpis metus, pellentesque non posuere in, tempor semper
        ex. Aliquam tempor ante et felis consequat, id sagittis libero
        convallis. Praesent scelerisque sapien nibh, ut volutpat ligula cursus
        vel. Fusce aliquet venenatis egestas. Curabitur viverra a orci id
        tincidunt. Mauris massa quam, commodo sit amet lacinia quis, porttitor
        non velit.`;
        break;
      case 3:
        message = `Sed non bibendum odio. In bibendum
        non est id scelerisque. Fusce in erat in dui bibendum accumsan a non
        metus. Nulla turpis metus, pellentesque non posuere in, tempor semper
        ex. Aliquam tempor ante et felis consequat, id sagittis libero
        convallis. Praesent scelerisque sapien nibh, ut volutpat ligula cursus
        vel. Fusce aliquet venenatis egestas. Curabitur viverra a orci id
        tincidunt. Mauris massa quam, commodo sit amet lacinia quis, porttitor
        non velit.`;
        break;
      default:
    }
    return <p>{message}</p>;
  },

  _getStepMessage(step) {
    let message = null;
    switch (step) {
      case 1:
        message = '1/3';
        break;
      case 2:
        message = '2/3';
        break;
      case 3:
        message = '3/3';
        break;
      default:
    }
    return <p className="init-modal__current-step">{message}</p>;
  },

  _nextStep() {
    this.setState({step: ++this.state.step});
  },

  render() {
    let button = null;
    if (this.state.step === 3) {
      button = <Button bsStyle="success" onClick={this._hide}>Ok I got it!</Button>;
    } else {
      button = <Button bsStyle="primary" onClick={this._nextStep}>Next</Button>;
    }
    return (
      <Modal backdrop="static" show={this.state.show} onHide={this._hide} className="init-modal">
        <Modal.Header>
          <Modal.Title>Intro Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this._getInner(this.state.step)}
          {this._getStepMessage(this.state.step)}
        <div className="init-modal__btn-container">
          {button}
        </div>
        </Modal.Body>
      </Modal>
    );
  },
});
