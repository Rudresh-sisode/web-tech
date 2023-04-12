/**
 * primary files for the API
 */
// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// The server should respond to all requests with a string
const server = http.createServer((req, res) => {
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
            'payload' : buffer
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
    
});

// Start the server
server.listen(config.httpPort, () => {
  console.log('The server is listening on port '+config.httpPort+' in '+config.envName+' now');
});

//define the handlers
const handlers = {};

//sample handler
handlers.sample = (data, callback) => {
    //callback a http status code, and a payload object
    callback(406, {'name': 'sample handler'});
};

// Not found handler

handlers.notFound = (data, callback) => {
    callback(404);
};

// Define a request router
const router = {
    'sample': handlers.sample
};