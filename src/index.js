'use strict';

require('./polyfill');

var https = require('https');

/**
* Valid verbs for https requests method
*/
var validVerbs = [
    'GET',
    'PUT',
    'POST',
    'DELETE',
];

/**
* Valid field types
*/
var validFieldTypes = [
    'text',
    'textarea',
    'name',
    'address',
    'email',
    'phone',
    'creditcard',
    'datetime',
    'file',
    'number',
    'select',
    'radio',
    'checkbox',
    'matrix',
    'richtext',
    'embed',
    'product',
    'section',
];

/**
*
* @param {string}   accessToken   Requierd. Formstack API access token.
* @param {string}   host          Formstack API host. Default: www.formstack.com
* @param {number}   port          Formstack API port number. Default: 443
* @param {path}     path          Formstack API relative path to host. Default: /api/v2/
*/
var FsAPI = function(accessToken, host, port, path) {
	
    /**
    * @param {string} accessToken
    */
	this.accessToken = accessToken;
    
    /**
    * FormStack api port number.
    * Defaults to 443
    * @param {number} apiPort
    */
    this.apiPort = port || 443;
	
    /**
    * Host
    * @param {string} apiHost
    */
	this.apiHost = host || 'www.formstack.com';
	
    /**
    * @param {string} apiPath
    */
	this.apiPath = path || '/api/v2/';
};

FsAPI.prototype = {};

/**
* Helper method to make all requests to Formstack API
*
* @param   {string}    endpoint              Required. The endpoint to make requests to
*
* @param   {string}    verb                  String representation of HTTP verb to perform. Default: GET
*
* @param   {object}    args                  Object of all request arguments to use. Default: {}
*
* @param   {function}  callback(data, err)   Required. Callback function for async requests.
*              {object}    data        Response from request
*              {object}    err         Error information, if any. If an error occurs, data is null
*
*/
FsAPI.prototype.request = function(endpoint, verb, args, callback) {
    
    endpoint = endpoint || null;
    
    verb = verb || 'GET';
    
    args = args || null;
    
    if ( !callback ){
        console.error('You must provide a callback function');
        return;
    }
    
    if ( !endpoint ){
    	console.error('You must include an enpoint to request');
    	return callback();
    }

    // Validate HTTPS method verb
    verb = verb.toUpperCase();
    if ( validVerbs.indexOf(verb) === -1) {
        console.error('Your requests must be performed with one of the following verbs: ' + validVerbs.join(','));
        return callback();
    }
    
    var postData = null;
    if (args)
        postData = querystring.stringify(args);
    
    // Build request using access token
    var options = {
		hostname: this.apiHost,
		port: this.apiPort,
		path: this.apiPath + endpoint,
		method: verb,
		headers: {
			'Authorization': 'Bearer ' + this.accessToken
		}
    };
    
    if (postData)
        options.headers["Content-Length"] = postData.length;
    
    var req = https.request(options, function(res){
        console.log("statusCode: ", res.statusCode);
    	console.log("headers: ", res.headers);
        
        var str = '';
    	res.on('data', function(data) {
            str += data;
    	});
        res.on('end', function(){
            var response = JSON.parse(str);
            callback(response);
        });
    });
    if (postData)
        req.write(postData);
    req.end();
    
    req.on('error', function(e){
        console.error(e);
        callback(null, e);
    });
}

/**
* Get a list of forms in your account
*
* @link    https://www.formstack.com/developers/api/resources/form#form_GET
*
* @param    {object}    args                Arguments passed to API request.
*              {boolean} args.folderOrganized      Flag to determine whether response should be structured in Folders
*
* @param    {function}  callback(data, err)   Required. Callback function for async requests.
*              {array}     data        Array of all Forms or Array of Folders
*              {object}    err         Error information, if any. If an error occurs, data is undefined
*
*/
FsAPI.prototype.getForms = function(args, callback) {

    args = args || {};
    
	args.folderOrganized = args.folderOrganized || false;
	
	var params = {
        folders: args.folderOrganized ? 1 : 0
    };
    
	this.request('form.json', 'GET', params, function(data, err) {
                
        if (args.folderOrganized) {
            // Folders are returned as properties of the response->forms object
            // Converting response->forms to an array to be similar in behavior
            // to when there are no folders
            // TODO
            // response.forms = (array) $response->forms; // TODO: copy from php
        }
        
        if (callback) 
            callback(data.forms, err);
        else {
            console.log('data', data.forms);
            console.error('error', err);
        }
    });
};

