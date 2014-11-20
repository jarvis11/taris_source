/*=============================================================================================
Addresses are embedded within venues, and represent the actual, physical locations of the venue.
Each address embeds multiple microlocations.

Address attributes:

street => street at which venue is located at
city => city of address
state => state of address
zip => zipcode of address
microlocations => array of sublocations embedded directly within address document


=============================================================================================*/


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MicrolocationSchema = require('./microlocation');

var AddressSchema = new Schema({
	
	street: {type: String, required: true},
	city: {type: String, required: true},
	state: {type: String, required: true},
	zip: {type: Number, required: true},
	microlocations: [MicrolocationSchema.schema]
	
});

module.exports = mongoose.model('Address', AddressSchema);

