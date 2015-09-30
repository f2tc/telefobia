var Debug = require('debug');

module.exports = {
    info: new Debug('telefobia:info'),
    error: new Debug('telefobia:error')
};