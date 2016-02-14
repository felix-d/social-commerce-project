import React from 'react';
import UserStore from '../me/stores/UserStore';

exports.getPic = function getPic(url, isProfile = false, alt = '') {
  const urlx = !UserStore.showUsersPics() && !isProfile ? '../static/images/user.jpg' : url;

  return <img key={urlx} src={urlx} alt={alt}/>;
};

exports.getLocation = function getLocation() {
  return window.location.hash.substring(1);
};
