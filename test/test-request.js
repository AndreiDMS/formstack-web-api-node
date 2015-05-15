require('./config');
var should = require('should');
var assert = require('assert');
var fsAPI = require('formstack-web-api-node');

var fsa = new fsAPI(fsaConf.ACCESS_TOKEN);

describe('fsapi', function(){
	describe('#request()', function(){
		
		it('should throw an error when the endpoint is not present', function(){
			(function(){
				fsa.request('');
			}).should.throw();
	    })
			
		it('should throw an error when the callback is not present', function(){
			(function(){
				fsa.request('/test/endpoint');
			}).should.throw();
		})
		
		it('should throw an error when the callback is not a function', function(){
			(function(){
				fsa.request('/test/endpoint', 'GET', null, 'string-not-function');
			}).should.throw();
		})
		
		it('should throw an error when verb is invalid', function(){
			(function(){
				fsa.request('/test/endpoint', 'FAIL', null, function(){});
			}).should.throw();
		})
		
		it('should return an error in callback when request failed', function(done){
			var fsaf = new fsAPI('ACCESS_TOKEN');
			fsaf.request('form.json', 'GET', null, function(data, err){
				should.exist(err);
				done();
			});
		})
  })
})