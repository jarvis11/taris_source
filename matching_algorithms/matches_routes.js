/*=============================================================================================


A clearance algorithm of some sort must be implemented in order to power your BLE targeting system.
When a mediabuyer enters targeting specs, it’s up to your platform to determine which BLE devices, and 
subsequently which mobile devices, these targeting specs correspond to. Most efficient systems take this a 
step further, and integrate real time bidding to push revenues and only clear advertisers with engaging content.


These routes are for refernce only. All algorithms should really be put into a seperate program.

It doesnt take a great developer to see that this code completely sucks. It was put together
in a matter of 15-20mins for example purposes. Please only use this as a guide, and do not use this in production
code. 

There is also a partial Java example of a similar algorithm (found in matches_algo.java in the
parenting folder). It is recommended that you implement your algorithm in a seperate program.





=============================================================================================*/

var express = require('express');
var router = express.Router();

var Venue = require('../models/venue_document/venue');
var Address = require('../models/venue_document/address');
var Microlocation = require('../models/venue_document/microlocation');

var Mediabuyer = require('../models/mediabuyer_document/mediabuyer');
var Campaign = require('../models/campaign_document/campaign');
var Ad = require('../models/campaign_document/ad');

router.route('/matches/:mediabuyer_id/:campaign_id/:ad_id')

	.get(function(req, res){

		//Find desired mediabuyer, populating only campaign with id :campaign_id
		Mediabuyer.findById(req.params.mediabuyer_id).populate({
			
			path: 'campaigns', 
			match: {_id: req.params.campaign_id}

		}).exec(function(err, mediabuyer){

			if(err)
				res.send(err);
			
			//store our campaign
			var campaign = mediabuyer.campaigns[0];

			//return ad with specific id
			console.log('getting ad with id ' + req.params.ad_id);

			//grab the ad you want to find matches for
			var ad = campaign.ads.id(req.params.ad_id);

			//Parse through all venue's microlocations to see if a match can be found

			Venue.find(function(err, venues){
				if(err)
					res.send(err);

				//var address_array = [];
				var microlocations_array = [];

				//Parse through all venues to find addresses
				for(var i = 0; i < venues.length; i++){

					//check if ad contains a venue_name parameter
					//if there is a match, or no venue name is specified, then add all the addresses in that venue and examine them
					if((ad.target.venue_name !== undefined && ad.target.venue_name == venues[i].name) || ad.target.venue_name == undefined ) {

						var address_array = venues[i].addresses;

					    for (var j = 0; j < address_array.length; j++){
					    	//check if address is valid in this case

					    	//now check if the address itself deserves to be pushed

							//check if address street, city, state, or zip is specified
							if((ad.target.venue_street !== undefined && ad.target.venue_street == address_array[j].street) || (ad.target.venue_street == undefined)){

								if((ad.target.venue_city !== undefined && ad.target.venue_city == address_array[j].city) || (ad.target.venue_city == undefined)){

									if((ad.target.venue_state !== undefined && ad.target.venue_state == address_array[j].state) || (ad.target.venue_state == undefined)){

										if((ad.target.venue_zip !== undefined && ad.target.venue_zip == address_array[j].zip) || (ad.target.venue_zip == undefined)){

											//IF THE ADDRESS IS VALID, PUSH THE MICROLOCATIOn
											//MICROLOCATION MAY NOT BE VALID
											microlocations_array.push(address_array[j].microlocations);

										}

									
									}

								}

							}
					    	
					    }


					}
				   
				}

				//array clean up
				var final_microlocations_array = [];
				for(x = 0; x < microlocations_array.length; x++){
					for(y = 0; y < microlocations_array[x].length; y++){
						//create flattened array
						final_microlocations_array.push(microlocations_array[x][y]);
					}

				}



				var descriptor_tag_matches = [];
				var count = 0;
				if(ad.target.microlocation_descriptor_tag.length > 0){

					console.log("I'm HERE");

					for(z = 0; z < final_microlocations_array.length; z++){

						var temp_microlocation = final_microlocations_array[z];
						for(i = 0; i < ad.target.microlocation_descriptor_tag.length; i++){

							for(j = 0; j < temp_microlocation.descriptor_tag.length; j++){

								if(ad.target.microlocation_descriptor_tag[i] == temp_microlocation.descriptor_tag[j]){
									count++;
								}
							}
						}

						if(count == ad.target.microlocation_descriptor_tag.length){
							descriptor_tag_matches.push(final_microlocations_array[z]);
							count = 0;
						}
					}

					

				} else {

					console.log("I'm HERE - 2");

					descriptor_tag_matches = final_microlocations_array.slice();
				}


				//FILTER FOR ACTION TAGS
				var filtered_matches = [];
				var count = 0;
				if(ad.target.microlocation_action_tag.length > 0){

					for(z = 0; z < descriptor_tag_matches.length; z++){

						var temp_microlocation = descriptor_tag_matches[z];
						for(i = 0; i < ad.target.microlocation_action_tag.length; i++){

							for(j = 0; j < temp_microlocation.action_tag.length; j++){

								if(ad.target.microlocation_action_tag[i] == temp_microlocation.action_tag[j]){
									count++;
								}
							}
						}

						if(count == ad.target.microlocation_action_tag.length){
							filtered_matches.push(descriptor_tag_matches[z]);
							count = 0;
						}
					}

					

				} else {

					filtered_matches = descriptor_tag_matches.slice();
				}

				//FILTER FOR PRICE TAGS
				var final_matches = [];
				var count = 0;
				if(ad.target.microlocation_price_tag.length > 0){

					for(z = 0; z < filtered_matches.length; z++){

						var temp_microlocation = filtered_matches[z];
						for(i = 0; i < ad.target.microlocation_price_tag.length; i++){

							for(j = 0; j < temp_microlocation.price_tag.length; j++){

								if(ad.target.microlocation_price_tag[i] == temp_microlocation.price_tag[j]){
									count++;
								}
							}
						}

						if(count == ad.target.microlocation_price_tag.length){
							final_matches.push(filtered_matches[z]);
							count = 0;
						}
					}

					

				} else {

					final_matches = filtered_matches.slice();
				}



				res.json(final_matches);

				


			});




			
		});


	});


module.exports = router;
