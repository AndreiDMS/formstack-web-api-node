require('./config');
var should = require('should');
var assert = require('assert');
var fsAPI = require('formstack-web-api-node');

var fsa = new fsAPI(fsaConf.ACCESS_TOKEN);

describe('fsapi', function(){
	describe('#getSubmissionDetails()', function(){
		
		it('should throw an error if submissionId is not a number', function(){
			(function(){
				fsa.getSubmissionDetails('FAIL');
			}).should.throw();
		})
		
		it('should return submission data', function(done){
			fsa.getSubmissionDetails(fsaConf.EDIT_SUBMISSION_ID, {}, function(data, err){
				should.exist(data);
				(Number(data.id)).should.be.a.Number;
				done();
			})
		})
	})
})