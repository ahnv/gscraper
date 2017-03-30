var express = require('express'),
	fs = require('fs'),
	request = require('request'),
	cheerio = require('cheerio')
	sharp = require("sharp"),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	app     = express();

	

request = request.defaults({jar: true});

sharp.cache(false);

mongoose.connect('mongodb://user:user@ds135800.mlab.com:35800/zillion');

var tag = new Schema({
	user : ObjectId,
	tag : String,
	date : Date
});

var download = function(uri, filename){
  var ext = "";
  request.head(uri, function(err, res, body){
  	if (!err){
	  	var ct = res.headers['content-type'];
	  	if (ct === "image/jpeg") ext = ".jpg"
	  	else if (ct === "image/bmp") ext = ".bmp";
		else if (ct === "image/gif") ext = ".gif";
		else if (ct === "image/png") ext = ".png";
	    request(uri)
	    	.pipe(fs.createWriteStream(filename+"temp"+ext))
	    	.on('error', function(e){console.log(e);})
	    	.on('finish',function(e){ if (!e) imageProcess(filename,ext);});
	}
   });
};



var imageProcess = function(filename,ext){
	sharp(filename+"temp"+ext)
			.grayscale()
			.toFile(filename+ext,function(err){
				if (err){ console.log(err);}
				else {fs.unlink(filename+"temp"+ext);};
			});
}


var scrape = function(tag,callback){
	var options = {
			url: 'https://www.google.co.in/search?safe=active&site=&tbm=isch&source=hp&biw=1536&bih=744&tbm=isch&q='+tag+'&oq='+tag,
		    headers: {
		        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
		    }
		},
		links = [];
	request(options,function(error, response, html){
		if (!error){
			var $ = cheerio.load(html);
			$(".rg_meta").slice(0,15).each(function(){
				var link = JSON.parse($(this).text())['ou'];
				var n = link.indexOf('?');
				link = link.substring(0, n != -1 ? n : link.length);
				links.push(link);
			});
			callback(false,links);
		}
	});
}



app.get('/scrape/:tag', function(req, res){
	var dir = "./result/"+req.params.tag,
		counter = 0;
	if (!fs.existsSync(dir)){fs.mkdirSync(dir);} 
	scrape(req.params.tag,function(error,links){
		if (!error){
			for(var i = 0 ; i < links.length; i++)
				download(links[i], dir+"/"+counter++);
			res.send("done");
		}else{
			res.send("Some Error Has Occured");
		}
	});
})

app.listen('8080');
console.log('Server Started');
exports = module.exports = app;