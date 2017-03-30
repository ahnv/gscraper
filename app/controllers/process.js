var request = require('request')
	fs = require('fs'),
	sharp = require("sharp");

sharp.cache(false);

var proc = function(uri,filename){
	download(uri,filename);
}

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

module.exports = proc;