/**
* Get the detailed information of a specific Form
* 
* @link    https://www.formstack.com/developers/api/resources/form#form/:id_GET
* 
* @param    {number} formId                  Form Id
*
* @param    {function}  callback(data, err)  Callback function for async requests.
*              {array}     data        Array of all Forms or Array of Folders
*              {object}    err         Error information, if any. If an error occurs, data is undefined
*/
FsAPI.prototype.getFormDetails = function(formId, callback) { 
    
    if ( isNaN(formId) ) {
        console.error('Form ID is required and must be numeric');
        return (callback) ? callback() : null;
    }
    
    this.request('form/'+formId, 'GET', {}, function(data, err){
        
        if (callback) {
            callback(data, err);
        }
        else {
            console.log('data', data);
            console.error('error', err);
        }
    });
};

/**
* Create a copy of a Form in your account.
* 
* @link    https://www.formstack.com/developers/api/resources/form#form/:id/copy_POST
* 
* @param    {number}    formId      Required. The ID of the Form to copy  
* @param    {function}  callback(data, err)   Callback function for async requests.
*              {object}    data        An object representing all of the copy's data
*              {object}    err         Error information, if any. If an error occurs, data is undefined
*/
FsAPI.prototype.copyForm = function(formId, callback) {
   
    if ( isNaN(formId) ) {
        console.error('Form ID is required and must be numeric');
        return (callback) ? callback() : null;
    }
    
    this.request('form/' + formId + '/copy', 'POST', {}, function(data, err){
        
        if (callback) {
            callback(data, err);
        }
        else {
            console.log('data', data);
            console.error('error', err);
        }
    });
};

/**
* Get all Submissions for a specific Form
*
* @link    https://www.formstack.com/developers/api/resources/submission#form/:id/submission_GET
*
* @param    {number}    formId      Required. The ID of the Form to retrieve Submissions for
*
* @param    {object}    args                Arguments passed to API request.
*               {string} args.encryptionPassword    The encryption password (if applicable)
*               {string} args.minTime               Date/Time string for start time in EST to group Submissions
*               {string} args.maxTime               Date/Time string for end time in EST to group Submissions
*               {array}  args.searchFieldIds        Array of Field IDs to base searching around
*               {array}  args.searchFieldValues     Array of values related to IDs in searchFieldIds
*               {number} args.pageNumber            Page of Submissions to collect from
*               {number} args.perPage               Number of Submissions to retrieve per request
*               {string} args.sort                  Sort direction ('DESC or 'ASC')
*               {bool}   args.data                  Whether to include Submission data in request
*               {bool}   args.expandData            Whether to include extra data formatting for included data
*
* @param   {function}  callback(data, err)   Callback function for async requests.
*              {array}     data        All retrieved Submissions for the given Form
*              {object}    err         Error information, if any. If an error occurs, data is undefined
*/
FsAPI.prototype.getSubmissions = function(formId, args, callback) {
    
    if ( isNaN(formId) ) {
        console.error('Form ID is required and must be numeric');
        return (callback) ? callback() : null;
    }
    
    args = args || {};
    args.encryptionPassword = args.encryptionPassword || '';
    args.minTime = args.minTime || '';
    args.maxTime = args.maxTime || '';
    args.searchFieldIds = args.searchFieldIds || [];
    args.searchFieldValues = args.searchFieldValues || [];
    args.pageNumber = args.pageNumber || 1;
    args.perPage = args.perPage || 25;
    args.sort = args.sort || 'DESC';
    args.sort = args.sort.toUpperCase();
    args.data = args.data || false;
    args.expandData = args.expandData || false;
    
    if ( args.minTime !== '' && isNaN(strtotime(args.minTime)) ){
        console.error('Invalid value for minTime');
        return (callback) ? callback() : null;
    }
    
    if ( args.maxTime !== '' && isNaN(strtotime(args.maxTime)) ) {
        console.error('Invalid value for maxTime');
        return (callback) ? callback() : null;
    }
    
    if ( args.searchFieldIds.length !== args.searchFieldValues.length ) {
        console.error('You must have a one to one relationship between Field ids and Field values');
        return (callback) ? callback() : null;
    }
    
    if ( isNaN(args.pageNumber) ) {
        console.error('The pageNumber value must be numeric');
        return (callback) ? callback() : null;
    }
    
    if ( isNaN(args.perPage) ) {
        console.error('The perPage value must be numeric');
        return (callback) ? callback() : null;
    }
    else if (args.perPage > 100 || args.perPage <= 0) {
        console.error('You can only retrieve a minimum of 1 and maximum of 100 Submissions per request');
        return (callback) ? callback() : null;
    }
    
    if ( ['ASC', 'DESC'].indexOf(args.sort) == -1 ){
        console.error('The sort parameter must be ASC or DESC');
        return (callback) ? callback() : null;
    }
    
    var params = {
        encryption_password: args.encryptionPassword,
        min_time: args.minTime,
        max_time: args.maxTime,
        page: args.pageNumber,
        per_page: args.perPage,
        sort: args.sort
    };
    
    if (args.data)
        params.data = args.data;
    
    if (args.expandData)
        params.expand_data = args.expandData;
    
    // TODO: clean arguments 
    
    args.searchFieldIds.every(function(fId, index){
        if ( isNaN(fId) ) {
            console.error('Field IDs must be numeric!', fId, 'given');
            if (callback) callback();
            return false;
        }
        else{
            params['search_field_'+index] = fId;
            params['search_field_'+index] = args.searchFieldValues[index]; 
            return true;
        }
        
    });
        
    this.request('form/' + args.formId + '/submission.json', 'GET', params, function(data, err){
        
        if (callback) {
            callback(data.submissions, err);
        }
        else {
            console.log('data', data.submissions);
            console.error('error', err);
        }
    });    
};

