/*=============================================================================================

An ad contains the actual packet of information intended for the end user, as well as directions
as to which end users that information should reach. The packet of information, known as the creative, 
should be embedded within the ad. Multiple creative types are conceivable.

As of now, an attribute for the actual information has not been added. Node (and JS) support a
multitude of rich media types, and it will be up to the developer to determine which types fit their
needs best. Simply add another attribute to this model in order to accomodate the media type. This
attribute will return itself as a JSON object querying the ad. Be sure to update and include the attribute
in the mediabuyer_routes.js file when both creating (POST) or updating (PUT) an ad. 

Alternatively, for broader projects a seperate creative schema can be created, before being embedded into
Ad schema. This is the preffered method (though more complex) of doing things, as you can then have multiple
creative types, and could take full advantage of an ad's "type" attribute. In this case, please add GET / PUT 
routes in order to add a creative to your ad. For example:

POST https://...../api/mediabuyers/:mediabuyer_id/campaigns/:campaign_id/ads/:ad_id/creatives/
PUT  https://...../api/mediabuyers/:mediabuyer_id/campaigns/:campaign_id/ads/:ad_id/creatives/:creative_id

Ad attributes:

Ad type => intended to be used to differentate different types of media. Use
this for simple performance tracking of different media types. This is especially useful if you
have created client end interfacing software, but is not vital and can be removed if need be.

Time => Time the ad was created. Meant for tracking purposes.

Status => True or False boolean. Useful for those creating thrid party BLE systems, backed by RTB.

Bid => Created soley for RTB purposes. To take full advantage of this back your software with some sort
of payment clearence algorithm to choose which ads are cleared. If only using this software for 
in house marketing purposes, the Bid attribute can be ignored. 

Target => Target your creatives by leveraging the beacon tagging system built into this project.
If targeting within a larger network, specify venue_name, zip, etc. If targeting to your own consumers,
simply leverage the tagging spec.

=============================================================================================*/


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdSchema = new Schema({
	
	type: {type: String, required: true},
	time: {type: Date, default: Date.now},
	status: {type: Boolean, default: true},
	bid: {
		bidtype: {type: String, required: true}, 
		amount: {type: Number, default: 5}
	},
	target: {
		venue_name: String,
		venue_street: String,
		venue_city: String,
		venue_state: String,
		venue_zip: Number,
		microlocation_descriptor_tag: [String],
		microlocation_action_tag: [String],
		microlocation_price_tag: [String]
	}

	//embed creative here 
	//for exmaple:
	/*
		creative:{
			title: String,
			description: String

		}

	*/
	//Any sort of rich media can be added to this creative (image, video, audio) depending on developer's desires
	
	
});

module.exports = mongoose.model('Ad', AdSchema);
