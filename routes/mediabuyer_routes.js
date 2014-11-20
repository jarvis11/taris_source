/*===============================================================================================================

Mediabuyer routes allow you to manipulate medaibuyer objects
Mediabuyer objects own campiagn, and subsequently ad, objects
Mediabuyer objects are stored in their own collection, referencing seperate collections of campaigns
and ads for efficiency.

=================================================================================================================*/






//initialize Express router
var express = require('express');
var router = express.Router();

//import necessary models
var Mediabuyer = require('../models/mediabuyer_document/mediabuyer');
var Campaign = require('../models/campaign_document/campaign');
var Ad = require('../models/campaign_document/ad');




/*=============================================================================================

ROUTES GO HERE

All routes are accessed at: http://hosturl/api/...

=============================================================================================*/


/*========================================================================

Query all mediabuyer objects (GET)
Create a new mediabuyer object (POST)

==========================================================================*/

router.route('/mediabuyers')

	.get(function(req, res){

		//find array of all media buyers
		Mediabuyer.find(function(err, mediabuyers){
			if(err){
				console.log('error getting mediabuyers');
				res.send(err);
			} else {
				//return array of mediabuyers
				console.log('getting all mediabuyers');
				res.json(mediabuyers);
			}
		});
	})


	.post(function(req,res){

		//create a new mediabuyer object
		var mediabuyer = new Mediabuyer();

		//assign attributes
		mediabuyer.name = req.body.name;

		//save mediabuyer object
		mediabuyer.save(function(err){

			//ensure parameters are valid
			if(err){
				console.log('error saving mediabuyer -- invalid parameters');
				res.send(err);
			} else{
				console.log('adding a new mediabuyer');
				res.json({message: 'You have created a mediabuyer!'});
			}
		});
	});


/*========================================================================

Query a specific mediabuyer object (GET)
Edit an existing mediabuyer (PUT)

==========================================================================*/

router.route('/mediabuyers/:mediabuyer_id')

	.get(function(req, res) {

		//find mediabuyer through inputed id :mediabuyer_id
		Mediabuyer.findById(req.params.mediabuyer_id, function(err, mediabuyer) {

			//ensure id is valid
			if (err){
				console.log('error getting mediabuyer -- invalid id');
				res.send(err);
			} else{

				//return mediabuyer object
				console.log('getting mediabuyer with id ' + req.params.mediabuyer_id);
				res.json(mediabuyer);
			}
			
		});
	})


	.put(function(req, res) {

		//find mediabuyer through inputed id :mediabuyer_id
		Mediabuyer.findById(req.params.mediabuyer_id, function(err, mediabuyer) {

			//ensure id is valid
			if (err){
				console.log('error getting mediabuyer -- invalid id');
				res.send(err);
			} else {

				//update mediabuyer attributes
				mediabuyer.name = req.body.name; 

				//save mediabuyer object
				mediabuyer.save(function(err) {

					//ensure parameters are valid
					if (err){
						console.log('error -- invalid parameters')
						res.send(err);
					} else {
						console.log('updating a specific mediabuyer');
						res.json({message: 'Mediabuyer has been updated.'});
					}
				});
			}
		});
	});


/*========================================================================

Query all campaigns belonging to a mediabuyer (GET)
Create a new campaign for a specific mediabuyer (POST)

==========================================================================*/

router.route('/mediabuyers/:mediabuyer_id/campaigns')	
	
	.get(function(req, res) {

		//MONGOOSE POPULATE
		//utilize mongoose's populate method to connect mediabuyer and campaigns collection
		//populate the campaigns attribute of mediabuyer object through the campaigns collection
		Mediabuyer.findById(req.params.mediabuyer_id).populate('campaigns').exec(function(err, mediabuyer){

			//ensure mediabuyer id is valid
			if(err){
				console.log('error getting mediabuyer -- invalid id');
				res.send(err);

			} else{
				//return an array of populated campaigns
				console.log('getting all campaigns belonging to mediabuyer ' + req.params.mediabuyer_id);
				res.json(mediabuyer.campaigns);
			} 
			
		});
	})


	.post(function(req, res) {

		//find mediabuyer through inputed id :mediabuyer_id
		Mediabuyer.findById(req.params.mediabuyer_id, function(err, mediabuyer) {

			//ensure :mediabuyer_id is valid
			if (err){
				console.log('error getting mediabuyer -- invalid id');
				res.send(err);
			} else{

				//create a new campaign
				var campaign = new Campaign();
				campaign.name = req.body.name;
				campaign.type = req.body.type;
				campaign.budget = req.body.budget;

				//save campaign
				campaign.save(function(err){

					//ensure campaign parameters are valid
					if(err){
						res.send(err);
					}
					else{

						//if campaign has been validated push it to mediabuyer
						mediabuyer.campaigns.push(campaign);

						//save mediabuyer object
						//no need to save campaign object seperately, as it belongs to the mediabuyer
						mediabuyer.save(function(err){
							if(err)
								res.send(err);
							res.json({message: 'You have added a campaign to this mediabuyer'});
						});
					}
				});
			}
		});
	});


