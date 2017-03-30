var fs = require('fs'),
	scrape = require('../../app/controllers/scrape'),
	proc = require('../../app/controllers/process'),
	Tag = require('mongoose').model('Tag');

module.exports = function (app){

	app.get('/scrape/:tag', function(req, res){
		var dir = "./result/"+req.params.tag,
			counter = 0;
		if (!fs.existsSync(dir)){fs.mkdirSync(dir);} 
		scrape(req.params.tag,function(error,links){
			if (!error){
				for(var i = 0 ; i < links.length; i++)
					proc(links[i], dir+"/"+counter++);
				res.send("done");
				var newtag = new Tag({
					tag: req.params.tag
				});
				newtag.save(function(err){
					if (err) console.log(err);
					else console.log("added");
				});
			}else{
				res.send("Some Error Has Occured");
			}
		});
	})
}