/**
* Create a new Submission for the specified Form
*
* @link    https://www.formstack.com/developers/api/resources/submission#form/:id/submission_POST
*
* @param    {number}    formId      Required. The ID of the Form to retrieve Submissions for
*
* @param    {object}    args                Arguments passed to API request.
*               {array}    args.fieldIds       Array of Field ids to submit data for
*               {array}    args.fieldValues    Array of Field values to submit data associated with $fieldIds
*               {string}   args.timestamp      String representation of YYYY-MM-DD HH:MM:SS time that should be recorded
*               {string}   args.userAgent      Browser user agent value that should be recorded
*               {string}   args.ipAddress      IP Address that should be recorded
*               {string}   args.paymentStatus  Status of payment integration(s) (if applicable)
*               {bool}     args.read           Flag (true or false) indicating whether the Submission was read
*
* @param   {function}  callback(data, err)   Callback function for async requests.
*              {object}    data       Rrepresentation of Submission response
*              {object}    err        Error information, if any. If an error occurs, data is undefined
*/
FsAPI.prototype.submitForm = function(formId, args, callback) {
    
    if ( isNaN(formId) ) {
        console.error('Form ID is required and must be numeric');
        return (callback) ? callback() : null;
    }
    
    args = args || {};
    args.fieldIds = args.fieldIds || [];
    args.fieldValues = args.fieldValues || [];
    args.timestamp = args.timestamp || '';
    args.userAgent = args.userAgent || '';
    args.ipAddress = args.ipAddress || '';
    args.paymentStatus = args.paymentStatus || '';
    args.read = args.read || false;
    
    if ( args.fieldIds.length !== args.fieldValues.length ) {
        console.error('You must have a one to one relationship between Field ids and Field values');
        return (callback) ? callback() : null;
    }
    
    if ( args.timestamp !== '' && isNaN(strtotime(args.timestamp)) ){
        console.error('Invalid value for timestamp. You must use a valid Date/Time string formatted in YYYY-MM-DD HH:MM:SS');
        return (callback) ? callback() : null;
    }
    
    var params = {
        timestamp: args.timestamp,
        user_agent: args.userAgent,
        remote_addr: args.ipAddress,
        payment_status: args.paymentStatus,
        read: args.read ? 1 : 0
    };
    
    // TOOD: clean arguments
    
    args.fieldIds.every(function(fId, index){
        if ( isNaN(fId) ) {
            console.error('Field IDs must be numeric!', fId, 'given');
            if (callback) callback();
            return false;
        }
        else {
            params['field_'+fId] = args.fieldValues[index];
            return true;
        }
    });
    
    this.request('form/' + formId + '/submission.json', 'POST', params, function(data, err){
        
        if (callback) {
            callback(data, err);
        }
        else {
            console.log('data', data);
            console.error('error', err);
        }
    });  
};

