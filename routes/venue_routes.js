/*===============================================================================================================

Venue routes allow you to register venues, which are physical locations
Venues can have multiple addresses, with each address having a set of microlocations
Microlocations are registered BLE devices and their associated targeting tags
All objects are directly embedded within one another, meaning no population is required here

Embedded structure is as follows:
Venue ==> Address ==> Microlocation

=================================================================================================================*/





//initialize Express router
var express = require('express');
var router = express.Router();

//import necessary models
var Venue = require('../models/venue_document/venue');
var Address = require('../models/venue_document/address');
var Microlocation = require('../models/venue_document/microlocation');

// // middleware to use for all requests
// router.use(function(req, res, next) {
// 	// do logging
// 	console.log('Dealing with Venues.');
// 	next(); // make sure we go to the next routes and don't stop here
// });





/*=============================================================================================

ROUTES GO HERE

All routes are accessed at: http://hosturl/api/...

=============================================================================================*/


/*========================================================================

Query a collection of venues (GET)
Create a new venue document (POST)

==========================================================================*/

router.route('/venues')

	.get(function(req, res){

		//find all venue documents
		Venue.find(function(err, venues){
			if(err){
				console.log('error getting venues');
				res.send(err);
			} else{

				//return array of all venue documents
				console.log('getting all venues');
				res.json(venues);
			}	
		});
	})

	.post(function(req,res){

		//create a new venue document
		var venue = new Venue();

		//Input variables needed to create venue
		venue.name = req.body.name;

		//save venue
		venue.save(function(err){

			//ensure venue parameters are accurate
			if(err){
				console.log('Error. Check your parameters.');
				res.send(err);
			} else{
				console.log('adding a new venue');
				res.json({message: 'You have registered a venue!'});
			} //close venue GET error check
		});
	});



/*========================================================================

Query a specific venue document (GET)
Update a venue document (PUT)

==========================================================================*/

router.route('/venues/:venue_id')
	
	.get(function(req, res) {

		//find venue with id :venue_id
		Venue.findById(req.params.venue_id, function(err, venue) {

			//ensure :venue_id is valid
			if (err){
				res.send(err);
				console.log('error getting venue -- invalid id');
			} else {

				//return venue
				console.log('getting venue with id: ' + req.params.venue_id);
				res.json(venue);
			} // close venue GET error check			
		});
	})

	.put(function(req, res) {

		//find venue by id
		Venue.findById(req.params.venue_id, function(err, venue) {

			//ensure venue id is valid
			if (err){
				console.log('error getting venue -- invalid id');
				res.send(err);
			} else {

				//update venue attributes
				venue.name = req.body.name; 	

				//save the Venue document
				venue.save(function(err) {

					//ensure updated attributes are valid
					if (err){
						console.log('cannot save venue -- invalid parameters');
						res.send(err);
					} else{
						console.log('updating a specific venue');
						res.json({message: 'Venue ' + req.params.venue_id + ' has been updated.'});
					} // close venue SAVE error check
					
				});
			} // close venue GET error check
		});
	});


/*========================================================================

Query all addresses embedded within a venue document (GET)
Embed a new address within a venue document (POST)

==========================================================================*/

router.route('/venues/:venue_id/addresses')	
	
	.get(function(req, res) {

		//find venue by id
		Venue.findById(req.params.venue_id, function(err, venue) {

			//ensure venue id is valid
			if (err){
				console.log('error getting venue -- invalid id');
				res.send(err);
			}
			else{

				//return all embedded addresses
				console.log('getting a venues addresses');
				res.json(venue.addresses);
			} // close venue GET error check
		});
	})


	.post(function(req, res) {

		//find venue by id
		Venue.findById(req.params.venue_id, function(err, venue) {

			//ensure venue id is valid
			if (err){
				console.log('error getting venue -- invalid id');
				res.send(err);
			} else{

				//create a new address object and assign required entities
				var address = new Address();
				address.street = req.body.street;
				address.city = req.body.city;
				address.state = req.body.state;
				address.zip = req.body.zip;

				//push the address to parenting venue
				venue.addresses.push(address);

				//no need to save the address here...directly save the parenting object
				venue.save(function(err) {

					//ensure new address is valid
					if (err){
						console.log('error saving address -- invalid parameters');
						res.send(err);
					} else{
						console.log('adding an address to a venue');
						res.json({ message: 'You have added an address to this venue.' });
					} // close venue SAVE error check
				});
			} // close venue GET error check
		});
	});





