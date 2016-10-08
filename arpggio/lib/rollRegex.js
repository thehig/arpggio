module.exports = {
	rollRegex: function(inputString){
		if(inputString === null 
			|| inputString === undefined 
			|| typeof inputString !== 'string'
			|| inputString.length <= 0) throw(new Error("RollRegex: Invalid parameter"));

		var rollRegex = /^(\d?\d?\d?(d|D))[0-9]?[0-9]((\+|-)[0-9]?[0-9])?$/
		return rollRegex.test(inputString);
	}
};