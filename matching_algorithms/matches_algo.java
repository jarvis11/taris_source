
/*=============================================================================================


A clearance algorithm of some sort must be implemented in order to power your BLE targeting system.
When a mediabuyer enters targeting specs, it’s up to your platform to determine which BLE devices, and 
subsequently which mobile devices, these targeting specs correspond to. Most efficient systems take this a 
step further, and integrate real time bidding to push revenues and only clear advertisers with engaging content.


This code is for reference only. It doesnt take a great developer to see that this code completely sucks. It was put together
in a matter of 15-20mins for example purposes. Please only use this as a guide, and do not use this in production
code. 

This code could be broken up into 1000 different methods in order to increase readability and
efficiency. If there are high amounts of requests for a basic matching / RTB algorithm, we
could release an additional platform (in Java) to create a starting point for developers. Because matching algorithms are 
typically highly customized, we have not done this at this time.

To make such a request just drop us a note at hello@taristech.com. If enough of you request it,
we will upload a new project with a basic, but clean algorithm. We promise :)




=============================================================================================*/            

            //GRAB ALL VENUES
            List<JSONObject> json_venues = VenueParser.getVenues(tarisDB.getCollection("venues"));


            List<JSONObject> json_microlocations = new ArrayList<JSONObject>();

            //NOW WE HAVE A LIST FULL OF JSON VENUES. LET PARSE THROUGH THAT LIST AND FIND MATCHES, ADDING ALL VALID MICROLOCATIONS TO A NEW ARRAY
            for(int i = 0; i < json_venues.size(); i++){

                //CHECK IF AD HAS VENUE NAME PARAMETER, AND IF IT MATCHES OUR VENUE, THEN ONLY CONCENTRATE ON THAT VENUE
                //ELSE CHECK ADDRESS PARAMETERS
                if((advertisement.getJSONObject("target").has("venue_name") && advertisement.getJSONObject("target").get("venue_name").equals(json_venues.get(i).get("name")))
                        || !advertisement.getJSONObject("target").has("venue_name")){



                    //GET JSON ARRAY OF ADDRESSES
                    JSONArray addressArray = json_venues.get(i).getJSONArray("addresses");

                    for(int j = 0; j < addressArray.length(); j++){

                        //NOW CHECK EACH ADDRESS FOR AD PARAMETERS
                        if((advertisement.getJSONObject("target").has("venue_street")
                                && advertisement.getJSONObject("target").get("venue_street")
                                .equals(addressArray.getJSONObject(i).get("street")))
                                || !advertisement.getJSONObject("target").has("venue_street")){

                            if((advertisement.getJSONObject("target").has("venue_city")
                                    && advertisement.getJSONObject("target").get("venue_city")
                                    .equals(addressArray.getJSONObject(i).get("city")))
                                    || !advertisement.getJSONObject("target").has("venue_city")){

                                if((advertisement.getJSONObject("target").has("venue_state")
                                        && advertisement.getJSONObject("target").get("venue_state")
                                        .equals(addressArray.getJSONObject(i).get("state")))
                                        || !advertisement.getJSONObject("target").has("venue_state")){


                                    if((advertisement.getJSONObject("target").has("venue_zip")
                                            && advertisement.getJSONObject("target").get("venue_zip")
                                            .equals(addressArray.getJSONObject(i).get("zip")))
                                            || !advertisement.getJSONObject("target").has("venue_zip")){

//                                        System.out.println(addressArray.getJSONObject(j).
//                                                getJSONArray("microlocations").getJSONObject(0).getJSONArray("descriptor_tag").get(0));

                                        JSONArray microlocations_array = addressArray.getJSONObject(j).getJSONArray("microlocations");
                                        for(int z = 0; z < microlocations_array.length(); z++){
                                            json_microlocations.add(microlocations_array.getJSONObject(z));
                                        }



                                    }
                                }
                            }
                        }

                    }
                }
            }


            List<JSONObject> descriptor_tag_matches = new ArrayList<JSONObject>();


            for(int i = 0; i < json_microlocations.size(); i++){

                System.out.println(json_microlocations.get(i));

                //CHECK IF EACH MICROLOCATIONS IS VALID
                //FIRST CHECK FOR DESCRIPTOR TAGS
                if(advertisement.getJSONObject("target").has("microlocation_descriptor_tag")){

                    List<Object> adDescriptorTags = new ArrayList<Object>();
                    for(int j = 0; j < advertisement.getJSONObject("target").
                            getJSONArray("microlocation_descriptor_tag").length(); j++){
                        adDescriptorTags.add(advertisement.getJSONObject("target").
                                getJSONArray("microlocation_descriptor_tag").get(j));
                    }

                    List<Object> microlocationDescriptorTags = new ArrayList<Object>();
                    for(int j = 0; j < json_microlocations.get(i).getJSONArray("descriptor_tag").length(); j++){
                        System.out.println(json_microlocations.get(i).get("_id"));

                        microlocationDescriptorTags.add(json_microlocations.get(i).getJSONArray("descriptor_tag").get(j));
                    }


                    if(microlocationDescriptorTags.containsAll(adDescriptorTags)){
                        descriptor_tag_matches.add(json_microlocations.get(i));
                    }

                }  else {
                    descriptor_tag_matches.add(json_microlocations.get(i));
                }

            }



            List<JSONObject> action_tag_matches = new ArrayList<JSONObject>();


            for(int i = 0; i < descriptor_tag_matches.size(); i++){

                //CHECK IF EACH MICROLOCATIONS IS VALID
                //FIRST CHECK FOR DESCRIPTOR TAGS
                if(advertisement.getJSONObject("target").has("microlocation_action_tag")){

                    List<Object> adActionTags = new ArrayList<Object>();
                    for(int j = 0; j < advertisement.getJSONObject("target").
                            getJSONArray("microlocation_action_tag").length(); j++){
                        adActionTags.add(advertisement.getJSONObject("target").
                                getJSONArray("microlocation_action_tag").get(j));
                    }

                    List<Object> microlocationActionTags = new ArrayList<Object>();
                    for(int j = 0; j < json_microlocations.get(i).getJSONArray("action_tag").length(); j++){

                        microlocationActionTags.add(json_microlocations.get(i).getJSONArray("action_tag").get(j));
                    }


                    if(microlocationActionTags.containsAll(adActionTags)){
                        action_tag_matches.add(descriptor_tag_matches.get(i));
                    }
                } else {
                    action_tag_matches.add(descriptor_tag_matches.get(i));
                }

            }

            List<JSONObject> final_matches = new ArrayList<JSONObject>();


            for(int i = 0; i < action_tag_matches.size(); i++){

                //CHECK IF EACH MICROLOCATIONS IS VALID
                //FIRST CHECK FOR DESCRIPTOR TAGS
                if(advertisement.getJSONObject("target").has("microlocation_price_tag")){

                    List<Object> adPriceTags = new ArrayList<Object>();
                    for(int j = 0; j < advertisement.getJSONObject("target").
                            getJSONArray("microlocation_price_tag").length(); j++){
                        adPriceTags.add(advertisement.getJSONObject("target").
                                getJSONArray("microlocation_price_tag").get(j));
                    }

                    List<Object> microlocationPriceTags = new ArrayList<Object>();
                    for(int j = 0; j < json_microlocations.get(i).getJSONArray("price_tag").length(); j++){

                        microlocationPriceTags.add(json_microlocations.get(i).getJSONArray("price_tag").get(j));
                    }

                    if(microlocationPriceTags.containsAll(adPriceTags)){
                        final_matches.add(action_tag_matches.get(i));
                    }
                } else {
                    final_matches.add(action_tag_matches.get(i));
                }

            }

            for(int i = 0; i < final_matches.size(); i++){
                System.out.println(final_matches.get(i).get("uuid"));
            }