/**
* Get the details of a specific Submission
*
* @link    https://www.formstack.com/developers/api/resources/submission#submission/:id_GET
*
* @param    {number} submissionId       The ID of the Submission to get data for
*
* @param    {object}    args            Arguments passed to API request.
*               {string} args.encryptionPassword    The encryption password on the Form (if applicable)
*
* @param   {function}  callback(data, err)   Callback function for async requests.
*              {object}    data        Representation of the Submission Data
*              {object}    err         Error information, if any. If an error occurs, data is undefined
*/
FsAPI.prototype.getSubmissionDetails = function(submissionId, args, callback) {
    
    if ( isNaN(submissionId) ) {
        console.error('Submission ID is required and must be numeric');
        return (callback) ? callback() : null;
    }
    
    args = args || {};
    args.encryptionPassword = args.encryptionPassword || null;
    
    var params = {};
    
    if (args.encryptionPassword)
        params.encryption_password = args.encryptionPassword;
    
    this.request('submission/' + submissionId + '.json', 'GET', params, function(data, err){
        
        if (callback) {
            callback(data, err);
        }
        else {
            console.log('data', data);
            console.error('error', err);
        }
    });  
};

/**
* Update the specified Submission
*
* @link    https://www.formstack.com/developers/api/resources/submission#submission/:id_PUT
*
* @param   {number}     submissionId    The Submission to update
*
* @param   {object}     args            Arguments passed to API request.
*               {array}    args.fieldIds       Array of Field ids to submit data for
*               {array}    args.fieldValues    Array of Field values to submit data associated with $fieldIds
*               {string}   args.timestamp      String representation of YYYY-MM-DD HH:MM:SS time that should be recorded
*               {string}   args.userAgent      Browser user agent value that should be recorded
*               {string}   args.ipAddress      IP Address that should be recorded
*               {string}   args.paymentStatus  Status of payment integration(s) (if applicable)
*               {bool}     args.read           Flag (true or false) indicating whether the Submission was read
* 
* @param   {function}   callback(data, err)   Callback function for async requests.
*              {array}     data        Representation of API response
*              {object}    err         Error information, if any. If an error occurs, data is undefined
*/
FsAPI.prototype.editSubmissionData = function(submissionId, args, callback) {
    
    if ( isNaN(submissionId) ) {
        console.error('Submission ID is required and must be numeric');
        return (callback) ? callback() : null;
    }
    
    args = args || {};
    args.fieldIds = args.fieldIds || [];
    args.fieldValues = args.fieldValues || [];
    args.timestamp = args.timestamp || '';
    args.userAgent = args.userAgent || '';
    args.ipAddress = args.ipAddress || '';
    args.paymentStatus = args.paymentStatus || '';
    args.read = args.read || false;
    
    if ( args.fieldIds.length !== args.fieldValues.length ) {
        console.error('You must have a one to one relationship between Field ids and Field values');
        return (callback) ? callback() : null;
    }
    
    if ( args.timestamp !== '' && isNaN(strtotime(args.timestamp)) ){
        console.error('Invalid value for timestamp. You must use a valid Date/Time string formatted in YYYY-MM-DD HH:MM:SS');
        return (callback) ? callback() : null;
    }
    
    var params = {
        timestamp: args.timestamp,
        user_agent: args.userAgent,
        remote_addr: args.ipAddress,
        payment_status: args.paymentStatus,
        read: args.read ? 1 : 0
    };
    
    // TOOD: clean arguments
    
    args.fieldIds.every(function(fId, index){
        if ( isNaN(fId) ) {
            console.error('Field IDs must be numeric!', fId, 'given');
            if (callback) callback();
            return false;
        }
        else {
            params['field_'+fId] = args.fieldValues[index];
            return true;
        }
    });
    
    this.request('submission/' + submissionId + '.json', 'PUT', params, function(data, err){
        
        if (callback) {
            callback(data, err);
        }
        else {
            console.log('data', data);
            console.error('error', err);
        }
    }); 
};

/**
* Delete the specified Submission
*
* @link    https://www.formstack.com/developers/api/resources/submission#submission/:id_DELETE
*
* @param   {number}     submissionId    The ID of the Submission to be deleted.
* 
* @param   {function}  callback(data, err)   Callback function for async requests.
*              {object}    data        Representation of the API response
*              {object}    err         Error information, if any. If an error occurs, data is undefined
*/
FsAPI.prototype.deleteSubmission = function(submissionId, callback) {
    
    if ( isNaN(submissionId) ) {
        console.error('Submission ID is required and must be numeric');
        return (callback) ? callback() : null;
    }
    
    this.request('submission/' + submissionId + '.json', 'DELETE', params, function(data, err){
        
        if (callback) {
            callback(data, err);
        }
        else {
            console.log('data', data);
            console.error('error', err);
        }
    }); 
};