/*========================================================================

Query a single address embedded within a venue document (GET)
Update a specific address embedded within a venue (PUT)

==========================================================================*/

router.route('/venues/:venue_id/addresses/:address_id')
	

	.get(function(req, res) {

		//find venue by id
		Venue.findById(req.params.venue_id, function(err, venue) {

			//ensure venue id is valid
			if (err){
				console.log('error getting venue -- invalid id');
				res.send(err);
			} else{

				//find address by id
				var address = venue.addresses.id(req.params.address_id);

				//ensure address id is valid
				if(address == undefined){
					console.log('error getting address -- invalid id');
					res.json({message: 'error: invalid address id'});
				} else {

					//return address
					console.log('getting address with id ' + req.params.address_id);
					res.json(venue.addresses.id(address));
				} // close address GET error check

			} // close venue GET error check

		});

	})

	//ISSUE: RIGHT NOW NEED TO UPDATE THE ENTIRE ADDRESS. CANNOT JUST UPDATE SIGNAL ENTITIES. NEED TO FIX THIS.
	.put(function(req, res){

		//find venue by id
		Venue.findById(req.params.venue_id, function(err, venue) {

			//ensure venue id is valid
			if(err){
				console.log('error getting venue -- invalid id');				
				res.send(err);
			} else {

				//find address by id
				var address = venue.addresses.id(req.params.address_id);

				//ensure address id is valid
				if(address == undefined){
					console.log('error getting address -- invalid id');
					res.json({message: 'error: invalid address id'});
				} else {

					//update attributes of address
					address.street = req.body.street;
					address.city = req.body.city;
					address.state = req.body.state;
					address.zip = req.body.zip;

					//save parenting object
					venue.save(function(err){

						//ensure updated parameters of address are valid
						if (err){
							console.log('error -- invalid address parameters');
							res.send(err);
						} else{
							console.log('updating address');
							res.json({message: "Address has been updated"});
						} // close venue SAVE error check
					});
					
				} // close address GET error check

			} // close venue GET error check

		});
	});


/*========================================================================

Query all microlocations embedded within an address (GET)
Create a new microlocation and embed within an existing address (POST)

==========================================================================*/

router.route('/venues/:venue_id/addresses/:address_id/microlocations')
	
	.get(function(req, res){

		//find venue by id
		Venue.findById(req.params.venue_id, function(err, venue){

			//ensure that venue id is valid
			if(err){
				console.log('error getting venue -- invalid id');
				res.send(err);
			} else{

				//find address by id
				var address = venue.addresses.id(req.params.address_id);

				//ensure that address id is valid
				if(address == undefined){
					console.log('error getting address -- invalid id');
					res.json({message: 'error getting address -- invalid id'});

				} else{

					//return all microlocations for a given address
					console.log('getting all microlocations for address ' + address.id);
					res.json(address.microlocations);

				} // close address GET error check

			} // close venue GET error check

		});
	})


	.post(function(req,res){

		//find venue by id
		Venue.findById(req.params.venue_id, function(err, venue){

			//ensure that venue id is valid
			if(err){
				console.log('error getting venue -- invalid id');
				res.send(err);
			} else{

				//find address by id
				var address = venue.addresses.id(req.params.address_id);

				//ensure address id is valid
				if(address == undefined){
					console.log('error getting address -- invalid id');
					res.json({message: "error getting address -- invalid id"});
				} else{

					//if address is valid, create a new microlocation
					var microlocation = new Microlocation();
					microlocation.uuid = req.body.uuid;
					microlocation.major_id = req.body.major_id;
					microlocation.minor_id = req.body.minor_id;
					microlocation.descriptor_tag = req.body.descriptor_tag;
					microlocation.action_tag = req.body.action_tag;
					microlocation.price_tag = req.body.price_tag;

					//add microlocation to address
					address.microlocations.push(microlocation);

					//save parent object
					venue.save(function(err) {

						//ensure that microlocation parameters are valid
						if (err){
							console.log('error posting microlocation -- invalid parameters');
							res.send(err);
						} else{
							console.log('adding microlocation');
							res.json({ message: 'You have added a microlocation to this address.' });
						} // close venue SAVE error check
	
					});

				} // close address GET error check

			} // close venue GET error check
		});
	});


