import corsAnywhere from 'cors-anywhere';

// Configure CORS Anywhere
const host = '0.0.0.0';
const port = 8080;

// Create the CORS Anywhere server
corsAnywhere.createServer({
  originWhitelist: [], // Allow all origins
}).listen(port, host, () => {
  console.log(`CORS Anywhere proxy server running on ${host}:${port}`);
});
