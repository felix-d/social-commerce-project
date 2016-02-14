import React from 'react';
import Reflux from 'reflux';
import { Row, Col } from 'react-bootstrap';
import Loader from 'react-loader';

import MainMenu from './MainMenu.react.jsx';
import InitialModal from './InitialModal.react.jsx';
import APIActions from '../products/actions/APIActions';
import ProductsStore from '../products/stores/ProductsStore';
import UserStore from '../me/stores/UserStore';
import UserActions from '../me/actions/UserActions';
import WishlistStore from '../me/stores/WishlistStore';
import NextStepModal from './NextStepModal.jsx';

export default React.createClass({

  propTypes: {
    children: React.PropTypes.object,
  },

  mixins: [
    Reflux.connectFilter(ProductsStore, 'loaded', state => !!state.products),
    Reflux.connect(UserStore),
    Reflux.listenTo(WishlistStore, 'onWishlistChange'),
  ],

  getInitialState() {
    return {
      numWishes: WishlistStore.getNumWishes(),
      numReqWishes: WishlistStore.getReqNumWishes(),
    };
  },

  componentWillMount() {
    APIActions.fetchInitialData();
  },

  componentWillUnmount() {
  },

  onWishlistChange() {
    this.setState({
      numWishes: WishlistStore.getNumWishes(),
      numReqWishes: WishlistStore.getReqNumWishes(),
    });
  },


  _hideNextStepModal() {
    UserActions.closeNextStepModal();
  },

  render() {
    const loaderOptions = {
      color: '#444',
      zIndex: 10,
    };
    return (
      <div>
        <Row>
          <Col xs={12}>
            <MainMenu/>
            <InitialModal/>
            <NextStepModal
                show={this.state.initModalClosed &&
                      this.state.numWishes >= this.state.numReqWishes &&
                      !this.state.nextStepModalClosed}
                close={this._hideNextStepModal}/>
          </Col>
        </Row>
        <Loader {...loaderOptions} loaded={this.state.loaded} className="spinner">
          {this.props.children}
        </Loader>
      </div>
    );
  },
});
