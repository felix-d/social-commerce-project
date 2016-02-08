import Reflux from 'reflux';
import UsersActions from '../actions/UsersActions';
import _debug from 'debug';
import request from 'superagent';

const debug = _debug(__filename);

let _userPage = null;
const cache = {};

const UsersStore = Reflux.createStore({

  listenables: [ UsersActions ],

  getInitialState() {
    return _userPage;
  },

  onGetUserPage(id) {
    if (cache[id]) {
      debug('Getting userPage from cache.');
      _userPage = cache[id];
      this.trigger({ready: true, ..._userPage });
    } else {
      this.trigger({
        ready: false,
      });
      request
        .post(`/phase2/userpage/`)
        .send({userid: id})
        .end((err, res) => {
          if (err === null) {
            _userPage = JSON.parse(res.text);
            debug(`User page info was retrieved`, _userPage);
          } else {
            debug('There was an error while getting user info.', err);
          }
          if (_userPage.products) {
            _userPage.products.forEach(p => {
              let answers = null;
              if (p.review.boolAnswers) {
                p.review.boolAnswers.forEach(b => {
                  if (b.val) {
                    if (!answers) { answers = {}; }
                    if (b.childgroup in answers) {
                      answers[b.childgroup] += `, ${b.name}`;
                    } else {
                      answers[b.childgroup] = `${b.name}`;
                    }
                  }
                });
              }
              if (answers) {
                p.review.boolAnswers = answers;
              } else {
                delete p.review.boolAnswers;
              }
            });
          }
          cache[_userPage.user.id] = _userPage;
          this.trigger({ready: true, ..._userPage});
        });
    }
  },
});

module.exports = UsersStore;
