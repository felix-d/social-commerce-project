'use strict';

const Reflux = require("reflux"),
      debug = require("debug")(__filename),
      request = require("superagent"),
      AnalyticsActions = require("../actions/AnalyticsActions");


let AnalyticsStore = Reflux.createStore({

  listenables: AnalyticsActions,

  onHook(hook, data) {
    request
      .post('/phase2/hook/')
      .send({hook, data})
      .end((err, res) => {
        if(!err) {
          debug(`Hook: ${hook} with data: ${data} sent.`);
        } else {
          debug('There was an error while processing onHook:', err);
        }
      });
  }

});

module.exports = AnalyticsStore;
