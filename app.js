const odata = require('node-odata');
const config = require('config');

const {encryptPasswort, validatePasswort} = require('./utils/encryption');
 
//connect server to database
const db_path = config.get('odata.db_path');
var server = odata(db_path);

//TODO: specifi models (#7)
server.resource();

// start the server on port 3000
server.listen(3000);