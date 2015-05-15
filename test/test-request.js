require('./config');
var should = require('should');
var assert = require('assert');
var fsAPI = require('formstack-web-api-node');


describe('fsapi', function(){
	describe('#request()', function(){
  	
		var fsa = new fsAPI(ACCESS_TOKEN);
		var callback = function(){};
		fsa.request('form.json', callback);
		
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
				fsa.request('/test/endpoint', 'string-not-function');
			}).should.throw();
		})
		
		it('should throw an error when verb is invalid', function(){
			(function(){
				fsa.request('/test/endpoint', callback, 'FAIL');
			}).should.throw();
		})
		
		it('should return an error in callback when request failed', function(done){
			var fsaf = new fsAPI('ACCESS_TOKEN');
			fsaf.request('form.json', function(data, err){
				should.exist(err);
				done();
			});
		})
  })
})