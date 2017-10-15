'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ProviderSchema = new Schema({
	'providername':{
		type: String
	},
	'provideraddress':{
		type: String
	},
	'providercity':{
		type: String
	},
	'providerstate':{
		type: String
	},
	'providerzipcode':{
		type: String
	},
	'hospitalregion':{
		type: String
	},
	'totaldischarges':{
		type: Number
	},
	'avgcoveredcharges':{
		type: Number
	},
	'avgtotalpayments':{
		type: Number
	},
	'avgmedicarepayments':{
		type: Number
	}
});
const Provider = mongoose.model('provider', ProviderSchema);

module.exports = Provider;