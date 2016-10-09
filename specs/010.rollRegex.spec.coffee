lib = require('../arpggio/lib/dicelib')
chai = require('chai')
chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
expect = chai.expect

describe "010. Roll Regex", ->
	it "lib should not be null", -> expect(lib).to.not.equal(null)
	it "should have a rollRegex function", -> 
		expect(lib).to.have.property('rollRegex')
		expect(lib.rollRegex).to.be.function

	describe "throws an error if", ->
		expectThrows = (item)->
			it item.description, ->
				lib.rollRegex({"inputString": item.parameter}).then(null, (result)->
					expect(result.error.message).to.contain(item.rejectsWith)
				)

		expectThrows(item) for item in [
			{"description": "no parameter passed", "rejectsWith": "Invalid parameter", "parameter": undefined}
			{"description": "object as parameter", "rejectsWith": "Invalid parameter", "parameter": {}}
			{"description": "int as parameter", "rejectsWith": "Invalid parameter", "parameter": 4}
			{"description": "[] as parameter", "rejectsWith": "Invalid parameter", "parameter": []}
			{"description": "empty string as parameter", "rejectsWith": "Invalid parameter", "parameter": ""}
		]

	describe "with a non-empty string", ->
		expectReturns = (input, result)->
			it input, ->
				expect(lib.rollRegex({"inputString": input})).to.eventually.have.property("passesRollRegex", result)

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