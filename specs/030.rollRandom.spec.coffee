lib = require('../arpggio/lib/dicelib')
chai = require('chai')
chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
expect = chai.expect

describe.only "030. Roll Random", ->
	it "lib should not be null", -> expect(lib).to.not.equal(null)
	it "should have a rollRandom function", -> 
		expect(lib).to.have.property('rollRandom')
		expect(lib.rollRandom).to.be.function

	expectThrows = (item)->
		it item.description, ->
			lib.rollRandom(item.parameter).then(expect.fail, (result)->
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

			{"description": "no parsedRoll", "rejectsWith": "parsedRoll not found", "parameter": {"inputString":"something", "passesRollRegex": true}}
			{"description": "no parsedRoll.numDice", "rejectsWith": "parsedRoll.numDice not found", "parameter": {"inputString":"something", "passesRollRegex": true, "parsedRoll":{}}}
			{"description": "no parsedRoll.diceSides", "rejectsWith": "parsedRoll.diceSides not found", "parameter": {"inputString":"something", "passesRollRegex": true, "parsedRoll":{"numDice": 1}}}
			{"description": "no parsedRoll.modifier", "rejectsWith": "parsedRoll.modifier not found", "parameter": {"inputString":"something", "passesRollRegex": true, "parsedRoll":{"numDice": 1, "diceSides": 20}}}
		]


	describe "generating the roll", ->
		rollMap = undefined
		afterEach -> rollMap = undefined


		updateRollMap = (num) ->
			if !rollMap
				rollMap = {}
			key = "_" + num
			# console.log(key)
			if rollMap.hasOwnProperty(key) 
				rollMap[key]++
			else
				rollMap[key] = 1;

		expectMinMax = (roll, min, max)->
			# updateRollMap(num) for num in roll.rolls

			expect(roll.total).to.be.at.least(min)
			expect(roll.total).to.be.at.most(max)

		expectRoll = (item)->
			it item.description, ->
				prm = []

				i = 0
				while i < item.times
				  prm.push lib.roll(item.description)
				  i++

				Promise.all(prm).then((rolls)->
					expectMinMax(roll, item.minValue, item.maxValue) for roll in rolls
				).then ()->

					if rollMap != undefined
						realKeys = []
						totalRolls = 0
						Object.keys(rollMap).forEach((rollKey)->
							realKeys.push(rollKey.substring(1))
							totalRolls += rollMap[rollKey]
						)
						realKeys = realKeys.sort((a,b)->return a - b)


						realKeys.forEach((key)->
							value = rollMap["_" + key]
							console.log(key + ": " + value + "\t" + ((value / totalRolls) * 100).toFixed(2) + "%")
						)

		expectRoll(item) for item in [
			{"description": "1d6", "times": 10000, "minValue": 1, "maxValue": 6}
			{"description": "1d6+1", "times": 10000, "minValue": 2, "maxValue": 7}
			{"description": "4d6", "times": 10000, "minValue": 4, "maxValue": 24}
			{"description": "d20", "times": 10000, "minValue": 1, "maxValue": 20}
			{"description": "10d20", "times": 10000, "minValue": 10, "maxValue": 200}
			{"description": "4d8-40", "times": 10000, "minValue": -36, "maxValue": -8}
		]
