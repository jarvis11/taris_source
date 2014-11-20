/*=============================================================================================

A mediabuyer is the actual organization intending to leverage BLE targeting tech to display ads
on users mobile devices.

Mediabuyers can create campaigns, and advertisements. All campaigns are actually referenced entities, not
directly embedded within the mediabuyer's document. This is done for storage efficiency, and keeps 
a single document from growing too large over time.

Mediabuyer attributes:

Name => name of media buyer

Campaigns => referenced campaigns created by mediabuyer, stored in a seperate campaigns collection.

=============================================================================================*/


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CampaignSchema = require('../campaign_document/campaign');

var MediabuyerSchema = new Schema({

	name: {type: String, required: true},
	campaigns: [{type: Schema.Types.ObjectId, ref: 'Campaign'}]
});

module.exports = mongoose.model('Mediabuyer', MediabuyerSchema);