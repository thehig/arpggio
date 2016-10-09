lib = require('../arpggio/lib/dicelib')
chai = require('chai')
chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
expect = chai.expect

describe "020. Roll Parse", ->
	it "lib should not be null", -> expect(lib).to.not.equal(null)
	it "should have a rollParse function", -> 
		expect(lib).to.have.property('rollParse')
		expect(lib.rollParse).to.be.function

	expectThrows = (item)->
		it item.description, ->
			lib.rollParse(item.parameter).then(expect.fail, (result)->
				expect(result).to.have.property('error')
				expect(result.error).to.have.property('message')
				expect(result.error.message).to.contain(item.rejectsWith)
			)
	describe "throws an error if", ->

		expectThrows(item) for item in [
			{"description": "no workblob", "rejectsWith": "No workblob", "parameter": undefined}
			{"description": "no inputString", "rejectsWith": "inputString not found", "parameter": {}}
			{"description": "no passesRollRegex", "rejectsWith": "passesRollRegex not true", "parameter": {"inputString":"something"}}
			{"description": "passesRollRegex false", "rejectsWith": "passesRollRegex not true", "parameter": {"inputString":"something", "passesRollRegex": false}}
			{"description": "passesRollRegex 'true'", "rejectsWith": "passesRollRegex not true", "parameter": {"inputString":"something", "passesRollRegex": 'true'}}

			{"description": "-1 numDice", "rejectsWith": "invalid numDice", "parameter": {"inputString":"-1d6", "passesRollRegex": true}}
			
			{"description": "0 diceSide", "rejectsWith": "invalid diceSides", "parameter": {"inputString":"d0", "passesRollRegex": true}}
			{"description": "1 diceSide", "rejectsWith": "invalid diceSides", "parameter": {"inputString":"d1", "passesRollRegex": true}}

		]

	describe "parsing the roll", ->
		it "has numDice 1 when not provided", -> lib.rollRegex({"inputString": 'd6'}).then(lib.rollParse).then((workblob)->
			expect(workblob).to.have.property('parsedRoll')
			expect(workblob.parsedRoll).to.have.property('numDice', 1)
		)

		describe "has numDice", ->
			expectNumDice = (item)->
				it "#" + item, -> lib.rollRegex({"inputString": ""+ item + 'd6'}).then(lib.rollParse).then((workblob)->
					expect(workblob).to.have.property('parsedRoll')
					expect(workblob.parsedRoll).to.have.property('numDice', item)
				)

			expectNumDice(item) for item in [
				1, 2, 3, 5, 7, 8, 10, 15, 20, 25, 60, 95, 99, 100, 120, 600, 999
			]


		describe "has diceSides", ->
			expectDiceSides = (item)->
				it "#" + item, -> lib.rollRegex({"inputString": "d"+ item}).then(lib.rollParse).then((workblob)->
					expect(workblob).to.have.property('parsedRoll')
					expect(workblob.parsedRoll).to.have.property('diceSides', item)
				)

			expectDiceSides(item) for item in [
				#100
				2, 3, 5, 7, 8, 10, 15, 20, 21, 50, 99
			]


		describe "has modifier", ->
			expectModifier = (item)->
				it "#" + item, ->
					inString = "d6"
					if(item >= 0) 
						inString += "+"

					lib.rollRegex({"inputString": inString + item}).then(lib.rollParse).then((workblob)->
						expect(workblob).to.have.property('parsedRoll')
						expect(workblob.parsedRoll).to.have.property('modifier', item)
					)

			expectModifier(item) for item in [
				0, 1, 2, 3, 5, 7, 8, 10, 15, 20, 21, 50, 99 
				-1, -45, -99
			]

