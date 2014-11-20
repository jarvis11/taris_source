/*=============================================================================================

Venues are high level objects that group the physical locations that house BLE devices. Venues
represent the corporations that intend to link their physical locations with BLE tech. 
Each venue embeds multiple addresses to accomodate larger chains and franchises. 

Venue attributes:

name => name of venue

addresses => an array of addresses directly embedded within a venue's document

=============================================================================================*/


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AddressSchema = require('./address')

var VenueSchema = new Schema({

	name: {type: String, required: true},
	addresses: [AddressSchema.schema]
});

module.exports = mongoose.model('Venue', VenueSchema);