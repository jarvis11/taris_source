/**TARIS README**/

Taris is an open source project aimed at helping ad tech initiatives create simple, efficient, and effective BLE marketing solutions. Most documentation can be found in our API docs, located at http://docs.tarisadsapi.apiary.io/. Please check here for any updates, changes, or depreciations. 

Taris is powered by a Node/Express/Mongoose stack, and follows an MVC architecture. Taris is meant to specifically work with MongoDB. All models can be found within the models folder, with BLE registration schemas found within the venue_document folder, and advertiser based schemas found within the campaign_document and mediabuyer_document folders. 

All routes can be found within the routes folder. The file matches_routes.js has been depreciated, but remains within the project as a guide to those looking to create a bid clearence system in their application. A Java example can be found in our documentation. It is not recommended that you include your clearence system within node. Instead off load this for increased computational efficiency. 