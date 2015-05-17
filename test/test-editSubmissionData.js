require('./config');
var should = require('should');
var assert = require('assert');
var fsAPI = require('../src/index');

var fsa = new fsAPI(fsaConf.ACCESS_TOKEN);

describe('fsapi', function(){
	describe('#editSubmissionData()', function(){
		
		it('should throw an error if submissionId is not number', function(){
			(function(){
				fsa.editSubmissionData('FAIL');
			}).should.throw();
		})
		
		it('should throw an error if args.fieldIds.length != args.fieldValues.length', function(){
			(function(){
				fsa.editSubmissionData(fsaConf.FORM_SUBMIT_ID, {
					fieldIds: [1, 2],
					fieldValues: ['A']
				});
			}).should.throw();
		})
		
		it('should throw an error if args.timestamp is invalid', function(){
			(function(){
				fsa.editSubmissionData(fsaConf.FORM_SUBMIT_ID, {timestamp: 'fail'});
			}).should.throw();
		})
		
		it('should throw an error if a args.fieldIds value is not a number', function(){
			(function(){
				fsa.editSubmissionData(fsaConf.FORM_SUBMIT_ID, {
					fieldIds: [1, 'FAIL'],
					fieldValues: ['A', 'B']
				});
			}).should.throw();
		})
		
		it('should edit submision succesfuly', function(done){
			fsa.editSubmissionData(fsaConf.EDIT_SUBMISSION_ID, {
				fieldIds: fsaConf.submitFormFieldIds,
				fieldValues: fsaConf.submitFormFieldValues
			}, function(data, err){
				should.exist(data);
				(Number(data.success)).should.be.equal(1);
				done();
			});
		})
		
	})
})