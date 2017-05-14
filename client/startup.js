import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
 
// import amc from 'arpggio-map-component';

// console.log('amc', amc);
 
Meteor.startup(() => {
  render(<div>App goes here</div>, document.getElementById('render-target'));
});