/*========================================================================

Query a specific microlocation belonging to an address (GET)
Update a specific microlocation (PUT)

==========================================================================*/


router.route('/venues/:venue_id/addresses/:address_id/microlocations/:microlocation_id')

	.get(function(req, res){

		//Find venue
		Venue.findById(req.params.venue_id, function(err, venue){
			if(err){
				console.log('error getting venue -- invalid id');
				res.send(err);
			} else {

				//get required address object
				var address = venue.addresses.id(req.params.address_id);

				//ensure that address object is valid before trying to get microlocation
				if(address == undefined){
					console.log('error getting address -- invalid id');
					res.json({message: 'error getting address -- invalid id'});
				} else{

					//get required microlocation
					var microlocation = address.microlocations.id(req.params.microlocation_id);

					//ensure that microlocation is valid
					if(microlocation == undefined){
						console.log('error getting microlocation -- invalid id');
						res.json({message: 'error getting microlocation -- invalid id'});
					} else {
						console.log('getting microlocation with id ' + microlocation.id);
						res.json(microlocation);
					} // close microlocation GET error check

				} // close address GET error check

			} // close venue GET error check

		});
	})

	//ISSUE: RIGHT NOW NEED TO UPDATE THE ENTIRE MICROLOCATION. CANNOT JUST UPDATE SIGNAL ENTITIES. NEED TO FIX THIS.
	.put(function(req, res){

		//Find the venue we want
		Venue.findById(req.params.venue_id, function(err, venue) {
			if(err){
				console.log('error getting venue -- invalid id');
				res.send(err);
			} else{

				//get address object with inputted ID
				var address = venue.addresses.id(req.params.address_id);

				//check to see if address is valid before finding microlocation
				if(address == undefined){
					console.log('error getting address -- invalid id');
					res.json({message:'error getting address -- invalid id'});

				} else{

					//get microlocation that we need to update
					var microlocation = address.microlocations.id(req.params.microlocation_id);

					//check to see that microlocation is valid before updating
					if(microlocation == undefined){
						console.log('error getting microlocation -- invalid id');
						res.json({message: 'error getting microlocation -- invalid id'});
					} else{

						//update parameters of microlocation
						microlocation.uuid = req.body.uuid;
						microlocation.major_id = req.body.major_id;
						microlocation.minor_id = req.body.minor_id;
						microlocation.descriptor_tag = req.body.descriptor_tag;
						microlocation.action_tag = req.body.action_tag;
						microlocation.price_tag = req.body.price_tag;

						//save venue
						venue.save(function(err){

							//make sure parameters of microlocation are valid
							if (err){
								console.log('error updating microlocation -- invalid paramters');
								res.send(err);
							} else {
								console.log('updating microlocation');
								res.json({message: 'Microlocation has been updated!'});
							} // close venue SAVE error check
	
						});

					} // close microlocation GET error check

				} // close address GET error check

			} // close venue GET error check

		});
	});


module.exports = router;