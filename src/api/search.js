import express from 'express';

var SearchHistory = require ('../models/searchHistory');
 
// import Search from 'bing.search';
var Bing = require('node-bing-api')({ accKey: 'APIKEY' });


export const searchApi = express.Router();
 
searchApi.get('/search/:query', (req, res) => {
  // Image search logic
  let query = req.params.query, // Get the query from the path parameters object
      offset = req.query.offset,
      timestamp = Date.now();   // Get the unix timestamp
 if (offset === undefined)
    offset=0;
  // BING SEARCH MAGIC WILL HAPPEN HERE //
 Bing.images(query, {offset: offset}, (error, response, body) => {
    if (error) {
      res.status(500).json(error); // We return an error code
    } else {
      var searcharray = [];
      body.value.forEach(function(element){
        searcharray.push("{name: "+element.name+",thumbnailUrl: "+element.thumbnailUrl+",contentUrl: "+element.contentUrl+"}");
      });
      res.status(200).json(searcharray); // We return the results
    }
  });
  
  // We save a new search history entry asynchronously
  let queryHistory = new SearchHistory({ query, timestamp }); // Notice ES6 here!
  queryHistory.save();
});
 
searchApi.get('/latest', (req, res) => {
  // Last searches logic
  SearchHistory
    .find() // We search for every entry
    .select({ _id: 0, query: 1, timestamp: 1 }) // We want timestamp and query back, but not the default _id field
    .sort({ timestamp: -1 }) // Order by DESCENDING timestamp
    .limit(10) // Limit the result to 10 entries
    .then(results => {  // Finally, return the results
      res.status(200).json(results);
    });
});