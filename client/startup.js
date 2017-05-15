import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import MapComponent from 'arpggio-map-component'; //eslint-disable-line


Meteor.startup(() => {
  // console.log('Map Component', mapComponent);
  render(<MapComponent />, document.getElementById('render-target'));
});
