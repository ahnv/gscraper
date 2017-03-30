var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

var tagSchema = new Schema({
	tag : String,
	date : Date
});

tagSchema.pre('save', function(next) {
	var currentDate = new Date();
	this.date = currentDate;
	next();
});

mongoose.model('Tag', tagSchema);
