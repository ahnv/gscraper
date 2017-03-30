var fs = require('fs'),
	request = require('request'), 
	cheerio = require('cheerio');

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

module.exports = scrape;