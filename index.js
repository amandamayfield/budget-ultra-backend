const express = require('express');
const app = express();

// Route Registration
app.get('/', (request, response) => response.send('Hello World!'));

// Run zee app
app.listen(3000, () => console.log('Example app listening on port 3000!'));
