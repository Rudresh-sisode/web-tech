/**
 * primary files for the API
 */
// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const _data = require('./lib/data');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');

// TESTING
// @TODO delete this

_data.delete('test', 'newFile', (err) => {
    console.log('this was the error', err);
});

// _data.update('test', 'newFile', {'fizz': 'buzz'}, (err) => {
//     console.log('this was the error', err);
// });

// _data.read('test', 'newFile', (err, data) => {
//     console.log('this was the error', err, 'and this was the data', data);
// });

// _data.create('test', 'newFile', {'foo': 'bar'}, (err) => {
//     console.log('this was the error', err);
// });

// Instantiate the HTTP server
const httpServer = http.createServer((req, res) => {
   unifiedServer(req, res);
    
});

// Start the server
httpServer.listen(config.httpPort, () => {
  console.log('The server is listening on port '+config.httpPort);
});


// Instantiate the HTTPS server
let httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
};
const httpsServer = https.createServer(httpsServerOptions,(req, res) => {
    unifiedServer(req, res);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, () => {
    console.log('The server is listening on port '+config.httpsPort);
});


// All the server logic for both the http and https server
const unifiedServer = (req, res) => {
     // Get the URL and parse it
     const parsedUrl = url.parse(req.url, true);

     // Get the path
     const path = parsedUrl.pathname;
     const trimmedPath = path.replace(/^\/+|\/+$/g, '');
 
     // Get the query string as an object
     const queryStringObject = parsedUrl.query;
 
     //get the HTTP method
     const method = req.method.toLowerCase();
 
     //getting the headers as an object
     const headers = req.headers;
 
     //get the payload, if any
     const decoder = new StringDecoder('utf-8');
     let buffer = '';
     req.on('data', (data) =>{
         buffer += decoder.write(data);
     })
 
     req.on('end', () => {
         buffer += decoder.end();
 
         // Choose the handler this request should go to. If one is not found, use the notFound handler
         const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
 
         // Construct the data object to send to the handler
         const data = {
             'trimmedPath' : trimmedPath,
             'queryStringObject' : queryStringObject,
             'method' : method,
             'headers' : headers,
             'payload' : helpers.parseJsonToObject(buffer)
         };
 
         // Route the request to the handler specified in the router
         chosenHandler(data, (statusCode, payload) => {
             // Use the status code called back by the handler, or default to 200
             statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
 
             // Use the payload called back by the handler, or default to an empty object
             payload = typeof(payload) == 'object' ? payload : {};
 
             // Convert the payload to a string
             const payloadString = JSON.stringify(payload);
 
             // Return the response
             res.setHeader('Content-Type', 'application/json');
             res.writeHead(statusCode);
             res.end(payloadString);
 
             // Log the request path
             console.log('Returning this response: ', statusCode, payloadString);
         });
 
         // Send the response
         // res.end('Hello World\n');
         // Log the request path
         console.log('Request received on path: ' + trimmedPath + ' with method: ' + method+' and with these query string parameters', queryStringObject);
         console.log('Request received with these headers', headers);
         console.log('Request received with this payload', buffer);
         
     });
 
     // Send the response
};


// Define a request router
const router = {
    'ping': handlers.ping,
    'users': handlers.users
};

