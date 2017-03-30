module.exports = function (app) {
    var index = require('../controllers/index.server.controller');
    var tag = require('../controllers/tag.server.controller');
    var express = require('express');
    app.get('/', index.render);
    app.get('/list', tag.list);
    app.get('/list/:image', function(req, res){
    	const testFolder = 'result/'+req.params.image;
		const fs = require('fs');
		fs.readdir(testFolder, (err, files) => {
			res.render('image', {title : req.params.image, file : files});
		})
    });
};