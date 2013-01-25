#initialize mocha
chai        = require 'chai'
expect      = chai.expect
should      = chai.should()

#test below
describe 'なんかテスト', ->
	it "おっけー？", ->
		expect("ok").be("ok")