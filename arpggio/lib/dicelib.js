module.exports = {
	rollRegex: function(workblob){
		return new Promise(function(ccb, ecb){
			if(!workblob) return ecb(new Error("RollRegex: No workblob"));
			var inputString = workblob.inputString;
			if(inputString === null 
				|| inputString === undefined 
				|| typeof inputString !== 'string'
				|| inputString.length <= 0) return ecb(new Error("RollRegex: Invalid parameter"));

			var rollRegex = /^(\d?\d?\d?(d|D))[0-9]?[0-9]((\+|-)[0-9]?[0-9])?$/
			return ccb(rollRegex.test(inputString));
		});
	}
};