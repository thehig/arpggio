lib = require('../arpggio/lib/rollRegex')
expect = require('chai').expect

describe "010. Roll Regex", ->
	it "lib should not be null", -> expect(lib).to.not.equal(null)
	it "should have a rollRegex function", -> 
		expect(lib).to.have.property('rollRegex')
		expect(lib.rollRegex).to.be.function

	describe "throws an error if", ->
		expectThrows = (item)->
			it item.description, ->
				expect(item.function).to.throw(item.rejectsWith)

		expectThrows(item) for item in [
			{"description": "no parameter passed", "rejectsWith": "Invalid parameter", "function": ()-> lib.rollRegex()}
			{"description": "object as parameter", "rejectsWith": "Invalid parameter", "function": ()-> lib.rollRegex({})}
			{"description": "int as parameter", "rejectsWith": "Invalid parameter", "function": ()-> lib.rollRegex(4)}
			{"description": "[] as parameter", "rejectsWith": "Invalid parameter", "function": ()-> lib.rollRegex([])}
			{"description": "empty string as parameter", "rejectsWith": "Invalid parameter", "function": ()-> lib.rollRegex("")}
		]

	describe "with a non-empty string", ->
		expectReturns = (input, result)->
			it input, ->
				expect(lib.rollRegex(input)).to.equal(result)

		describe "returns true", ->
			expectReturns(input, true) for input in [
				"d2", "d6", "3d6", "d20", 
				"D2", "D6", "3D6", "D20", 
				"d6+3",	"d6-30", "d19+41", 
			]


		describe "returns false", ->
			expectReturns(input, false) for input in [
				# "d0", 
				"'", "''", "f", "d", "-1d4", "d20 +3", "d14+ 5", "4d20 + 0", "d20 -3", "d14- 5", "4d20 - 0"
			]