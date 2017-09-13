const express = require('express');
const app = express();

app.use('/', express.static('../web'));

app.get('/api', function (req, res) {
    res.send('API is not ready yet :(');
});

// app.get('/', function (req, res) {
//     res.send('Hello World!')
// });

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
