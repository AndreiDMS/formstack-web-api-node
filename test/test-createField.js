require('./config');
var should = require('should');
var assert = require('assert');
var fsAPI = require('../src/index');

var fsa = new fsAPI(fsaConf.ACCESS_TOKEN);

describe('fsapi', function(){
	describe('#createField()', function(){
		
		it('should throw an error if formId is not number', function(){
			(function(){
				fsa.createField('FAIL');
			}).should.throw();
		})
		
		it('should throw an error if args.fieldType is invalid', function(){
			(function(){
				fsa.createField(fsaConf.FORM_SUBMIT_ID, {fieldType: 'FAIL'});
			}).should.throw();
		})
		
		it('should create a new field', function(done){
			var label = 'Test ' + Date.parse()/1000;
			fsa.createField(fsaConf.FORM_SUBMIT_ID, {
				fieldType: 'text',
				label: label
			},function(data, err){
				should.exist(data);
				Number(data.id).should.be.a.Number;
				data.label.should.be.equal(label);
				done();
			});
		})
		
	})
})