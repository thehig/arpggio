console.log("Loading diceLib.js");

diceLib = {
	rollRegex: function(workblob){
		return new Promise(function(ccb, ecb){
			if(!workblob) return ecb({'error': new Error("RollParse: No workblob")});

			var inputString = workblob.inputString;
			if(inputString === null 
				|| inputString === undefined 
				|| typeof inputString !== 'string'
				|| inputString.length <= 0) {
				workblob.error = new Error("RollRegex: Invalid parameter");
				return ecb(workblob);
			}

			// Starts with up to 3 digits
			// d or D
			// num 0 - 99
			// char + or -
			// modifier 0 - 99
			var rollRegex = /^(\d?\d?\d?(d|D))[0-9]?[0-9]((\+|-)[0-9]?[0-9])?$/
			workblob.passesRollRegex = rollRegex.test(inputString);
			return ccb(workblob);
		});
	},
	rollParse: function(workblob){
		return new Promise(function(ccb, ecb){
			if(!workblob) return ecb({'error': new Error("RollParse: No workblob")});
			if(!workblob.inputString) workblob.error = new Error("RollParse: inputString not found");
			if(!workblob.error && workblob.passesRollRegex !== true) workblob.error = new Error("RollParse: passesRollRegex not true");
			
			if(workblob.error) return ecb(workblob);

			var parsedRoll = {
				numDice: 0,
				diceSides: 0,
				modifier:0
			}

			// 4d20+6
			var inputString = workblob.inputString.toLowerCase();

			// Parse number of dice
			var diceIndex = inputString.indexOf('d');
			var numDice = parseInt(inputString.substring(0, diceIndex));
			if(!numDice) parsedRoll.numDice = 1;
			else if(numDice > 0) parsedRoll.numDice = numDice;
			else {
				workblob.error = new Error("RollParse: invalid numDice");
				return ecb(workblob);
			}

			// Parse dice sides
			var plusIndex = inputString.indexOf('+');
			var minusIndex = inputString.indexOf('-');

			var modifierIndex = plusIndex > -1 ? plusIndex : minusIndex;

			var diceSidesString = "";
			if(modifierIndex === -1){
				diceSidesString = inputString.substring(diceIndex + 1);
			} else {
				diceSidesString = inputString.substring(diceIndex + 1, modifierIndex);
			}

			var diceSides = parseInt(diceSidesString);
			if(diceSides <= 1){
				workblob.error = new Error("RollParse: invalid diceSides");
				return ecb(workblob);	
			}
			parsedRoll.diceSides = diceSides;

			// Parse modifier
			if(modifierIndex > -1){
				var modifierString = inputString.substring(modifierIndex);
				parsedRoll.modifier = parseInt(modifierString);
			}

			workblob.parsedRoll = parsedRoll;
			return ccb(workblob);
		});
	},
	rollRandom: function(workblob){
		return new Promise(function(ccb, ecb){
			if(!workblob) return ecb({'error': new Error("RollRandom: No workblob")});
			if(!workblob.inputString) workblob.error = new Error("RollRandom: inputString not found");
			if(!workblob.error && workblob.passesRollRegex !== true) workblob.error = new Error("RollRandom: passesRollRegex not true");
			if(!workblob.error && !workblob.parsedRoll) workblob.error = new Error("RollRandom: parsedRoll not found");
			if(!workblob.error && workblob.parsedRoll.numDice === undefined) workblob.error = new Error("RollRandom: parsedRoll.numDice not found");
			if(!workblob.error && workblob.parsedRoll.diceSides === undefined) workblob.error = new Error("RollRandom: parsedRoll.diceSides not found");
			if(!workblob.error && workblob.parsedRoll.modifier === undefined) workblob.error = new Error("RollRandom: parsedRoll.modifier not found");
			
			if(workblob.error) return ecb(workblob);

			workblob.rolledDice = [];
			for(var i = 0; i < workblob.parsedRoll.numDice; i++){
				workblob.rolledDice.push(Math.floor(Math.random() * (workblob.parsedRoll.diceSides - 1 + 1) + 1));
			}

			ccb(workblob);
		});
	},
	roll: function(inputString){
		return diceLib.rollRegex({"inputString": inputString})
			.then(diceLib.rollParse)
			.then(diceLib.rollRandom)
			.then(function (workblob){
				return {
					"rolls": workblob.rolledDice,
					"total": workblob.parsedRoll.modifier + workblob.rolledDice.reduce(function(prev, val){ return prev + val}, 0)
				}
			});
	}
};

// Expose to Node
if ( typeof module !== 'undefined' && module.exports){
	module.exports = diceLib;	
}

// Expose to Meteor as module
if ( typeof Modules !== 'undefined' && Modules.both){
	Modules.both.diceLib = diceLib;
}

// Expose Meteor.method
if (typeof Meteor !== 'undefined' && Meteor.methods && Meteor.isServer) {
	Meteor.methods({
		rollDice: function(inputString){
			return diceLib.roll(inputString).then(
				function success(result){
					return result;
				}, 
				function error(err){
					if(err && err.error && err.error.message && err.error.message.indexOf(':') > -1){
						var separator = err.error.message.indexOf(':');
						var title = err.error.message.substring(0, separator).trim();
						var body = err.error.message.substring(separator + 1).trim();
						throw new Meteor.Error('500', title, body);						
					} else if(err && err.error) {
						throw new Meteor.Error('500', err.error);
					} else {
						throw new Meteor.Error('500', err);
					}
				});
		}
	});
}