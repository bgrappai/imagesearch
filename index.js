require('babel-register');
 
const app = require('./src/app').app,
      port = process.env.PORT || 8080;
 
app.listen(port, function() {
  console.log('Image search listening on port', port);
});