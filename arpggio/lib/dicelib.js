module.exports = {
	rollRegex: function(workblob){
		return new Promise(function(ccb, ecb){
			if(!workblob) {
				workblob.error = new Error("RollRegex: No workblob");
				return ecb(workblob);
			}
			var inputString = workblob.inputString;
			if(inputString === null 
				|| inputString === undefined 
				|| typeof inputString !== 'string'
				|| inputString.length <= 0) {
				workblob.error = new Error("RollRegex: Invalid parameter");
				return ecb(workblob);
			}

			var rollRegex = /^(\d?\d?\d?(d|D))[0-9]?[0-9]((\+|-)[0-9]?[0-9])?$/
			workblob.passesRollRegex = rollRegex.test(inputString);
			return ccb(workblob);
		});
	}
};