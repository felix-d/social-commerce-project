import Reflux from 'reflux';
import WishlistStore from '../me/stores/WishlistStore';
import React from 'react';
import { Navbar, Nav, Glyphicon, NavItem, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import HelpModal from './HelpModal.react.jsx';
import track from '../tracking';


function getInfoNavItem(numR, numReq) {
  if (
    numR === undefined ||
    numR === null ||
    numReq === null ||
    numReq === undefined
  ) {
    return null;
  }
  let text = null;
  let navitemId = 'navbar-info--warning';
  if (numR === 1) {
    text = `There is 1 movie in your wishlist, only ${numReq - numR} left!`;
  } else if (numR === 0) {
    navitemId = 'navbar-info--danger';
    text = `There is no movie in your wishlist, only ${numReq - numR} left!`;
  } else if (numR < numReq) {
    text = `There are ${numR} movies in to your wishlist, only ${numReq - numR} left!`;
  } else {
    navitemId = 'navbar-info--success';
    text = `There are ${numR} movies in your wishlist!`;
  }
  return <NavItem id={navitemId}>{text}</NavItem>;
}

function getBadgeClass(num) {
  let badgeClass = '';
  if (num === 0) {
    badgeClass = 'danger';
  } else {
    badgeClass = 'info';
  }
  return badgeClass;
}

export default React.createClass({

  mixins: [Reflux.listenTo(WishlistStore, 'onChange')],

  getInitialState() {
    return {
      showHelpModal: false,
    };
  },

  onChange() {
    this.setState({
      numWishes: WishlistStore.getNumWishes(),
      minNumWishes: WishlistStore.getReqNumWishes(),
    });
  },

  taskFinished() {
    track('TASK_FINISHED');
  },

  _closeHelpModal() {
    track('CLOSE_HELP_MODAL');
    this.setState({
      showHelpModal: false,
    });
  },

  _openHelpModal(e) {
    track('OPEN_HELP_MODAL');
    e.preventDefault();
    this.setState({
      showHelpModal: true,
    });
  },

  render() {
    const disabled = !this.state || this.state.numWishes < this.state.minNumWishes;
    const badgeClass = getBadgeClass(this.state.numWishes, this.state.minNumWishes);
    const infoNavItem = getInfoNavItem(this.state.numWishes, this.state.minNumWishes);
    return (
      <span>
        <HelpModal show={this.state.showHelpModal} close={this._closeHelpModal}/>
        <Navbar fixedTop>
          <Navbar.Brand>
            <a href="#">Review It</a>
          </Navbar.Brand>
          <Nav>
            <LinkContainer to="/products">
              <NavItem>Movies</NavItem>
            </LinkContainer>
            <LinkContainer to="/profile">
              <NavItem className="my-profile-nav">My Profile</NavItem>
            </LinkContainer>
            <div className="menu-badge-container">
              <Badge className={badgeClass}>{this.state.numWishes}</Badge>
            </div>
          </Nav>
          <Nav pullRight>
          {infoNavItem}
            <NavItem id="navbar-help" eventKey={1} onClick={this._openHelpModal} >Help <Glyphicon className="nav-glyph" glyph="question-sign"/></NavItem>
            <NavItem id="navbar-next" eventKey={1} onClick={this.taskFinished} href="step2" disabled={disabled}>Continue <Glyphicon className="nav-glyph" glyph="arrow-right"/></NavItem>
            <NavItem href="/logout/" className="logout-button">Logout</NavItem>
          </Nav>
        </Navbar>
      </span>
    );
  },
});
