require('babel-core/register');
const http = require('http');
const app = require('./app');
const fs = require('fs');
const config = require('./config')(process.env.NODE_ENV);
const PORT = process.env.PORT;

if (process.env.NODE_ENV.includes('NIXDEV')) {
  try {
    fs.unlinkSync(`${config.port}`);
  } catch (err) { }

}

http.createServer(app).listen(PORT || config.port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Start listening on ${PORT || config.port}`);
    if (process.env.NODE_ENV.includes('NIXDEV')) {
      fs.chmodSync(config.port, '777');
    }
  }
});