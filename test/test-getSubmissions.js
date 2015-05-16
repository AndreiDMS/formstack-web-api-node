require('./config');
var should = require('should');
var assert = require('assert');
var fsAPI = require('formstack-web-api-node');

var fsa = new fsAPI(fsaConf.ACCESS_TOKEN);

describe('fsapi', function(){
	describe('#getSubmissions()', function(){
		
		it('should throw an error if fomrId is not a number', function(){
			(function(){
				fsa.getSubmissions('FAIL');
			}).should.throw();
		})
		
		it('should throw an error if args.minTime is invalid', function(){
			(function(){
				fsa.getSubmissions(fsaConf.FORM_DETAILS_ID, {minTime: 'fail'});
			}).should.throw();
		})
		
		it('should throw an error if args.maxTime is invalid', function(){
			(function(){
				fsa.getSubmissions(fsaConf.FORM_DETAILS_ID, {maxTime: 'fail'});
			}).should.throw();
		})
		
		it('should throw an error if args.searchFieldIds.length != args.searchFieldValues.length', function(){
			(function(){
				fsa.getSubmissions(fsaConf.FORM_DETAILS_ID, {
					searchFieldIds: [1, 2],
					searchFieldValues: ['A']
				});
			}).should.throw();
		})
		
		it('should throw an error if a args.searchFieldIds value is not a number', function(){
			(function(){
				fsa.getSubmissions(fsaConf.FORM_DETAILS_ID, {
					searchFieldIds: [1, 'FAIL'],
					searchFieldValues: ['A', 'B']
				});
			}).should.throw();
		})
		
		it('should throw an error if args.pageNumber is not a number', function(){
			(function(){
				fsa.getSubmissions(fsaConf.FORM_DETAILS_ID, {pageNumber: 'FAIL'});
			}).should.throw();
		})
		
		it('should throw an error if args.perPage is not a number', function(){
			(function(){
				fsa.getSubmissions(fsaConf.FORM_DETAILS_ID, {perPage: 'FAIL'});
			}).should.throw();
		})
		
		it('should throw an error if args.perPage is <= 0', function(){
			(function(){
				fsa.getSubmissions(fsaConf.FORM_DETAILS_ID, {perPage: 0});
			}).should.throw();
		})
		
		it('should throw an error if args.perPage is > 100', function(){
			(function(){
				fsa.getSubmissions(fsaConf.FORM_DETAILS_ID, {perPage: 101});
			}).should.throw();
		})
		
		it('should throw an error if args.sort is invalid', function(){
			(function(){
				fsa.getSubmissions(fsaConf.FORM_DETAILS_ID, {sort: 'FAIL'});
			}).should.throw();
		})
		
		it('should return a form not found error', function(done){
			fsa.getSubmissions(1234, {}, function(data, err){
				err.status.should.be.equal('error');
				err.error.should.be.equal('A valid form id was not supplied');
				done();
			});
		})
		
		it('form exists but does not belong to your account', function(done){
			fsa.getSubmissions(fsaConf.FORM_DETAILS_ID - 1, {}, function(data, err){
				err.status.should.be.equal('error');
				err.error.should.be.equal('You do not have high enough permissions for this form.');
				done();
			});
		})
		
		it('should return submissions data', function(done){
			fsa.getSubmissions(fsaConf.FORM_DETAILS_ID, {}, function(data, err){
				data.submissions.should.be.an.Array;
				Number(data.total).should.be.a.Number;
				Number(data.pages).should.be.a.Number;
				done();
			});
		})
	})
})