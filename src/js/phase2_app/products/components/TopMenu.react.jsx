import React from 'react';
import Reflux from 'reflux';
import classnames from 'classnames';
import { isEmpty } from 'lodash';

import FiltersActions from '../actions/FiltersActions';
import FiltersStore from '../stores/FiltersStore';
import track from '../../tracking';

export default React.createClass({

  mixins: [Reflux.connect(FiltersStore)],

  getInitialState() {
    return {
      tabs: FiltersStore.getTabs(),
      activeTab: FiltersStore.getActiveTab(),
    };
  },

  render() {
    if (!this.state.tabs) { return null; }
    const allowedTabs = isEmpty(this.state.tabs) ? ['a', 'f', 'fof', 'mf', 'ml'] : this.state.tabs;
    const display = {
      a: 'All',
      f: 'Friends',
      fof: 'Friends of friends',
      mf: 'Friends with most mutual friends',
      ml: 'Friends with most mutual likes',
    };

    const tabs = allowedTabs.sort().map((tab, i) => {
      function tabClicked() {
        FiltersActions.changeTab(tab);
        track('TAB_VISITED', {tab});
      }
      const classes = classnames('tab', {
        'active': tab === this.state.activeTab,
        'no-active': tab !== this.state.activeTab,
      });

      return (
        <div id={i + '-tab'} key={i} className={classes}>
          <div onClick={tabClicked}>
            <span>{display[tab]}</span>
          </div>
        </div>
      );
    });

    return (
      <div id="topmenu">
        {tabs}
      </div>
    );
  },
});
