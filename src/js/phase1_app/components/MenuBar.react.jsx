import React from 'react';
import { Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap';

import ProductStore from '../stores/ProductStore';
import HelpModal from './HelpModal.react.jsx';


function getState() {
  const numReviews = ProductStore.getNumReviews();
  const requiredReviews = ProductStore.getNumRequiredReviews();
  return {
    numReviews,
    requiredReviews,
  };
}

function getInfoNavItem(numR, numReq) {
  let text = null;
  let navitemId = 'navbar-info--warning';
  if (numR === 1) {
    text = `1 product reviewed, only ${numReq - numR} left!`;
  } else if (numR === 0) {
    navitemId = 'navbar-info--danger';
    text = `0 product reviewed, only ${numReq - numR} left!`;
  } else if (numR < numReq) {
    text = `${numR} products reviewed, only ${numReq - numR} left!`;
  } else {
    navitemId = 'navbar-info--success';
    text = `${numR} products reviewed, you can review more or go to the next step!`;
  }
  return <NavItem id={navitemId}>{text}</NavItem>;
}

export default React.createClass({

  getInitialState() {
    return getState();
  },

  componentDidMount() {
    ProductStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    ProductStore.removeChangeListener(this._onChange);
  },

  _closeHelpModal() {
    this.setState({
      showHelpModal: false,
    });
  },

  _openHelpModal(e) {
    e.preventDefault();
    this.setState({
      showHelpModal: true,
    });
  },
  _onChange() {
    this.setState(getState());
  },
  render() {
    const infoNavItem = getInfoNavItem(this.state.numReviews, this.state.requiredReviews);
    const disabled = !(this.state.requiredReviews - this.state.numReviews <= 0);
    return (
      <span>
        <HelpModal show={this.state.showHelpModal} close={this._closeHelpModal}/>
      <Navbar fixedTop>
        <Navbar.Brand>
          <a href="#">Review It</a>
        </Navbar.Brand>
        <Nav pullRight>
          {infoNavItem}
          <NavItem id="navbar-help" eventKey={1} onClick={this._openHelpModal} >Help <Glyphicon className="nav-glyph" glyph="question-sign"/></NavItem>
          <NavItem id="navbar-next" eventKey={1} href="step2" disabled={disabled}>Continue <Glyphicon className="nav-glyph" glyph="arrow-right"/></NavItem>
            <NavItem href="/logout/" className="logout-button">Logout</NavItem>
        </Nav>
      </Navbar>
      </span>
    );
  },
});
