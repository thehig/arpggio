if (Meteor.isClient) {
	// counter starts at 0
	Session.setDefault('diceResult', 0);
	Session.setDefault('diceInput', "d20");

	Template.rollDice.helpers({
		diceInput: function() {
			return Session.get('diceInput');
		},
		diceResult: function() {
			return Session.get('diceResult');
		}
	});

	Template.rollDice.events({
		'click button': function() {
			var inputValue = document.getElementById('rollDiceInput').value;
			Session.set('diceInput', inputValue);
			Meteor.call('rollDice', inputValue, function(err, resp) {
				Session.set("diceResult", err ? err : resp);
			});
		}
	});
}