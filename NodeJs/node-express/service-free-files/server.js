const http = require('http');

const hostname = "127.0.0.1";

const port = 8080;

//create http server
const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/plain"
  });
  res.end("Hello word");
});

server.listen(port, "localhost", () => {
  console.log(`server running at http://${hostname}:${port}/`);
})