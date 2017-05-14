import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

Meteor.startup(() => {
  render(<div>App goes here</div>, document.getElementById('render-target'));
});
