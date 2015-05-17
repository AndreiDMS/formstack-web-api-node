require('./config');
var should = require('should');
var assert = require('assert');
var fsAPI = require('../src/index');

var fsa = new fsAPI(fsaConf.ACCESS_TOKEN);

describe('fsapi', function(){
	describe('#getForms()', function(){
		
		it('should return an array of existing forms', function(done){
			fsa.getForms({}, function(data, err){
				data.should.be.an.Array;
				done();
			});
		})
		
		// TODO: test with folderOrganized
	
	})
})