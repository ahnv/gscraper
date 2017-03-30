var config = require('./config'),
    express = require('express');


module.exports = function () {
    var app = express();
    app.set('views', './app/views');
    app.set('view engine', 'ejs');
    require('../app/routes/scrape.server.routes.js')(app);
    require('../app/routes/index.server.routes.js')(app);
    app.use(express.static('./result'));
    return app;
};