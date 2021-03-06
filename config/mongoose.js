var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function () {
    mongoose.Promise = global.Promise;
    var db = mongoose.connect(config.db);
    console.log('database running at ' + config.db);
    require('../app/models/tag.server.model');
    return db;
};