/*========================================================================

Query a specific campaign belonging to a mediabuyer (GET)
Edit an existing campaign (PUT)

==========================================================================*/


router.route('/mediabuyers/:mediabuyer_id/campaigns/:campaign_id')

	.get(function(req, res){

		//Find mediabuyer with id :mediabuyer_id
		//Populate its campaigns attribute with a single campaign with id :campaign_id
		//This will still return an array of campiagns, but the array will only contain the desired campaign
		Mediabuyer.findById(req.params.mediabuyer_id).populate({
			
			path: 'campaigns', 
			match: {_id: req.params.campaign_id}

		}).exec(function(err, mediabuyer){

			//ensure :mediabuyer_id is valid
			if(err){
				res.send(err);
				console.log("error -- invalid campaign or mediabuyer id");
			} else{

				//grab the actual campiagn object out of the populated array
				var campaign = mediabuyer.campaigns[0];

				//ensure campaign has been created
				//if mediabuyer has no campaigns created, the returned object could be null
				//population would have no effect in this scenario, but embedded objects are still accessible
				if(campaign == undefined){
					console.log('ERROR');
					res.json({message: 'error -- invalid campaign id'});

				} else{
					//return campaign
					res.json(campaign);
				}
			} 
		});
	})

	.put(function(req, res){

		//Find mediabuyer with id :mediabuyer_id
		//Populate its campaigns attr with a single campaign with id :campaign_id
		Mediabuyer.findById(req.params.mediabuyer_id).populate({
			
			path: 'campaigns', 
			match: {_id: req.params.campaign_id}

		}).exec(function(err, mediabuyer){

			//ensure mediabuyer exists
			if(err){
				console.log("invalid mediabuyer or campaign id");
				res.send(err);
			} else{

				//grab the actual campiagn object out of the populated array
				campaign = mediabuyer.campaigns[0];

				//ensure campaign has been created
				//if mediabuyer has no campaigns created, the returned object could be null
				//population would have no effect in this scenario, but embedded objects are still accessible
				if(campaign == undefined){
					console.log('ERROR');
					res.json({message: 'error -- invalid campaign id'});
				} else{

					//edit attributes of campiagn
					//type attribute is not editable -- new campiagn should be created
					campaign.name = req.body.name; 	
					campaign.budget = req.body.budget;
					campaign.status = req.body.status;

					//because mediabuyer has already pushed campaign, we only need to save the campaign in question, not the mediabuyer
					campaign.save(function(err) {

						//ensure attributes are valid
						if (err){
							console.log('error updating campiagn -- invalid attributes');
							res.send(err);
						} else{

							console.log('updating a specific campaign');
							res.json({message: 'Campaign has been updated.'});
						}
					});
				}
			}
		});
	});


/*========================================================================

Query all ads belonging to a campaign (GET)
Create an ad under a specific campaign (POST)

==========================================================================*/


router.route('/mediabuyers/:mediabuyer_id/campaigns/:campaign_id/ads')

	.get(function(req, res){

		//Find mediabuyer by id :mediabuyer_id
		//Populate campiagn with id :campaign_id belonging to mediabuyer in question
		Mediabuyer.findById(req.params.mediabuyer_id).populate({
			
			path: 'campaigns', 
			match: {_id: req.params.campaign_id}

		}).exec(function(err, mediabuyer){

			//ensure mediabuyer exists
			if(err){
				console.log("invalid mediabuyer or campaign id");
				res.send(err);
			} else{

				//return campaign with specific id
				console.log('getting campaign with id ' + req.params.campaign_id);

				//grab the actual campiagn object out of the populated array
				campaign = mediabuyer.campaigns[0];

				//ensure campaign with id :campiagn_id exists
				//if mediabuyer has no campaigns created, the returned object could be null
				//population would have no effect in this scenario, but embedded objects are still accessible
				if(campaign == undefined){
					console.log('ERROR');
					res.json({message: 'error -- invalid campaign id'});
				} else{

					//if campiagn exists, return ads belonging to campaign
					console.log('returning all ads for campaign with id ' + req.params.campaign_id);
					res.json(campaign.ads);
				}				
			}
		});
	})


	.post(function(req, res){

		//find mediabuyer with id :mediabuyer_id
		//populate campaign with id :campaign_id
		Mediabuyer.findById(req.params.mediabuyer_id).populate({

			path: 'campaigns',
			match: {_id: req.params.campaign_id}

		}).exec(function(err, mediabuyer){

			//ensure :mediabuyer_id is valid
			if(err){
				console.log("invalid mediabuyer or campaign id");
				res.send(err);
			} else{

				//grab the actual campiagn object out of the populated array
				campaign = mediabuyer.campaigns[0];

				//ensure campaign with id :campiagn_id exists
				//if mediabuyer has no campaigns created, the returned object could be null
				//population would have no effect in this scenario, but embedded objects are still accessible
				if(campaign == undefined){
					console.log('error -- undefined campaign');
					res.json({message: 'error -- invalid campaign id'});
				} else{

					//create a new ad
					var ad = new Ad();
					ad.type = req.body.type;

					//set bidding attributes
					ad.bid.bidtype = req.body.bidtype;
					ad.bid.amount = req.body.amount;

					//set targeting spec
					ad.target.venue_name = req.body.venue_name;
					ad.target.venue_city = req.body.venue_city;
					ad.target.venue_street = req.body.venue_street;
					ad.target.venue_zip = req.body.venue_zip;
					ad.target.microlocation_descriptor_tag = req.body.microlocation_descriptor_tag;
					ad.target.microlocation_action_tag = req.body.microlocation_action_tag;
					ad.target.microlocation_price_tag = req.body.microlocation_price_tag;

					/*

						Add creative attributes here, otherwise your ad will not have anything to display!

						ad.creative.title = req.body.title;
						ad.creative.description = req.body.description;
					*/


					//push our ad
					campaign.ads.push(ad);

					//because mediabuyer has already pushed campaign, we only need to save the campaign in question
					campaign.save(function(err) {

						//ensure validity of ad attributes
						if (err){
							res.send(err);
							console.log('error creating ad');
						} else {
							console.log('adding a new ad to this campaign');
							res.json({message: 'Added a new ad to this campaign.'});
						}
					});
				}
			}
		});
	});


