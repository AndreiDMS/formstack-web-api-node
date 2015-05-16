# Formstack Web API Node
Node.js wrapper for [Formstack API v2.0](http://developers.formstack.com/v2.0/docs)

## Requirements
* A valid [Formstack](http://www.formstack.com) account.
* A valid Formstack API V2 [Application](https://www.formstack.com/admin/applications/add).

## Installation
From npmjs.com
```bash
$ npm install formstack-web-api-node --save
```
From github.com
```bash
$ npm install https://github.com/AndreiDMS/formstack-web-api-node --save
```

## Usage
```javascript
var FsAPI = require('formstack-web-api-node');

var fsa = new FsAPI('YOUR_FS_APP_ACCESS_TOKEN');
```

## Testing
- run all tests
```bash
$ npm test
```
- run particular test
```bash
$ mocha test/test-<regexp>
```

## Release History
* 0.1.0 Initial release