/**
* Create a Field for the specified Form
*
* @link    https://www.formstack.com/developers/api/resources/field#form/:id/field_POST
* 
* @param   {int}        formId                     The ID of the Form to create a new Field for
*
* @param   {object}     args            Arguments passed to API request.
*               {string} args.fieldType                 The type of Field to create
*               {string} args.label                     The Field's label
*               {bool}   args.hideLabel                 Flag to show or hode the label
*               {string} args.description               The Field's description text (shown below the filed)
*               {bool}   args.useCallout                Flag to show the description text in a callout box
*               {array}  args.fieldSpecificAttributes   The Field's attributes
*               {string} args.defaultValue              Predefined Field value
*               {array}  args.options                   Array of option labels (select, radio, checkbox only)
*               {array}  args.optionsValues             Array of option values (select, radio, checkbox only)
*               {bool}   args.required                  Flag whether Field is required
*               {bool}   args.readOnly                  Flag whether Field value can change
*               {bool}   args.hidden                    Flag whether is hidden on Form
*               {unique} args.unique                    Flag whether Field requires unique values
*               {int}    args.columnSpan                How many columns the Field should span
*               {int}    args.sort                      Numeric position in Form (0 is first)
*
* @param   {function}   callback(data, err)   Callback function for async requests.
*              {object}    data        The created Field
*              {object}    err         Error information, if any. If an error occurs, data is undefined
*/
FsAPI.prototype.createField = function(formId, args, callback) {
    
    if ( isNaN(formId) ) {
        console.error('Form ID is required and must be numeric');
        return (callback) ? callback() : null;
    }
    
    args = args || {};
    args.fieldType = args.fieldType || null;
    args.label = args.label || null;
    args.hideLabel = args.hideLabel || false;
    args.description = args.description || null;
    args.useCallout = args.useCallout || false;
    args.fieldSpecificAttributes = args.fieldSpecificAttributes || null;
    args.defaultValue = args.defaultValue || null;
    args.options = args.options || null;
    args.optionsValues = args.optionsValues || null;
    args.required = args.required || false;
    args.readOnly = args.readOnly || false;
    args.hidden = args.hidden || false;
    args.unique = args.unique || false;
    args.columnSpan = args.columnSpan || null;
    args.sort = args.sort || null;
    
    if (validFieldTypes.indexOf(args.fieldType) == -1){
        console.error('Provided Field Type is not in the list of known Field types');
        return (callback) ? callback() : null;
    }
    
    var params = {};
    
    params.field_type = args.fieldType;
    
    if (args.label) 
        params.label = args.label;
    
    if (args.hideLabel) 
        params.hide_label = args.hideLabel;
    
    if (args.description) 
        params.description = args.description;
    
    if (args.useCallout) 
        params.description_callout = 1;
    
    if (args.fieldSpecificAttributes) 
        params.attributes = args.fieldSpecificAttributes; // TODO: check if it's assoc
    
    if (args.defaultValue) 
        params.default_value = args.defaultValue;
    
    if (args.options) 
        params.options = args.options; // TODO: check assoc
    
    if (args.optionsValues) 
        params.options_values = args.optionsValues; // TODO check assoc
    
    if (args.required) 
        params.required = 1;
    
    if (args.readOnly) 
        params.readonly = 1;
    
    if (args.hidden) 
        params.hidden = 1;
    
    if (args.unique) 
        params.unique = 1;
    
    if (args.columnSpan) 
        params.colspan = args.columnSpan;
    
    if (args.sort) 
        params.sort = args.sort;
    
    this.request('form/' + formId + '/field', 'POST', params, function(data, err){
        
        if (callback) {
            callback(data, err);
        }
        else {
            console.log('data', data);
            console.error('error', err);
        }
    }); 
};

/** **************
*
* Private Methods
* 
* Use Function.prototype.call(thisArg[, args]) if you need to pass a reference of a FsAPI instance.
*
************** */

/**
* Converts a date string into seconds.
*
* TODO: needs improvement. Offers support only for RFC2822 or ISO 8601 date formats.
*
* @param {string} dateString    RFC2822 or ISO 8601 date formated string
*
* @return {number}  The number of seconds since January 1, 1970, 00:00:00 UTC. Returns 0 if stringDate can't be parsed.
*/
function strtotime(dateString){
    var ts = Date.parse(dateString);
    
    if ( isNaN(ts) ) 
        return 0;

    return ts / 1000;
}

/**
* Export Module
*/
module.exports = FsAPI;