/*========================================================================

Query a specific ad belonging to a campaign (GET)
Edit an existing ad (POST)

==========================================================================*/


router.route('/mediabuyers/:mediabuyer_id/campaigns/:campaign_id/ads/:ad_id')

	.get(function(req, res){

		//find mediabuyer with id :mediabuyer_id
		//populate campaign with id :campaign_id
		Mediabuyer.findById(req.params.mediabuyer_id).populate({
			
			path: 'campaigns', 
			match: {_id: req.params.campaign_id}

		}).exec(function(err, mediabuyer){

			//ensure :mediabuyer_id is valid
			if(err){
				res.send(err);
				console.log("Not a valid mediabuyer, campaign, or ad id");
			} else {

				//grab the actual campiagn object out of the populated array
				campaign = mediabuyer.campaigns[0];

				//ensure campaign with id :campiagn_id exists
				//if mediabuyer has no campaigns created, the returned object could be null
				//population would have no effect in this scenario, but embedded objects are still accessible
				if (campaign == undefined){
					console.log('error -- undefined campaign');
					res.json({message: 'error -- invalid campaign id'});
				} else{

					//WORTH ADDING AN ERROR CHECK FOR AN AD HERE?
					var ad = campaign.ads.id(req.params.ad_id);

					if(ad == undefined){
						console.log('error - invalid ad id');
						res.json({message: 'error -- invalid ad id'});
					} else{
						//return campaign with specific id
						console.log('getting ad with id ' + req.params.ad_id);
						res.json(ad);
					}
				}
			}
		});
	})


.put(function(req, res){

		//Find desired mediabuyer, populating only campaign with id :campaign_id
		Mediabuyer.findById(req.params.mediabuyer_id).populate({
			
			path: 'campaigns', 
			match: {_id: req.params.campaign_id}

		}).exec(function(err, mediabuyer){
			
			if(err){
				res.send(err);
				console.log("Not a valid mediabuyer, campaign, or ad id");
			} else{

				//grab the actual campiagn object out of the populated array
				campaign = mediabuyer.campaigns[0];

				//ensure campaign with id :campiagn_id exists
				//if mediabuyer has no campaigns created, the returned object could be null
				//population would have no effect in this scenario, but embedded objects are still accessible
				if(campaign == undefined){
					console.log('error -- undefined campaign');
					res.json({message: 'error -- invalid campaign id'});
				} else{

					//store the ad with id :ad_id
					ad = campaign.ads.id(req.params.ad_id);

					//check ad validity
					if(ad == undefined){
						console.log('error -- undefined ad');
						res.json({message: 'error -- invalid ad id'});
					} else{

						//change your ad status if desired
						ad.status = req.body.status;

						//set bidding values
						ad.bid.bidtype = req.body.bidtype;
						ad.bid.amount = req.body.amount;

						//set targeting spec
						ad.target.venue_name = req.body.venue_name;
						ad.target.venue_city = req.body.venue_city;
						ad.target.venue_street = req.body.venue_street;
						ad.target.venue_zip = req.body.venue_zip;
						ad.target.microlocation_descriptor_tag = req.body.microlocation_descriptor_tag;
						ad.target.microlocation_action_tag = req.body.microlocation_action_tag;
						ad.target.microlocation_price_tag = req.body.microlocation_price_tag;

						/*

							Add creative attributes here for updating.

							ad.creative.title = req.body.title;
							ad.creative.description = req.body.description;
						*/


						//save campaign object
						campaign.save(function(err){

							//ensure validity of ad attributes
							if (err) {
								res.send(err);
								console.log('error updating ad');
							}
							else {
								console.log('updating advertisement');
								res.json({message: "Ad has been updated"});
							}
						});
					}
				}
			}
		});
	});



module.exports = router;