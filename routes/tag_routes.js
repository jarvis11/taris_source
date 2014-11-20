/*===============================================================================================================

Tag routes allow advertisers to simply query tags, instead of individually querying venues and their microlocations. 
This is extremely useful when it comes to targeting, and it emphasizes targeting based on user action, or description,
instead of just targeting by venue.

This is vital to anyone enabling 3rd party media buying through their platform.

=================================================================================================================*/

var express = require('express');
var router = express.Router();
var Venue = require('../models/venue_document/venue');

router.route('/actiontags')

	//get all action tags within a collection of venues
	//Accessed at: GET http://localhost:8080/api/actiontags
	.get(function(req, res){
		//find an array of venues
		Venue.find(function(err, venues){
			if(err)
				res.send(err);

			var action_tags_array = [];

			//Parse through all venues to find addresses
			for(var i = 0; i < venues.length; i++){
			    var address_array = venues[i].addresses;
			    for (var j = 0; j < address_array.length; j++){
			    	//Parse through addresses to find microlocations
			    	var microlocations_array = address_array[j].microlocations;
			    	for (var k = 0; k < microlocations_array.length; k++){
			    		action_tags_array.push(microlocations_array[k].action_tag);
			    	}

			    }
			}

			//array clean up
			var final_action_tags = [];
			for(x = 0; x < action_tags_array.length; x++){
				for(y = 0; y < action_tags_array[x].length; y++){
					//create flattened array
					final_action_tags.push(action_tags_array[x][y].toLowerCase());
				}

			}

 			 var uniqueArray = [];

 			  final_action_tags.forEach(function(value) {
 			  	if (uniqueArray.indexOf(value) == -1) {
               		 uniqueArray.push(value);
           		 }
      		  });


			res.json(uniqueArray);

		});
	});


router.route('/descriptortags')

	//get all descriptor tags within a collection of venues
	//Accessed at: GET http://localhost:8080/api/descriptortags
	.get(function(req, res){
		//find an array of venues
		Venue.find(function(err, venues){
			if(err)
				res.send(err);

			var descriptor_tags_array = [];

			//Parse through all venues to find addresses
			for(var i = 0; i < venues.length; i++){
			    var address_array = venues[i].addresses;
			    for (var j = 0; j < address_array.length; j++){
			    	//Parse through addresses to find microlocations
			    	var microlocations_array = address_array[j].microlocations;
			    	for (var k = 0; k < microlocations_array.length; k++){
			    		descriptor_tags_array.push(microlocations_array[k].descriptor_tag);
			    	}

			    }
			}

			//array clean up
			var final_descriptor_tags = [];
			for(x = 0; x < descriptor_tags_array.length; x++){
				for(y = 0; y < descriptor_tags_array[x].length; y++){
					//create flattened array
					final_descriptor_tags.push(descriptor_tags_array[x][y].toLowerCase());
				}

			}

 			 var uniqueArray = [];

 			  final_descriptor_tags.forEach(function(value) {
 			  	if (uniqueArray.indexOf(value) == -1) {
               		 uniqueArray.push(value);
           		 }
      		  });


			res.json(uniqueArray);

		});
	});

router.route('/pricetags')

	//get all price tags within a collection of venues
	//Accessed at: GET http://localhost:8080/api/pricetags
	.get(function(req, res){
		//find an array of venues
		Venue.find(function(err, venues){
			if(err)
				res.send(err);

			var price_tags_array = [];

			//Parse through all venues to find addresses
			for(var i = 0; i < venues.length; i++){
			    var address_array = venues[i].addresses;
			    for (var j = 0; j < address_array.length; j++){
			    	//Parse through addresses to find microlocations
			    	var microlocations_array = address_array[j].microlocations;
			    	for (var k = 0; k < microlocations_array.length; k++){
			    		price_tags_array.push(microlocations_array[k].price_tag);
			    	}

			    }
			}

			// //array clean up
			// var final_price_tags = [];
			// for(x = 0; x < price_tags_array.length; x++){
			// 	for(y = 0; y < price_tags_array[x].length; y++){
			// 		//create flattened array
			// 		final_price_tags.push(price_tags_array[x][y]);
			// 	}

			// }

 			 var uniqueArray = [];

 			  price_tags_array.forEach(function(value) {
 			  	if (uniqueArray.indexOf(value) == -1) {
               		 uniqueArray.push(value);
           		 }
      		  });


			res.json(uniqueArray);

		});
	});

module.exports = router;