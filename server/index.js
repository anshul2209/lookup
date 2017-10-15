//server.js
'use strict'
//first we import our dependencies…
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const path = require('path');
var Provider = require('../model/provider');
var config = require('../config/config');
//and create our instances
var app = express();

app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

var router = express.Router();

var port = process.env.PORT || 3005;

var mongoDB = config.mongourl;
mongoose.connect(mongoDB, { useMongoClient: true })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('monogdb is connected and running');
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
 res.setHeader('Cache-Control', 'no-cache');
 next();
});
router.get('/', function(req, res) {
 res.json({ message: 'API Initialized!'});
});

//create a hashmap for condition
const validqueryparams = [ 'max_discharges', 'min_discharges', 'max_average_covered_charges', 'min_average_covered_charges', 'min_average_medicare_payments', 'max_average_medicare_payments', 'state', 'selectedvalue' ];
function returnQuery(key, value){
	if(key === 'max_discharges' || key === 'min_discharges'){
		value = parseInt(value,10);
	}else if( key !== 'state'){
		value = parseFloat(value, 10);
	}
	var queryHashmap = {
		'max_discharges' : {
			'totaldischarges' : { "$lte" : value }
		},
		'min_discharges' : {
			'totaldischarges' : { "$gte" : value }
		},
		'max_average_covered_charges': {
			'avgcoveredcharges' : { "$lte" : value }
		},
		'min_average_covered_charges': {
			'avgcoveredcharges' : { "$gte" : value }
		},
		'max_average_medicare_payments': {
			'avgmedicarepayments' : { "$lte" : value }
		},
		'min_average_medicare_payments': {
			'avgmedicarepayments' : { "$gte" : value }
		},
		'state': {
			'providerstate' : value 
		}
	}
	return queryHashmap[key] || {};
}
router.route('/providers')
.get(function(req, res) {
  const queryparams = req.query;
  const fieldstoshow = req.query.selectedvalue ? req.query.selectedvalue.split(',') : [];
	var validquery = true;
	var databasequery = {};
	var fieldstoshowquery = { '_id': 0 };
	for(var i=0;i<fieldstoshow.length;i++){
		let field = fieldstoshow[i];
		fieldstoshowquery[field] = 1;
	}
	var resData = {
		success: false,
		message: '',
		data: []
	}
	
	if(Object.keys(queryparams).length > 0 && queryparams.constructor === Object){
		for(var key in queryparams){
			if(validqueryparams.indexOf(key) === -1){
				validquery = false;
				break;
			}
		}
		if(validquery){
			databasequery["$and"]=[];
			for(var key in queryparams){
				databasequery["$and"].push(returnQuery(key, queryparams[key]));
			}
		}
	}
	if(validquery){
		Provider.find(databasequery, fieldstoshowquery, function(err, data) {
			if (err){
	    	console.log('there is error while executing mongo query', err);
	    	resData.success = false;
	    	resData.message = err;
	      res.send(resData);
	    }
	    resData.success = true;
	    resData.data = data;
	    if(data && data.length){
	    	resData.message = 'data recieved';
	    }else{
	    	resData.message = 'no data';
	    }
	    console.log(resData.data.length);
	    res.send(resData);
	  });
	}else{
		resData.message = 'the query is invalid';
		res.send(resData)
	}
})
//Use our router configuration when we call /api
app.use('/', router);
//starts the server and listens for requests
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});
app.listen(port, function() {
 console.log(`api running on port ${port}`);
});

module.exports = app; // for testing