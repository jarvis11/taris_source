/*===============================================================================================================

Microlocation routes allow you to bulk query all microlocations in your DB.
This is really meant to give you a high level overview on how microlocations are tagged, which tags typically go
together, etc.

=================================================================================================================*/

var express = require('express');
var router = express.Router();
var Venue = require('../models/venue_document/venue');

router.route('/microlocations')

	//get all Microlocations in a collection of venues 
	//Accessed at: GET http://localhost:8080/api/microlocations
	.get(function(req, res){
		Venue.find(function(err, venues){
			if(err)
				res.send(err);

			//var address_array = [];
			var microlocations_array = [];

			//Parse through all venues to find addresses
			for(var i = 0; i < venues.length; i++){
			    var address_array = venues[i].addresses;
			    for (var j = 0; j < address_array.length; j++){

			    	microlocations_array.push(address_array[j].microlocations);
				
			    }
			}

			res.json(microlocations_array);
		});
	});

module.exports = router;