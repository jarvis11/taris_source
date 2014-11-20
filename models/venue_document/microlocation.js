/*=============================================================================================
Microlocations provide a representation of BLE devices within a venue. Each microlocation is
a sublocation within the venue in which a BLE device has been installed. Think of microlocations
as a way of registering each BLE device installed within a venue.

Each microlocation has a set of descriptor tags, action tags, and price tags associated with it. 
These tags represent a unique system to categorize BLE devices, and allows for marketers (mediabuyers)
to target consumers near these devices on a broad specturm; based on where they are, what they're doing, 
or their general demographics. 

Microlocations are directly embedded within their parenting address, and are subsequently stored within
their parenting venue's document. All microlocations can be queried through their parenting venues, or 
on their own.

Microlocation attributes:

uuid => universal unique identifier of BLE device being registered at microlocation
major_id => major id of BLE device being registered at microlocation
minor_id => minor id of BLE device being registered at microlocation
descriptor_tags => array of tags aimed at describing the immediate area surrounding the BLE device
action_tags => array of tags aimed at describing consumer actions in the immediate area surrounding the BLE device
price_tag => tag aimed at describing the consumer demographic in the immediate area surrounding the BLE device

=============================================================================================*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MicrolocationSchema = new Schema({
	
	uuid: {type: String, required: true},
	major_id: {type: Number, required: true},
	minor_id: {type: Number, required: true},
	descriptor_tag: [String],
	action_tag: [String],
	price_tag: String
});

module.exports = mongoose.model('Microlocation', MicrolocationSchema);