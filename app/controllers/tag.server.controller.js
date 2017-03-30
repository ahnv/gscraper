var Tag = require('mongoose').model('Tag');

exports.list= function(req,res){
	Tag.find({},function(err,tags){
		if (err){
			return next(err);
		}else{
			res.render('list', {
				title: "Google Image Scraper",
				jsonData: tags
			}); 
		}
	});
}
