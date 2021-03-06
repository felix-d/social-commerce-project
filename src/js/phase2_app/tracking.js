import request from 'superagent';
import 'superagent-django-csrf';

import { TRACKING_URL } from './utils/Config';
import { getLocation } from './utils/Utils.jsx';
const debug = require('debug')(__filename);


/**
 * Post tracking data to back end.
 * @param {string} hook Tracking hook
 * @param {Object} data Tracking data
 * @returns {undefined}
 */
export default function track(hook, _data) {
  const data = {..._data, at: getLocation()};
  debug(hook, data);
  request
    .post(TRACKING_URL)
    .set('Accept', 'application/json')
    .send({hook, data})
    .end(() => {});
}
