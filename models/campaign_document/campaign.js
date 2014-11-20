/*=============================================================================================

Campaigns act as an organizational tool, vital to anyone developing 3rd party interfaces for clients.

Campaigns will typically house a group of ads, with high level organizational attributes giving some 
control over the broad spectrum of ads. 

Campaign attributes:

name => name of campaign

Time => Time the campaign was created. Meant for tracking purposes.

Status => True or False boolean. Meant as a flag to pause or resume all ads within a campaign if this
functionality is needed.

Type => Useful when creating RTB systems in hopes of optimizing ad clearence based on objective of campaign.

Budget => Useful for RTB systems, implementing a heirarchical budget for organizational purposes.

Ads => All ads embedded within campaign.  


=============================================================================================*/


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AdSchema = require('./ad')

var CampaignSchema = new Schema({

	name: String,
	time: {type: Date, default: Date.now},
	status: {type: Boolean, default: true},
	type: {type: String, required: true},
	budget: {type: Number, required: true},
	ads: [AdSchema.schema]


});

module.exports = mongoose.model('Campaign', CampaignSchema);