import Reflux from 'reflux';
import request from 'superagent';

const actions = Reflux.createActions({
  'fetchInitialData': {children: ['completed', 'failed']},
});

actions.fetchInitialData.listen(function handler() {
  request
    .get('get-initial-data')
    .end((err, res) => {
      if (err) {
        this.failed(err);
      } else {
        const data = JSON.parse(res.text);
        this.completed(data);
      }
    });
});

export default actions;
