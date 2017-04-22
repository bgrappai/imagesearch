import mongoose from 'mongoose';
 
var searchHistorySchema = mongoose.Schema({
  timestamp: Number,
  query: String
});
searchHistorySchema.index({ timestamp: 1 });
 
module.exports = mongoose.model('SearchHistory', searchHistorySchema);