module.exports = {
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
	}
};