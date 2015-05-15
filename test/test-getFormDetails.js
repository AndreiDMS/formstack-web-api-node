require('./config');
var should = require('should');
var assert = require('assert');
var fsAPI = require('formstack-web-api-node');

var fsa = new fsAPI(fsaConf.ACCESS_TOKEN);

describe('fsapi', function(){
	describe('#getFormDetails()', function(){
	
		it('should return correct form details', function(done){
			fsa.getFormDetails(fsaConf.FORM_DETAILS_ID, function(data){
				data.name.should.be.equal(fsaConf.FORM_DETAILS_NAME);
				done();
			});
		})
		
		it('should throw an error if formId is not number', function(){
			(function(){
				fsa.getFormDetails('FAIL');
			}).should.throw();
		})
		
		it('should return a form not found error', function(done){
			fsa.getFormDetails('1234', function(data, err){
				err.status.should.be.equal('error');
				err.error.should.be.equal('The form was not found');
				done();
			});
		})
		
		it('form exists but does not belong to your account', function(done){
			fsa.getFormDetails(fsaConf.FORM_DETAILS_ID - 1, function(data, err){
				err.status.should.be.equal('error');
				err.error.should.be.equal('You do not have high enough permissions for this form.');
				done();
			});
		})
		
	})
})